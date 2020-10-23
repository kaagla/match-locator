from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import pandas as pd
import requests
from bs4 import BeautifulSoup
import json
import pymongo
from dotenv import load_dotenv
import os
import datetime

app = Flask(__name__, static_folder='./client/build', static_url_path='/')
CORS(app)

load_dotenv()

client = pymongo.MongoClient(os.getenv("MONGODB_CLIENT"))
db = client["mldb"]

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/info', methods=['GET'])
def getInfo():
    info = list(db['info_all'].find({},{'_id': 0}))
    return jsonify(info)

@app.route('/api/locations', methods=['GET'])
def getLocations():

    conds = {}
    if request.args.get('ids'):
        ids = [x for x in request.args.get('ids').split(',') if x != 'Ei tiedossa']
        conds = { '_id': { '$in': ids } }

    locations = list(db['locations_all'].find(conds))
    return jsonify(locations)

@app.route('/api/citycoordinates', methods=['POST'])
def getCityCoordinates():

    if request.json.get('city'):
        city = request.json.get('city')
        city_coords = list(db['locations_all'].aggregate([
            { '$match': {
                'city': city['name']
            }},
            { '$group': {
                    '_id': 0,
                    'city': { '$first': '$city' },
                    'lat': { '$avg': '$lat' },
                    'lon': { '$avg': '$lon' }
                }
            },
            { '$project': {
                '_id': 0
            }}
        ]))

    return jsonify(city_coords)

@app.route('/api/cities')
def getCities():
    
    cities = [
        {
            'type': 'city',
            'name': x
        }
    for x in db['locations_all'].distinct('city') if (type(x) == str and x != 'Ei tiedossa')]
    
    return jsonify(cities)

@app.route('/api/matches', methods=['POST'])
def getMatches():

    date_cond = {}
    conds = []
    
    if request.method == 'POST':
        if request.json.get('dates'):
            start, end = request.json.get('dates').split(',')
            sy, sm, sd = [int(x) for x in start.split('-')]
            ey, em, ed = [int(x) for x in end.split('-')]
            date_cond = { "start_date": {
                 "$gte": datetime.datetime(sy,sm,sd,0,0,0),
                 "$lte": datetime.datetime(ey,em,ed,23,59,59) 
            }}
           
        if request.json.get('team'):
            for team in request.json.get('team'):
                team_name, level = team['name'].split(' - ')
                conds.append({ '$and': [ { 'home_name': team_name }, { 'level': level } ]})
                conds.append({ '$and': [ { 'away_name': team_name }, { 'level': level } ]})
         
        if request.json.get('level'):
            for level in request.json.get('level'):
                conds.append({ 'level': level['name'] })

        
        if request.json.get('city'):
            for city in request.json.get('city'):
                conds.append({ 'city': city['name'] })

        if request.json.get('sport'):
            for sport in request.json.get('sport'):
                conds.append({ 'sport': sport })
    
    if len(conds) == 0:
        conds = [{}]
    
    matches = list(db['matches_all'].aggregate([
        {'$match': {
            '$and': [
                date_cond,
                { '$or': conds}
            ]
        }},
        {'$sort': {
            'start_date': 1,
            'time': 1
        }},
        {'$project': {
            'date': 1,
            'time': 1,
            'venue_name': 1,
            'location_id': 1,
            'city': 1,
            'level': 1,
            'home_name': 1,
            'away_name': 1,
            'score': 1,
            'sport': 1
        }}
    ]))

    return jsonify(matches)

@app.route('/api/teams')
def getTeams():
    
    teams = [
        {
            'type': 'team',
            'name': x['_id'],
            'sport': x['sport']
        }
        for x in db['matches_all'].aggregate([
            { '$group': {
                '_id': { '$concat': [ "$home_name", " - ", "$level" ] },
                'sport': { '$first' : "$sport" }
                }
            },
            { '$sort': { '_id':  1} }
        ])
    ]

    return jsonify(teams)

@app.route('/api/venues')
def getVenues():
    venues = [
        {
            'type': 'venue',
            'name': x
        }
    for x in db['matches_all'].distinct('venue_name')]
    
    return jsonify(venues)

@app.route('/api/levels')
def getLevels():

    levels = [
        {
            'type': 'level',
            'name': x['_id'],
            'sport': x['sport']
        }
        for x in db['matches_all'].aggregate([
            { '$group': {
                '_id': "$level",
                'sport': { '$first' : "$sport" }
                }
            },
            { '$sort': { '_id':  1} }
        ])
    ]

    return jsonify(levels)

@app.route('/api/standings', methods=['POST'])
def getStandings():

    selected = request.json.get('standings')

    team = None

    if selected['type'] == 'level':
        if len(selected['name'].split(' (')) > 1:
            region = 'spl'+selected['name'].split(' (')[1].replace('ä','a').replace(')','')
            league = selected['name'].split(' (')[0].replace(' ','-').lower()
            url = 'https://www.palloliitto.fi/'+region+'/'+league
        else:
            league = selected['name'].replace('ö','o').replace(' ','-').lower()
            if league == 'miesten-kakkonen':
                league = 'kakkonen'
            if 'futsal' in league:
                league = league + '-0'
            url = 'https://www.palloliitto.fi/'+league
    else:
        if len(selected['name'].split(' - ')[1].split(' (')) > 1:
            region = 'spl'+selected['name'].split(' - ')[1].split(' (')[1].replace('ä','a').replace(')','')
            league = selected['name'].split(' - ')[1].split(' (')[0].replace(' ','-').lower()
            url = 'https://www.palloliitto.fi/'+region+'/'+league
            team = selected['name'].split(' - ')[0]
        else:
            league = selected['name'].split(' - ')[1].replace('ö','o').replace(' ','-').lower()
            if league == 'miesten-kakkonen':
                league = 'kakkonen'
            if 'futsal' in league:
                league = league + '-0'
            url = 'https://www.palloliitto.fi/'+league
            team = selected['name'].split(' - ')[0]

    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')
    try:
        groups = soup.find('div', class_='block--pl-category-group-tabs')
        group_links = groups.find_all('a')
        group_list = []
        for x in group_links:
            name = x.get_text()
            if len(name.split(' ')) == 1:
                name = 'Lohko '+str(name)
            link = x.get('href')
            data = {
                'name': name,
                'link': link
            }
            group_list.append(data)
        
        standings = []
        for x in group_list:
            try:
                page_group = requests.get('https://www.palloliitto.fi'+x['link'])
                table_group = pd.read_html(page_group.content)[0]
                table_group.dropna(subset=['O','V','T','H','M','P'], inplace=True)

                if (str(team) in [x for x in table_group['Unnamed: 1'].values.tolist()]):
                    data = {
                        "name": x['name'],
                        "standings": []
                    }
                    for x in table_group.to_records():
                        data['standings'].append({
                            'team': x[2],
                            'played': int(x[4]),
                            'wins': int(x[5]),
                            'draws': int(x[6]),
                            'losses': int(x[7]),
                            'goals': x[8],
                            'scored': int(x[8].split('-')[0]),
                            'conceded': int(x[8].split('-')[1]),
                            'difference': int(x[8].split('-')[0]) - int(x[8].split('-')[1]),
                            'points': int(x[9])
                        })

                    standings.append(data)
                    break
                else:
                    if team == None:
                        data = {
                            "name": x['name'],
                            "standings": []
                        }
                        for x in table_group.to_records():
                            try:
                                data['standings'].append({
                                    'team': x[2],
                                    'played': int(x[4]),
                                    'wins': int(x[5]),
                                    'draws': int(x[6]),
                                    'losses': int(x[7]),
                                    'goals': x[8],
                                    'scored': int(x[8].split('-')[0]),
                                    'conceded': int(x[8].split('-')[1]),
                                    'difference': int(x[8].split('-')[0]) - int(x[8].split('-')[1]),
                                    'points': int(x[9])
                                })
                            except:
                                pass

                        standings.append(data)
            except:
                pass
    except:
        standings = []
        data = {
            "name": 'Sarja',
            "standings": []
        }
        table_group = pd.read_html(page.content)[0]
        for x in table_group.to_records():
            data['standings'].append({
                'team': x[2],
                'played': int(x[4]),
                'wins': int(x[5]),
                'draws': int(x[6]),
                'losses': int(x[7]),
                'goals': x[8],
                'scored': int(x[8].split('-')[0]),
                'conceded': int(x[8].split('-')[1]),
                'difference': int(x[8].split('-')[0]) - int(x[8].split('-')[1]),
                'points': int(x[9])
            })
        standings.append(data)

    return jsonify(standings)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.getenv('PORT'), debug=False)