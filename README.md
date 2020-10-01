# Match locator
The idea is to show Finnish football matches in the perspective of location on the map. User can filter the search results by time period, location, league and team. The data is collected from Football Association of Finland (FAF, Suomen palloliitto) website https://www.palloliitto.fi using a Python script, and stored in a database.

Technology:
- Database: MongoDB (https://www.mongodb.com)
- Backend: Python Flask (https://flask.palletsprojects.com/)
- Frontend: React (https://reactjs.org/) with Leaflet map (https://leafletjs.com/)

Demo: https://missa-pelaa.herokuapp.com

The objective is responsive design for the app, so that it works on any browser and screen size. The app is under continuous development and the optimization is currently focused on desktop and 4" screen size. There are some issues with small screen size.

Future development plans:
- Progressive Web Application
- Expansion to other sports (futsal, ice hockey, etc.)

# Installation
Work in progress...

# Data collection
/collect-data/update-db.py script collects the data:
- matches: all matches are collected during the update and matches collection is replaced in database.
- locations: new locations are added to locations collection in the database.
- venue dictionary: maps venue name to location id and is updated during the update process.
- info: provides the date information for the update.

Notes:
- As the app shows the results of the past matches and there can be changes in match schedules, the data collection should be run frequently (eg. daily).
- The script is highly depended on the FAF website, so changes can cause problems for data collection.
- The script includes repetitive code and will be modified in the future.
