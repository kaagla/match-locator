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

print(os.getenv("MONGODB_CLIENT"))

try:
    # Prepare driver
    options = Options()
    options.headless = True
    driver = webdriver.Chrome('chromedriver', options=options)

    # Get regions for testing
    driver.get('https://www.palloliitto.fi/ottelut-ja-sarjat/tulospalveluarkisto')
    source = driver.page_source
    soup = BeautifulSoup(source, 'html.parser')
    a_list = soup.find_all('a')
    regions_list = [x for x in a_list if ('2020 jalkapallo' in x.get_text() and 'turnaukset' not in x.get_text())]
    regions = [{'name': x.get_text(), 'link': 'https://www.palloliitto.fi'+x.get('href'), 'region': x.get_text().split(' ')[-1]} for x in regions_list]
    print(len(regions), 'regions added.')

finally:
    try:
        driver.close()
    except:
        pass

print('Done, update process duration', int((time.time()-start_all)), 'seconds.')