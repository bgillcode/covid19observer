import time
from datetime import datetime
from os import environ

from flask import Flask
from flask import request
from flask import jsonify
from flask import make_response
from flask import Response
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo
from pymongo import MongoClient

import simplejson
from bson.json_util import loads, dumps
import json
from bson import json_util
import re
import key

import pandas as pd
import numpy as np
import requests
from pandas.io.json import json_normalize
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.neighbors import KNeighborsRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import GridSearchCV
from sklearn.pipeline import Pipeline
import itertools
import pickle


app = Flask(__name__, static_folder='../build', static_url_path='/')
# Using the URI connection string for MongoDB as an environment variable
app.config["MONGO_URI"] = key.CONNECTION_STRING
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/foo": {"origins": "http://localhost:5000"}})
mongo = PyMongo(app)


@cross_origin(origin='*',headers=['Content-Type','Authorization'])
@app.route('/')
def index():
    return app.send_static_file('index.html')


# Used to get the forecasting information from the database by area name, area type, and the model that was used (lstm, prophet)
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
@app.route('/apic/getforecastinginformation')
def index14():
    print('okay')
    areaNameGiven = request.args.get('areanamegiven', default = '*', type = str)
    areaTypeGiven = request.args.get('areatypegiven', default = '*', type = str)
    model = request.args.get('model', default = '*', type = str)

    print(areaNameGiven)

    # Can switch databases from here
    dbss = mongo.cx['placedata']

    collectionNameUsed = 'forecasting_cases'

    areaType = areaTypeGiven

    # Used to store the documents that are returned
    docs = []

    queryCreated = {}

    # Return the forecast data for the area. If a valid name is not entered it will return 'Invalid name entered'
    if areaNameGiven != None and areaNameGiven != ' ' and areaNameGiven != '':
        queryCreated = dbss[collectionNameUsed].find({ "areaName" : re.compile(areaNameGiven, re.IGNORECASE), "model" : model, "areaType": areaType}, { '_id' : False }).sort("date", -1)
    else:
        return 'Invalid name entered'
    # Get the pymongo query response
    json_str = dumps(queryCreated, default=json_util.default)

    # Remove the NaN values and change them to null values to have a valid json response
    mt = json_str.replace('NaN', 'null')

    # Load it as an object
    record2 = loads(mt)

    # Return it as json
    response = jsonify(data=record2)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


# Gets the COVID-19 data for that area, using the area name, area type, and date given. Any of these are optional fields
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
@app.route('/apic/getoverview')
def index3():
    dateGiven = request.args.get('dategiven', default = '*', type = str)
    areaNameGiven = request.args.get('areanamegiven', default = '*', type = str)
    areaType = request.args.get('areatype', default = '*', type = str)

    print(dateGiven)
    print(areaNameGiven)
    print(areaType)

    # Check if date given in the parameter route is valid first
    start = ""
    if dateGiven != '*':
        try:
            start = datetime.strptime(dateGiven, '%Y-%m-%d')
        except ValueError:
            return 'Invalid date'


    # Can switch databases from here
    dbss = mongo.cx['placedata']

    # This variable controls how many maximum results are returned from queries
    limitAmount = 100

    areaNameOfOverview = "United Kingdom"

    collectionNameUsed = ''

    # Switch to see if area type has been selected from a predefined list
    areaTypeinlist = 0

    if areaType == 'ltla':
        # The collection name is set here to be searched through depending on the parameter that was passed, in this case for areaType
        collectionNameUsed = 'ltla_cases'
        # Used to limit the amount of search results returned for the different cases
        limitAmount = 400
        # Switch to see if area type has been selected from a predefined list
        areaTypeinlist = 1
    if areaType == 'utla':
        collectionNameUsed = 'utla_cases'
        limitAmount = 400
        areaTypeinlist = 1
    if areaType == 'region':
        collectionNameUsed = 'regions_cases'
        limitAmount = 1000
        areaTypeinlist = 1
    if areaType == 'nation':
        collectionNameUsed = 'nations_overview'
        limitAmount = 1000
        areaTypeinlist = 1
    if areaType == 'nhsregion':
        collectionNameUsed = 'nhsregions_overview'
        limitAmount = 1000
        areaTypeinlist = 1
    if areaType == 'overview':
        collectionNameUsed = 'unitedkingdom_overview'
        limitAmount = 1000
        areaTypeinlist = 1

    # Used to store the documents that are returned
    docs = []

    queryCreated = {}

    # If the area type was in the predefined list
    if areaTypeinlist == 1:
        # If no place name was given
        if areaNameGiven == '*' or areaNameGiven == ' ':
            # If the date was not given
            if dateGiven == '*' or dateGiven == ' ':
                # Search by just area
                # Get the results for just this parameter given (for this areaType)
                print("first")
                queryCreated = dbss[collectionNameUsed].find({ "areaType" : areaType }, { '_id' : False }).sort("date", -1).limit(limitAmount)
            else:
                # Search by just date
                # Get the results for the parameter given (for this areaType)
                print("second")
                queryCreated = dbss[collectionNameUsed].find({ "date" : start }, { '_id' : False }).limit(limitAmount)

        # If a place name was given
        else:
            # If the area type is not 'overview', i.e. if it's not for the United Kingdom, do not want to pass an area name because this is already set
            if areaType != 'overview':
                # If no date was given, search for just the areaname (for this areaType)
                if dateGiven == '*' or dateGiven == ' ':
                    queryCreated = dbss[collectionNameUsed].find({ "areaName" : re.compile(areaNameGiven, re.IGNORECASE) }, { '_id' : False }).sort("date", -1).limit(limitAmount)
                    # If date was given, search for the date and areaname (for this areaType)
                else:
                    # If date was given, search for the date and areaname (for this areaType)
                    queryCreated = dbss[collectionNameUsed].find({ "date" : start, "areaName" : re.compile(areaNameGiven, re.IGNORECASE) }, { '_id' : False }).limit(limitAmount)

    # Get the pymongo query response
    json_str = dumps(queryCreated, default=json_util.default)

    # Remove the NaN values and change them to null values to have a valid json response
    mt = json_str.replace('NaN', 'null')

    # Load it as an object
    record2 = loads(mt)

    # Return it as json
    response = jsonify(data=record2)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


# This is an example of what can be done using flask and combining it with machine learning for COVID-19 and weather data
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
@app.route('/apic/getmodel')
def index12():
    print('okay')
    areaName = request.args.get('areaname', default = '*', type = str)

    temp = pd.read_csv('history_data_england_temperature.csv')
    temp_forecast = pd.read_csv('forecast_data_england.csv')

    filename = 'knn-model-united-kingdom-daily.pkl'

    if areaName == 'England':
        temp = pd.read_csv('history_data_england_temperature.csv')
        filename = 'knn-model-england-daily.pkl'

    if areaName == 'Scotland':
        filename = 'knn-model-scotland-daily.pkl'

    if areaName == 'Northern Ireland':
        filename = 'knn-model-northern-ireland-daily.pkl'

    if areaName == 'Wales':
        filename = 'knn-model-wales-daily.pkl'

    temp = temp.iloc[:].reset_index().drop('index', axis=1)
    temp_forecast = temp_forecast.iloc[:].reset_index().drop('index', axis=1)


    # Convert to datetime
    temp['date'] = pd.to_datetime(temp['Date time'])
    temp_forecast['date'] = pd.to_datetime(temp_forecast['Date time'])

    columns = ['Maximum Temperature', 'Minimum Temperature', 'Temperature',
    'Wind Chill', 'Precipitation', 'Wind Speed', 'Wind Gust',
    'Cloud Cover', 'Relative Humidity', 'Conditions', 'date']
    temp = temp[columns]
    temp_forecast = temp_forecast[columns]

    df = temp

    # Normalise column names
    df.rename(columns={'Maximum Temperature':'max_temp', 'Minimum Temperature':'min_temp',
    'Temperature':'avg_temp', 'Wind Chill':'wind_chill',
    'Precipitation':'precipitation', 'Wind Speed':'wind_speed',
    'Wind Gust':'wind_gust', 'Cloud Cover':'cloudiness',
    'Relative Humidity':'humidity', 'Conditions':'conditions'}, inplace=True)

    # Normalize column names
    temp_forecast.rename(columns={'Maximum Temperature':'max_temp', 'Minimum Temperature':'min_temp',
    'Temperature':'avg_temp', 'Wind Chill':'wind_chill',
    'Precipitation':'precipitation', 'Wind Speed':'wind_speed',
    'Wind Gust':'wind_gust', 'Cloud Cover':'cloudiness',
    'Relative Humidity':'humidity', 'Conditions':'conditions'}, inplace=True)

    # Set date as index
    df = df.set_index('date')
    temp_forecast = temp_forecast.set_index('date')

    # Organize columns and drop conditions
    df = df[['avg_temp', 'min_temp',
    'max_temp', 'humidity', 'cloudiness',
    'precipitation', 'wind_speed', 'wind_chill',
    'wind_gust']]

    # Organize columns and drop conditions
    temp_forecast = temp_forecast[['avg_temp', 'min_temp',
    'max_temp', 'humidity', 'cloudiness',
    'precipitation', 'wind_speed', 'wind_chill',
    'wind_gust']]

    df.dropna(axis=1, inplace=True)

    X = df

    # Load the model based on the area (such as England, Scotland, etc) selected
    loaded_model_knn = pickle.load(open(filename, 'rb'))

    daily_features = ['humidity', 'min_temp', 'wind_speed', 'cloudiness']

    # Get the last row in the dataframe to be usd as the features
    tomorrow_data = X.head(1)
    print(X.tail(1))

    predicted_gotten = []

    for i in range(1, 12):
        tomorrow_data = temp_forecast[i:i+1]

        predict_daily = float(loaded_model_knn.predict(tomorrow_data[daily_features]))

        dateThis = tomorrow_data.index.strftime("%Y-%m-%d")

        print(tomorrow_data.index)

        print(dateThis)

        predicted_gotten.append([dateThis, predict_daily])

    # Convert results
    json_str = dumps(predicted_gotten, default=json_util.default)

    # Load it as an object
    record2 = loads(json_str)

    # Return it as json
    response = jsonify(data=record2)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


# Get the details for that area such as population size
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
@app.route('/apic/getdetailsofarea')
def index88():
    dateGiven = request.args.get('dategiven', default = '*', type = str)
    areaNameGiven = request.args.get('areanamegiven', default = '*', type = str)
    areaType = request.args.get('areatype', default = '*', type = str)

    print(dateGiven)
    print("The area name given: ")
    print(areaNameGiven)
    print(areaType)

    # Check if date given in the parameter route is valid first
    start = ""
    if dateGiven != '*':
        try:
            start = datetime.strptime(dateGiven, '%Y-%m-%d')
        except ValueError:
            return 'Invalid date'


    # Can switch databases from here
    dbss = mongo.cx['placedata']

    print(dbss)

    # This variable controls how many maximum results are returned from queries
    limitAmount = 100

    areaNameOfOverview = "United Kingdom"

    collectionNameUsed = ''

    # Switch to see if area type has been selected from a predefined list
    areaTypeinlist = 0


    # Used to store the documents that are returned
    docs = []

    queryCreated = {}

    areaName = areaNameGiven

    if areaName == "United Kingdom":
        areaName = "UNITED KINGDOM"
    if areaName == "England":
        areaName = "ENGLAND"
    if areaName == "Northern Ireland":
        areaName = "NORTHERN IRELAND"
    if areaName == "Scotland":
        areaName = "SCOTLAND"
    if areaName == "Wales":
        areaName = "WALES"
    if areaName == "East of England":
        areaName = "EAST"
    if areaName == "East Midlands":
        areaName = "EAST MIDLANDS"
    if areaName == "London":
        areaName = "LONDON"
    if areaName == "North East":
        areaName = "NORTH EAST"
    if areaName == "North East":
        areaName = "NORTH"
    if areaName == "North West":
        areaName = "NORTH WEST"
    if areaName == "South East":
        areaName = "SOUTH EAST"
    if areaName == "South West":
        areaName = "SOUTH WEST"
    if areaName == "West Midlands":
        areaName = "WEST MIDLANDS"
    if areaName == "Yorkshire and The Humber":
        areaName = "YORKSHIRE AND THE HUMBER"

    print(areaName)

    try:
        queryCreated = dbss['populationages'].find_one({ "Name" : areaName }, { '_id' : False })
    except:
        print("Nothing")


    print("queryCreated: ")
    print(queryCreated)

    @cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
    @app.route('/apic/gettrafficdata')
    def index88():
        dateGiven = request.args.get('dategiven', default='*', type=str)

        print(dateGiven)

        # Check if date given in the parameter route is valid first
        start = ""
        if dateGiven != '*':
            try:
                start = datetime.strptime(dateGiven, '%Y-%m-%d')
            except ValueError:
                return 'Invalid date'

        # Can switch databases from here
        dbss = mongo.cx['placedata']

        print(dbss)

        # This variable controls how many maximum results are returned from queries
        limitAmount = 100

        areaNameOfOverview = "United Kingdom"

        collectionNameUsed = ''

        # Switch to see if area type has been selected from a predefined list
        areaTypeinlist = 0

        # Used to store the documents that are returned
        docs = []

        queryCreated = {}

        try:
            # print(areaNameGiven.toLowerCase())
            queryCreated = dbss["trafficdata"].find({}, {'_id': False})


        except:
            print("Nothing")

        print("queryCreated: ")
        print(queryCreated)


    queryCreated = dbss[collectionNameUsed].find({ "date" : start, "areaName" : re.compile(areaNameGiven, re.IGNORECASE) }, { '_id' : False }).limit(limitAmount)

    # Get the pymongo query response
    json_str = dumps(queryCreated, default=json_util.default)

    # Remove the NaN values and change them to null values to have a valid json response
    mt = json_str.replace('NaN', 'null')

    # Load it as an object
    record2 = loads(mt)

    print("teasfsdf")
    print(record2)

    # Return it as json
    response = jsonify(data=record2)
    print(response)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


# Used to get schools data including coorindates
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
@app.route('/apic/getschoolsdata')
def index8():
    # Can switch databases from here
    dbss = mongo.cx['placedata']

    print(dbss)
    queryCreated = dbss["schoolsdata"].find({ }, { '_id' : False })

    # Get the pymongo query response
    json_str = dumps(queryCreated, default=json_util.default)

    # Remove the NaN values and change them to null values to have a valid json response
    mt = json_str.replace('NaN', 'null')

    # Load it as an object
    record2 = loads(mt)

    # Return it as json
    response = jsonify(data=record2)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


# Used to get the ages of cumulative admissions in England
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
@app.route('/apic/getagegroupsforcumulativeadmissions')
def index9():
    # Can switch databases from here
    dbss = mongo.cx['placedata']

    print(dbss)
    queryCreated = dbss["age_groups_for_cumulative_admissions_england"].find({ }, { '_id' : False })

    # Get the pymongo query response
    json_str = dumps(queryCreated, default=json_util.default)

    # Remove the NaN values and change them to null values to have a valid json response
    mt = json_str.replace('NaN', 'null')

    # Load it as an object
    record2 = loads(mt)

    # Return it as json
    response = jsonify(data=record2)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response




# Used to get policy data and dates
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
@app.route('/apic/getpolicy')
def index4():
    dateGiven = request.args.get('dategiven', default = '*', type = str)
    policyGiven = request.args.get('policygiven', default = '*', type = str)

    print(dateGiven)
    print(policyGiven)

    # Check if date given in the parameter route is valid first
    start = ""
    if dateGiven != '*':
        try:
            start = datetime.strptime(dateGiven, '%Y-%m-%d')
        except ValueError:
            return 'Invalid date'


    # Can switch databases from here
    dbss = mongo.cx['policies']

    # This variable controls how many maximum results are returned from queries
    limitAmount = 300

    queryCreated = {}

    # Search using the policy given as the collection
    if policyGiven == 'policy1' or policyGiven == 'policy2' or policyGiven == 'policy3' or policyGiven == 'policy4' or policyGiven == 'policy5':

        # If date is not given
        if dateGiven == '*':
            # Search by just policy given in parameter (returns all)
            # Get the results for just this parameter given (this is because there would be too many to return for this one)
            queryCreated = dbss[policyGiven].find({ }, { '_id' : False }).sort("Date", -1)
        # If date is given
        else:
            # Search by date for the policy given
            queryCreated = dbss[policyGiven].find({ "Date" : start }, { '_id' : False }).sort("Date", -1)

    # Get the pymongo query response
    json_str = dumps(queryCreated, default=json_util.default)

    # Remove the NaN values and change them to null values to have a valid json response
    mt = json_str.replace('NaN', 'null')

    # Load it as an object
    record2 = loads(mt)

    # Return it as json
    response = jsonify(data=record2)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response



# Used to get the most at risk area
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
@app.route('/apic/getmostatrisk')
def index44():
    # Can switch databases from here
    dbss = mongo.cx['placedata']

    # Used to store the documents that are returned
    docs = []

    queryCreated = {}

    print("first")
    queryCreated = dbss['forecasting_cases'].find({}).sort("new_predicted").limit(1)

    # Get the pymongo query response
    json_str = dumps(queryCreated, default=json_util.default)

    # Remove the NaN values and change them to null values to have a valid json response
    mt = json_str.replace('NaN', 'null')

    # Load it as an object
    record2 = loads(mt)

    # Return it as json
    response = jsonify(data=record2)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
