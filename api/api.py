import time
from datetime import datetime

from flask import Flask
from flask_pymongo import PyMongo
from pymongo import MongoClient
from flask import request
from flask import jsonify

import json
from bson import json_util
from bson.json_util import loads, dumps
import re

# Where the key for the CONNECTION_STRING mongodb is stored
import key


# Note: Parameters that are passed to the route are kept as lowercase to
# differentiate them from other variables created in the function


app = Flask(__name__, static_folder='../build', static_url_path='/')
app.config["MONGO_URI"] = key.CONNECTION_STRING
mongo = PyMongo(app)


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/apic/getoverview')
def index3():
    # Note: Parameters that are passed to the route are kept as lowercase to
    # differentiate them from other variables created in the function
    dategiven = request.args.get('dategiven', default = '*', type = str)
    areanamegiven = request.args.get('areanamegiven', default = '*', type = str)
    areatype = request.args.get('areatype', default = '*', type = str)

    print(dategiven)
    print(areanamegiven)
    print(areatype)

    # Check if date given in the parameter route is valid first
    start = ""
    if dategiven != '*':
        try:
            start = datetime.strptime(dategiven, '%Y-%m-%d')
        except ValueError:
            return 'Invalid date'


    # Can switch databases from here
    dbss = mongo.cx['placedata']

    # This variable controls how many maximum results are returned from queries
    limitAmount = 100

    areaNameOfOverview = "United Kingdom"

    collectionNameUsed = ''

    # Switch to see if area type has been selected from a predefined list
    areatypeinlist = 0

    if areatype == 'ltla':
        # The collection name is set here to be searched through depending on the parameter that was passed, in this case for areatype
        collectionNameUsed = 'ltla_cases'
        # Used to limit the amount of search results returned for the different cases
        limitAmount = 400
        # Switch to see if area type has been selected from a predefined list
        areatypeinlist = 1
    if areatype == 'utla':
        collectionNameUsed = 'utla_cases'
        limitAmount = 300
        areatypeinlist = 1
    if areatype == 'region':
        collectionNameUsed = 'regions_cases'
        limitAmount = 1000
        areatypeinlist = 1
    if areatype == 'nation':
        collectionNameUsed = 'nations_overview'
        limitAmount = 1000
        areatypeinlist = 1
    if areatype == 'nhsregion':
        collectionNameUsed = 'nhsregions_overview'
        limitAmount = 1000
        areatypeinlist = 1
    if areatype == 'overview':
        collectionNameUsed = 'unitedkingdom_overview'
        limitAmount = 1000
        areatypeinlist = 1

    # Used to store the documents that are returned
    docs = []

    # If the area type was in the predefined list
    if areatypeinlist == 1:
        # If no place name was given
        if areanamegiven == '*':
            # If the date was not given
            if dategiven == '*':
                # Search by just area
                # Get the results for just this parameter given (for this areatype)
                queryCreated = dbss[collectionNameUsed].find({ "areaType" : areatype }, { '_id' : False }).sort("date", -1).limit(limitAmount)
            else:
                # Search by just date
                # Get the results for the parameter given (for this areatype)
                queryCreated = dbss[collectionNameUsed].find({ "date" : start }, { '_id' : False }).limit(limitAmount)

        # If a place name was given
        else:
            # If the area type is not 'overview', i.e. if it's not for the United Kingdom, do not want to pass an area name because this is already set
            if areatype != 'overview':
                # If no date was given, search for just the areaname (for this areatype)
                if dategiven == '*':
                    queryCreated = dbss[collectionNameUsed].find({ "areaName" : re.compile(areanamegiven, re.IGNORECASE) }, { '_id' : False }).limit(limitAmount)
                # If no date was given, search for just the areaname (for this areatype)
                else:
                    # If no date was given, search for the date and areaname (for this areatype)
                    queryCreated = dbss[collectionNameUsed].find({ "date" : start, "areaName" : re.compile(areanamegiven, re.IGNORECASE) }, { '_id' : False }).limit(limitAmount)

        # Put the documents returned into the array (append)
        for doc in queryCreated:
            docs.append(doc)

    # If results were returned (i.e. not an empty array), return the results as a json
    if len(docs) > 0:
        # Return the result as a json file with the
        return json.dumps(docs, indent=4, sort_keys=True, default=str)
    else:
        # Return the result as a json file with the
        return 'No result'


@app.route('/apic/getpolicy')
def index4():
    dategiven = request.args.get('dategiven', default = '*', type = str)
    policygiven = request.args.get('policygiven', default = '*', type = str)

    print(dategiven)
    print(policygiven)

    # Check if date given in the parameter route is valid first
    start = ""
    if dategiven != '*':
        try:
            start = datetime.strptime(dategiven, '%Y-%m-%d')
        except ValueError:
            return 'Invalid date'


    # Can switch databases from here
    dbss = mongo.cx['policies']

    # This variable controls how many maximum results are returned from queries
    limitAmount = 300

    areaNameOfOverview = "United Kingdom"

    docs = []

    # Search using the policy given as the collection
    if policygiven == 'policy1' or policygiven == 'policy2' or policygiven == 'policy3' or policygiven == 'policy4' or policygiven == 'policy5':

        # If date is not given
        if dategiven == '*':
            # Search by just policy given in parameter (returns all)
            # Get the results for just this parameter given (this is because there would be too many to return for this one)
            queryCreated = dbss[policygiven].find({ }, { '_id' : False }).sort("Date", -1)
        # If date is given
        else:
            # Search by date for the policy given
            queryCreated = dbss[policygiven].find({ "Date" : start }, { '_id' : False }).sort("Date", -1)

        for doc in queryCreated:
            docs.append(doc)

    # If results were returned (i.e. not an empty array), return the results as a json
    if len(docs) > 0:
        # Return the result as a json file with the
        return json.dumps(docs, indent=4, sort_keys=True, default=str)
    else:
        # Return the result as a json file with the
        return 'No result'
