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


app = Flask(__name__, static_folder='../build', static_url_path='/')

app.config["MONGO_URI"] = key.CONNECTION_STRING
mongo = PyMongo(app)


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/apic/getoverview')
def index3():
    dategiven = request.args.get('dategiven', default = '*', type = str)
    placegiven = request.args.get('placegiven', default = '*', type = str)
    areatype = request.args.get('areatype', default = '*', type = str)

    print(dategiven)
    print(placegiven)
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
    limitAmount = 300
    limitAmountltla = 400
    limitAmountutla = 300

    areaNameOfOverview = "United Kingdom"

    docs = []
    # If the area type was given
    if areatype == 'ltla':
        # If no name was given for the area
        if placegiven == '*':
            if dategiven == '*':
                # Search by just area
                # Get the results for just this parameter given (this is because there would be too many to return for this one) (for this areatype)
                queryCreated = dbss.ltla_cases.find({ "areaType" : areatype }, { '_id' : False }).sort("date", -1).limit(limitAmountltla)
            else:
                # Search by just date
                # Get 100 results for the parameter given (this is because there would be too many to return for this one) (for this areatype)
                queryCreated = dbss.ltla_cases.find({ "date" : start }, { '_id' : False }).limit(limitAmountltla)

        # If a place name was given
        else:
            # If no date was given, search for just the areaname (for this areatype)
            if dategiven == '*':
                queryCreated = dbss.ltla_cases.find({ "areaName" : re.compile(placegiven, re.IGNORECASE) }, { '_id' : False }).limit(limitAmountltla)
            # If no date was given, search for just the areaname (for this areatype)
            else:
                # If no date was given, search for the date and areaname (for this areatype)
                queryCreated = dbss.ltla_cases.find({ "date" : start, "areaName" : re.compile(placegiven, re.IGNORECASE) }, { '_id' : False }).limit(limitAmountltla)

        # Put the documents returned into the array (append)
        for doc in queryCreated:
            docs.append(doc)
    # If the area given was utla
    elif areatype == 'utla':
        # If no name was given for the area
        if placegiven == '*':
            if dategiven == '*':
                # Search by just area
                # Get the results for just this parameter given (this is because there would be too many to return for this one) (for this areatype)
                queryCreated = dbss.utla_cases.find({ "areaType" : areatype }, { '_id' : False }).sort("date", -1).limit(limitAmountutla)
            else:
                # Search by just date
                # Get 100 results for the parameter given (this is because there would be too many to return for this one) (for this areatype)
                queryCreated = dbss.utla_cases.find({ "date" : start }, { '_id' : False }).limit(limitAmountutla)

        # If a place name was given
        else:
            # If no date was given, search for just the areaname (for this areatype)
            if dategiven == '*':
                queryCreated = dbss.utla_cases.find({ "areaName" : re.compile(placegiven, re.IGNORECASE) }, { '_id' : False }).limit(limitAmountutla)
            # If no date was given, search for just the areaname (for this areatype)
            else:
                # If no date was given, search for the date and areaname (for this areatype)
                queryCreated = dbss.utla_cases.find({ "date" : start, "areaName" : re.compile(placegiven, re.IGNORECASE) }, { '_id' : False }).limit(limitAmountutla)

        # Put the documents returned into the array (append)
        for doc in queryCreated:
            docs.append(doc)
    elif areatype == 'region':
        # If no name was given for the area
        if placegiven == '*':
            if dategiven == '*':
                # Search by just area
                # Get the results for just this parameter given (this is because there would be too many to return for this one) (for this areatype)
                queryCreated = dbss.regions_cases.find({ "areaType" : areatype }, { '_id' : False }).sort("date", -1).limit(limitAmount)
            else:
                # Search by just date
                # Get 100 results for the parameter given (this is because there would be too many to return for this one) (for this areatype)
                queryCreated = dbss.regions_cases.find({ "date" : start }, { '_id' : False }).limit(limitAmount)

        # If a place name was given
        else:
            # If no date was given, search for just the areaname (for this areatype)
            if dategiven == '*':
                queryCreated = dbss.regions_cases.find({ "areaName" : re.compile(placegiven, re.IGNORECASE) }, { '_id' : False }).limit(limitAmount)
            # If no date was given, search for just the areaname (for this areatype)
            else:
                # If no date was given, search for the date and areaname (for this areatype)
                queryCreated = dbss.regions_cases.find({ "date" : start, "areaName" : re.compile(placegiven, re.IGNORECASE) }, { '_id' : False }).limit(limitAmount)

        # Put the documents returned into the array (append)
        for doc in queryCreated:
            docs.append(doc)
    elif areatype == 'nation':
        # If no name was given for the area
        if placegiven == '*':
            if dategiven == '*':
                # Search by just area
                # Get the results for just this parameter given (this is because there would be too many to return for this one) (for this areatype)
                queryCreated = dbss.nations_overview.find({ "areaType" : areatype }, { '_id' : False }).sort("date", -1).limit(limitAmount)
            else:
                # Search by just date
                # Get 100 results for the parameter given (this is because there would be too many to return for this one) (for this areatype)
                queryCreated = dbss.nations_overview.find({ "date" : start }, { '_id' : False }).limit(limitAmount)

        # If a place name was given
        else:
            # If no date was given, search for just the areaname (for this areatype)
            if dategiven == '*':
                queryCreated = dbss.nations_overview.find({ "areaName" : re.compile(placegiven, re.IGNORECASE) }, { '_id' : False }).limit(limitAmount)
            # If no date was given, search for just the areaname (for this areatype)
            else:
                # If no date was given, search for the date and areaname (for this areatype)
                queryCreated = dbss.nations_overview.find({ "date" : start, "areaName" : re.compile(placegiven, re.IGNORECASE) }, { '_id' : False }).limit(limitAmount)

        # Put the documents returned into the array (append)
        for doc in queryCreated:
            docs.append(doc)
    elif areatype == 'nhsregion':
        # If no name was given for the area
        if placegiven == '*':
            if dategiven == '*':
                # Search by just area
                # Get the results for just this parameter given (this is because there would be too many to return for this one) (for this areatype)
                queryCreated = dbss.nhsregions_overview.find({ "areaType" : areatype }, { '_id' : False }).sort("date", -1).limit(limitAmount)
            else:
                # Search by just date
                # Get 100 results for the parameter given (this is because there would be too many to return for this one) (for this areatype)
                queryCreated = dbss.nhsregions_overview.find({ "date" : start }, { '_id' : False }).limit(limitAmount)

        # If a place name was given
        else:
            # If no date was given, search for just the areaname (for this areatype)
            if dategiven == '*':
                queryCreated = dbss.nhsregions_overview.find({ "areaName" : re.compile(placegiven, re.IGNORECASE) }, { '_id' : False }).limit(limitAmount)
            # If no date was given, search for just the areaname (for this areatype)
            else:
                # If no date was given, search for the date and areaname (for this areatype)
                queryCreated = dbss.nhsregions_overview.find({ "date" : start, "areaName" : re.compile(placegiven, re.IGNORECASE) }, { '_id' : False }).limit(limitAmount)

        # Put the documents returned into the array (append)
        for doc in queryCreated:
            docs.append(doc)
    elif areatype == 'overview':
        # If no name was given for the area
        if dategiven == '*':
            # Search by just area
            # Get the results for just this parameter given (this is because there would be too many to return for this one) (for this areatype)
            queryCreated = dbss.unitedkingdom_overview.find({"areaName": areaNameOfOverview }, { '_id' : False }).sort("date", -1).limit(limitAmount)
        else:
            # Search by just date
            # Get 100 results for the parameter given (this is because there would be too many to return for this one) (for this areatype)
            queryCreated = dbss.unitedkingdom_overview.find({ "date" : start, "areaName": areaNameOfOverview }, { '_id' : False }).limit(limitAmount)

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
    limitAmountltla = 400
    limitAmountutla = 300

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
