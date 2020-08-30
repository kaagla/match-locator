from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import re
import json
import numpy as np
import pandas as pd
from datetime import date, timedelta
import time
import requests
import pymongo
from dotenv import load_dotenv
import os

load_dotenv()

start_all = time.time()
client = pymongo.MongoClient(os.getenv("MONGODB_CLIENT"))
db = client["mldb"]

locations = pd.DataFrame(list(db['locations'].find()))
location_venue_dict = list(db['venuedict'].find())

if len(location_venue_dict) == 0:
    location_venue_dict = {}
else:
    location_venue_dict = location_venue_dict[0]

try:
    # Prepare driver
    options = Options()
    options.headless = True
    options.add_argument("--log-level=3")
    driver = webdriver.Chrome('chromedriver', options=options)
    
    
    # Get regions
    start_time = time.time()
    driver.get('https://www.palloliitto.fi/ottelut-ja-sarjat/tulospalveluarkisto')
    source = driver.page_source
    soup = BeautifulSoup(source, 'html.parser')
    a_list = soup.find_all('a')
    regions_list = [x for x in a_list if ('2020 jalkapallo' in x.get_text() and 'turnaukset' not in x.get_text())]
    regions_list = list(dict.fromkeys(regions_list))
    regions = [{'name': x.get_text(), 'link': 'https://www.palloliitto.fi'+x.get('href'), 'region': x.get_text().split(' ')[-1]} for x in regions_list]
    print('duration', int((time.time()-start_time)/60), 'minutes.')
    print(len(regions), 'regions added.')
    
    
    # Get leagues
    start_time = time.time()
    leagues = pd.DataFrame()
    for region in regions:
        driver.get(region['link'])
        source = driver.page_source
        soup = BeautifulSoup(source, 'html.parser')
        leagues_div = soup.find_all('div', class_='torneopal_widget')[1]
        leagues_list = leagues_div.find_all('a')
        if len(leagues_list) > 0:
            dict_leagues = [{'name': x.get_text(), 'link': region['link']+x.get('href'), 'region': region['name'].split(' ')[-1]} for x in leagues_list if 'talvi' not in x.get_text()]
            leagues = leagues.append(dict_leagues, ignore_index=True)
            
    # Fix known errors
    leagues.loc[leagues['name'] == 'Ykkönen', ['name']] = 'Miesten Ykkönen'
    leagues.loc[leagues['name'] == 'Kakkonen', ['name']] = 'Miesten Kakkonen'
    
    print('duration', int((time.time()-start_time)/60), 'minutes.')
    print(len(leagues), 'leagues added')
    
    
    # Get matches
    start_time = time.time()
    matches = pd.DataFrame()
    ongoing_region = 'x'
    for league in leagues.to_dict(orient='records'):
        if league['region'] != ongoing_region:
            ongoing_region = league['region']
            print(ongoing_region, ' region in progress...')

        driver.get(league['link'])
        source = driver.page_source
        soup = BeautifulSoup(source, 'html.parser')

        try:
            matches_ = soup.find('table', class_='scheduletable torneopalwidget')
            df_matches = pd.read_html(str(matches_))
            df_matches = df_matches[0]
            df_matches.dropna(how='any', subset=['Tulos'], inplace=True)
            df_matches = df_matches[df_matches.nunique(axis=1) > 1]
            if 'Pv' in df_matches.columns:
                df_matches.drop('Pv', axis='columns', inplace=True)
            df_matches.columns = ['date','time','venue_name','home_name','away_name','score']
            score_tags = soup.find_all('td', class_='score')
            ids = [int(x.find('a').get('href').split('/')[-1].split('&')[-1]) for x in score_tags]
            df_matches['_id'] = ids

            try:
                pitch_tags = soup.find_all('td', class_='pitch')
                for x in pitch_tags:
                    try:
                        if x.find('a').get('title').replace('.','') not in location_venue_dict:
                            location_venue_dict.update({ x.find('a').get('title').replace('.',''): int(x.find('a').get('href').split('&')[-1]) })
                    except:
                        pass
            except:
                pass
            if league['region'] == 'valtakunnallinen':
                df_matches['level'] = league['name']
            else:
                df_matches['level'] = league['name'] + ' (' + league['region'] + ')'

            matches = pd.concat([matches, df_matches], ignore_index=True)
        except:
            print('error with', league['link'])

    print('duration', int((time.time()-start_time)/60), 'minutes.')
    
    matches.drop_duplicates(subset=['_id'], keep='first', inplace=True)
    matches.dropna(subset=['venue_name'], inplace=True)
    matches['venue_name'] = [x.replace('.','') for x in matches['venue_name'].values.tolist()]
    
    # Update location id
    matches['location_id'] = [location_venue_dict.get(x) if x in location_venue_dict else -1 for x in matches['venue_name'].values.tolist()]
    
    print(len(matches), 'matches added')
    
    # Update location details
    start_time = time.time()
    error_list = []   
    skip = []
    count = 0
    
    no_details =  [x for x in matches['location_id'].unique().tolist() if x not in locations['_id'].values.tolist()]
    no_details_dict = {v:k for k,v in location_venue_dict.items() if v in no_details}
    no_details_dict = {v:k for k,v in no_details_dict.items()}
    
    print(len(no_details_dict), 'locations to be updated.')

    for key,value in no_details_dict.items():
        
        if key not in skip:
            driver.get("https://www.palloliitto.fi/tulospalveluarkisto/kentta?x&"+str(value))
            source = driver.page_source
            soup = BeautifulSoup(source, 'html.parser')
            name = key.replace('.','')
            location_details = soup.find('div', class_='torneopal_widget')

            try:
                coords = re.findall(r'q=(.*?)"', str(location_details))[0]
                address_all = re.findall(r'<br/>(.*?)<a', str(location_details))[0]

                surface = re.findall(r'Pinta: (.*?)<', str(location_details))[0]
                address = address_all.split(',')[0]
                postal_code = address_all.split(',')[1].strip().split(' ')[0]

                if len(address_all.split(',')[1].strip().split(' ')) == 1:
                    city = None
                else:
                    city = address_all.split(',')[1].strip().split(' ')[1]

                data_temp = {"_id": value, "name": name, "address": address, "postalcode": str(postal_code), "city": city, \
                            "coordinates": coords, "surface": surface}

                locations = locations.append(data_temp, ignore_index=True)

                try:
                    driver.get("https://www.palloliitto.fi/tulospalveluarkisto/paikka?x&"+str(value))
                    source = driver.page_source
                    soup = BeautifulSoup(source, 'html.parser')
                    matches_table = soup.find('table', class_='scheduletable torneopalwidget ')
                    df_matches = pd.read_html(str(matches_table))
                    for venue_name in df_matches[0]['Kenttä'].unique().tolist():
                        location_venue_dict.update({ venue_name.replace('.',''): value })
                        skip.append(venue_name.replace('.',''))
                except:
                    pass

            except IndexError:
                error_list.append(key.replace('.',''))
            
            skip.append(key.replace('.',''))
            
            count += 1
            if count % 100 == 0:
                print(count, '/', len(no_details_dict), 'done.')
                
    # Fix known errors
    if 545 not in locations['_id'].values.tolist():
        locations.append({'_id': 545,'address': 'Paavo Nurmen tie 1','city': 'Helsinki','coordinates': '60.187749, 24.927332',
                        'name': 'Olympiastadion N','postalcode': '00250','surface': 'nurmi'}, ignore_index=True)
    
    if 4852 in locations['_id'].values.tolist():
        locations.loc[locations['_id'] == 4852, ['city']] = 'Vaasa'
    
    # Remove duplicate locations
    u_coords = []
    for x in locations[locations['coordinates'].duplicated()]['coordinates'].values.tolist():
        if x not in u_coords:
            u_coords.append(x)
    
    for x in u_coords:
        ids = locations[locations['coordinates'] == x]['_id'].values.tolist()
        keep = ids[0]
        for k,v in location_venue_dict.items():
            if v in ids:
                location_venue_dict.update({ k: int(keep) })
    
    locations.drop_duplicates(subset=['coordinates'], keep='first', inplace=True)
    
    print('Done, duration', int((time.time()-start_time)/60), 'minutes.')
    print(len(locations), 'locations total.')
    print(len(error_list), 'errors occurred.')
    
    # Update location id
    matches['location_id'] = [location_venue_dict.get(x) if x in location_venue_dict else -1 for x in matches['venue_name'].values.tolist()]
    
    
    # Google missing location ids
    
    if len(matches[matches['location_id'] == -1]['venue_name'].unique().tolist()) > 0:
        start_time = time.time()
        found_venues = {}
        not_found = []
        count = 0
        for look_for in matches[matches['location_id'] == -1]['venue_name'].unique().tolist():
            try:
                page = requests.get("https://www.google.com/search?q=palloliitto+areena+"+str(look_for))
                venue_id = re.findall(r'/areena/(.*?)&', str(page.content))[0]
                location_venue_dict.update({ look_for: int(venue_id) })
                found_venues.update({ look_for: int(venue_id) })
            except:
                not_found.append(look_for)
            count += 1
            if count % 10 == 0:
                print(count, '/', len(matches[matches['location_id'] == -1]['venue_name'].unique().tolist()), 'done.')

        print('Completed in', int((time.time()-start_time)/60), 'minutes.')
        
        # Update location id
        matches['location_id'] = [location_venue_dict.get(x) if x in location_venue_dict else -1 for x in matches['venue_name'].values.tolist()]
    
    
    
    # Update location details
    start_time = time.time()
    error_list = []   
    skip = []
    count = 0
    
    no_details =  [x for x in matches['location_id'].unique().tolist() if x not in locations['_id'].values.tolist()]
    
    if len(no_details) > 0:
        no_details_dict = {v:k for k,v in location_venue_dict.items() if v in no_details}
        no_details_dict = {v:k for k,v in no_details_dict.items()}

        print(len(no_details_dict), 'locations to be updated.')

        for key,value in no_details_dict.items():

            if key not in skip:
                driver.get("https://www.palloliitto.fi/tulospalveluarkisto/kentta?x&"+str(value))
                source = driver.page_source
                soup = BeautifulSoup(source, 'html.parser')
                name = key.replace('.','')
                location_details = soup.find('div', class_='torneopal_widget')

                try:
                    coords = re.findall(r'q=(.*?)"', str(location_details))[0]
                    address_all = re.findall(r'<br/>(.*?)<a', str(location_details))[0]

                    surface = re.findall(r'Pinta: (.*?)<', str(location_details))[0]
                    address = address_all.split(',')[0]
                    postal_code = address_all.split(',')[1].strip().split(' ')[0]

                    if len(address_all.split(',')[1].strip().split(' ')) == 1:
                        city = None
                    else:
                        city = address_all.split(',')[1].strip().split(' ')[1]

                    data_temp = {"_id": value, "name": name, "address": address, "postalcode": str(postal_code), "city": city, \
                                "coordinates": coords, "surface": surface}

                    locations = locations.append(data_temp, ignore_index=True)

                    try:
                        driver.get("https://www.palloliitto.fi/tulospalveluarkisto/paikka?x&"+str(value))
                        source = driver.page_source
                        soup = BeautifulSoup(source, 'html.parser')
                        matches_table = soup.find('table', class_='scheduletable torneopalwidget ')
                        df_matches = pd.read_html(str(matches_table))
                        for venue_name in df_matches[0]['Kenttä'].unique().tolist():
                            location_venue_dict.update({ venue_name.replace('.',''): value })
                            skip.append(venue_name.replace('.',''))
                    except:
                        pass

                except IndexError:
                    error_list.append(key.replace('.',''))

                skip.append(key.replace('.',''))

                count += 1
                if count % 100 == 0:
                    print(count, '/', len(no_details_dict), 'done.')


        # Remove duplicate locations
        u_coords = []
        for x in locations[locations['coordinates'].duplicated()]['coordinates'].values.tolist():
            if x not in u_coords:
                u_coords.append(x)

        for x in u_coords:
            ids = locations[locations['coordinates'] == x]['_id'].values.tolist()
            keep = ids[0]
            for k,v in location_venue_dict.items():
                if v in ids:
                    location_venue_dict.update({ k: int(keep) })

        locations.drop_duplicates(subset=['coordinates'], keep='first', inplace=True)

        print('Done, duration', int((time.time()-start_time)/60), 'minutes.')
        print(len(locations), 'locations total.')
        print(len(error_list), 'errors occurred.')
        
    # Update location id
    matches['location_id'] = [location_venue_dict.get(x) if x in location_venue_dict else -1 for x in matches['venue_name'].values.tolist()]
    
    
    # Clean matches table
    matches['date'] = [x+"2020" if x.split('.')[-1] != '2019' else x for x in matches['date'].values.tolist()]
    
    def getStartDate(x):
        if len(x.split("-")) == 1:
            return x
        elif x[0] == '-':
            return xxsplit('-')[1]
        elif len(x.split("-")[0].split(".")[1]) == 0:
            d = x.split("-")[0]
            m_y = x.split(".")[2] + ".2020"
            return d+m_y
        else:
            return x.split("-")[0]+"2020"
    
    def getEndDate(x):
        if len(x.split("-")) == 1:
            return x
        elif x.split("-")[-1] == '2020':
            return x.replace('-','')
        else:
            return x.split("-")[1]
        
    matches['start_date'] = [getStartDate(x) for x in matches['date'].values.tolist()]
    matches['end_date'] = [getEndDate(x) for x in matches['date'].values.tolist()]
    matches['date'] = [x.replace('-','') if x.split("-")[-1] == '2020' else x for x in matches['date'].values.tolist()]
    
    matches['start_date'] = pd.to_datetime(matches['start_date'], format='%d.%m.%Y')
    matches['end_date'] = pd.to_datetime(matches['end_date'], format='%d.%m.%Y')
    
    matches.sort_values(by=['start_date','time'], inplace=True)
    matches['score'] = ['-' if x in ['ennakko','ilmoita'] else x for x in matches['score'].values.tolist()]
    
    matches.fillna('', inplace=True)
    
    # Clean locations table
    
    locations['postalcode'] = [((5-len(str(x)))*'0')+str(x) for x in locations['postalcode'].values.tolist()]
    lat_list = []
    lon_list = []
    for index, row in locations.iterrows():
        lat, lon = row['coordinates'].split(',')
        lat_list.append(float(lat))
        lon_list.append(float(lon))
    locations['lat'] = lat_list
    locations['lon'] = lon_list
    
    locations.fillna('', inplace=True)
    
    # Update DB
    
    if len(matches) > 10000:
        db['matches'].drop()
        matches_records = matches.to_dict(orient='records')
        matches_collection = db['matches']
        matches_collection.insert_many(matches_records)
        
        try:
            db['info'].drop()
            info_collection = db['info']
            info_collection.insert_one({'updated': date.today().strftime("%Y-%m-%d")})
        except:
            pass
        print('matches updated.')
    
    if len(locations) > 300:
        db['locations'].drop()
        locations_records = locations.to_dict(orient='records')
        locations_collection = db['locations']
        locations_collection.insert_many(locations_records)
        print('locations updated.')
        
    if len(location_venue_dict) > 300:
        db['venuedict'].drop()
        venue_dict_collection = db['venuedict']
        venue_dict = {k.replace('.',''): v for k,v in location_venue_dict.items()}
        venue_dict_collection.insert_one(venue_dict)
        print('venue_dict updated.')

finally:
    try:
        driver.close()
    except:
        pass
    
print('Done, update process duration', int((time.time()-start_all)/60), 'minutes.')