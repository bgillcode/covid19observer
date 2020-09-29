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
# from bson.json_util import loads, dumps
import re

import key


app = Flask(__name__, static_folder='../build', static_url_path='/')
# Using the URI connection string for MongoDB as an environment variable
# app.config["CONNECTION_STRING"] = environ.get("CONNECTION_STRING")
# thisConnectionString = app.config["CONNECTION_STRING"]
app.config["MONGO_URI"] = key.CONNECTION_STRING

app.config['CORS_HEADERS'] = 'Content-Type'

cors = CORS(app, resources={r"/foo": {"origins": "http://localhost:5000"}})

mongo = PyMongo(app)


@cross_origin(origin='*',headers=['Content-Type','Authorization'])
@app.route('/')
# @crossdomain(origin="*")
def index():
    return app.send_static_file('index.html')

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
    #
    # # Switch to see if area type has been selected from a predefined list
    areaTypeinlist = 0
    #
    # if areaType == 'ltla':
    #     # The collection name is set here to be searched through depending on the parameter that was passed, in this case for areaType
    #     collectionNameUsed = 'ltla_cases'
    #     # Used to limit the amount of search results returned for the different cases
    #     limitAmount = 400
    #     # Switch to see if area type has been selected from a predefined list
    #     areaTypeinlist = 1
    # if areaType == 'utla':
    #     collectionNameUsed = 'utla_cases'
    #     limitAmount = 400
    #     areaTypeinlist = 1
    # if areaType == 'region':
    #     collectionNameUsed = 'regions_cases'
    #     limitAmount = 1000
    #     areaTypeinlist = 1
    # if areaType == 'nation':
    #     collectionNameUsed = 'nations_overview'
    #     limitAmount = 1000
    #     areaTypeinlist = 1
    # if areaType == 'nhsregion':
    #     collectionNameUsed = 'nhsregions_overview'
    #     limitAmount = 1000
    #     areaTypeinlist = 1
    # if areaType == 'overview':
    #     collectionNameUsed = 'unitedkingdom_overview'
    #     limitAmount = 1000
    #     areaTypeinlist = 1

    # Used to store the documents that are returned
    docs = []

    queryCreated = {}

    # areaNameGiven = foo: /^bar$/i

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
        # print(areaNameGiven.toLowerCase())
        queryCreated = dbss['populationages'].find_one({ "Name" : areaName }, { '_id' : False })

        # if (queryCreated == null) {
        #     queryCreated = dbss['populationages'].find_one({ "Name" : areaNameGiven }, { '_id' : False })
        # }



    except:
        print("Nothing")


    print("queryCreated: ")
    print(queryCreated)







    # if queryCreated == None:
    #     # print(areaName.upper())
    #     try:
    #         # print(areaNameGiven.toLowerCase())
    #         queryCreated = dbss['populationages'].find_one({ "Name" : areaNameGiven }, { '_id' : False })
    #
    #         # if (queryCreated == null) {
    #         #     queryCreated = dbss['populationages'].find_one({ "Name" : areaNameGiven }, { '_id' : False })
    #         # }
    #
    #     except:
    #         print("Nothing")
    #


    # try:
    #     # print(areaNameGiven.toLowerCase())
    #     queryCreated_estimated_diabetes = dbss['estimated_prevalance_of_diabetes'].find_one({ "Name" : areaNameGiven.upper() }, { '_id' : False })
    # except:
    #     print("Nothing")
    #
    #
    # try:
    #     # print(areaNameGiven.toLowerCase())
    #     queryCreated_estimated_diabetes = dbss['estimated_prevalance_of_diabetes'].find_one({ "Name" : areaNameGiven.upper() }, { '_id' : False })
    # except:
    #     print("Nothing")

    # queryCreated = dbss['populationages'].find_one({ "Name" : 'UNITED KINGDOM' }, { '_id' : False })
    #
    # # If the area type was in the predefined list
    # if areaTypeinlist == 1:
    #     # If no place name was given
    #     if areaNameGiven == '*' or areaNameGiven == ' ':
    #         # If the date was not given
    #         if dateGiven == '*' or dateGiven == ' ':
    #             # Search by just area
    #             # Get the results for just this parameter given (for this areaType)
    #             print("first")
    #             queryCreated = dbss[collectionNameUsed].find({ "areaType" : areaType }, { '_id' : False }).sort("date", -1).limit(limitAmount)
    #         else:
    #             # Search by just date
    #             # Get the results for the parameter given (for this areaType)
    #             print("second")
    #             queryCreated = dbss[collectionNameUsed].find({ "date" : start }, { '_id' : False }).limit(limitAmount)
    #
    #     # If a place name was given
    #     else:
    #         # If the area type is not 'overview', i.e. if it's not for the United Kingdom, do not want to pass an area name because this is already set
    #         if areaType != 'overview':
    #             # If no date was given, search for just the areaname (for this areaType)
    #             if dateGiven == '*' or dateGiven == ' ':
    #                 queryCreated = dbss[collectionNameUsed].find({ "areaName" : re.compile(areaNameGiven, re.IGNORECASE) }, { '_id' : False }).limit(limitAmount)
    #             # If no date was given, search for just the areaname (for this areaType)
    #             else:
    #                 # If no date was given, search for the date and areaname (for this areaType)
    #                 queryCreated = dbss[collectionNameUsed].find({ "date" : start, "areaName" : re.compile(areaNameGiven, re.IGNORECASE) }, { '_id' : False }).limit(limitAmount)

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





@cross_origin(origin='*',headers=['Content-Type','Authorization'])
@app.route('/apic/getforecasting')
def index6():
    # dateGiven = request.args.get('dategiven', default = '*', type = str)
    areaNameGiven = request.args.get('areanamegiven', default = '*', type = str)
    areaType = request.args.get('areatype', default = '*', type = str)

    # print(dateGiven)
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








#  This route will be for adding ml data later on
#
# @app.route('/apic/mldata')
# def index5():
#     dateGiven = request.args.get('dategiven', default = '*', type = str)
#     # Will be the type of data to be received
#     typeGiven = request.args.get('typeGiven', default = '*', type = str)
#
#     print(dateGiven)
#     print(typeGiven)
#
#     # Check if date given in the parameter route is valid first
#     start = ""
#     if dateGiven != '*':
#         try:
#             start = datetime.strptime(dateGiven, '%Y-%m-%d')
#         except ValueError:
#             return 'Invalid date'
#
#
#     # Can switch databases from here
#     dbss = mongo.cx['mldata']
#
#     # This variable controls how many maximum results are returned from queries
#     limitAmount = 300
#
#     docs = []
#
#     # Search using the policy given as the collection
#     if policyGiven == 'policy1' or policyGiven == 'policy2' or policyGiven == 'policy3' or policyGiven == 'policy4' or policyGiven == 'policy5':
#
#         # If date is not given
#         if dateGiven == '*':
#             # Search by just policy given in parameter (returns all)
#             # Get the results for just this parameter given (this is because there would be too many to return for this one)
#             queryCreated = dbss[policyGiven].find({ }, { '_id' : False }).sort("Date", -1)
#         # If date is given
#         else:
#             # Search by date for the policy given
#             queryCreated = dbss[policyGiven].find({ "Date" : start }, { '_id' : False }).sort("Date", -1)
#
#
#     # Get the pymongo query response
#     json_str = dumps(queryCreated, default=json_util.default)
#
#     # Remove the NaN values and change them to null values to have a valid json response
#     mt = json_str.replace('NaN', 'null')
#
#     # Load it as an object
#     record2 = loads(mt)
#
#     # Return it
#     response = jsonify(data=record2)
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     return response
