import time
from flask import Flask

import pandas as pd
import numpy as np

# import matplotlib.pyplot as plt
# import seaborn as sns
#
# import nltk
# from nltk.tokenize import RegexpTokenizer
# from nltk.corpus import stopwords
# 
# import sklearn
#
# import re
# from nltk.stem import WordNetLemmatizer s
# wordnet_lemmatizer = WordNetLemmatizer()

import json

app = Flask(__name__, static_folder='../build', static_url_path='/')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/getCovidCases/')
def index():
    return "testingcase"

@app.route('/getCovidCases/:place')
def index():
    return "testingcaseplace"

@app.route('/obtainAndSaveCovidDataDaily')
def index():
    ###Testing
    #---------

    ##Testing and capacity

    #United Kingdom
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaName=United%2520Kingdom;areaType=overview&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22newCasesByPublishDate%22:%22newCasesByPublishDate%22,%22cumCasesByPublishDate%22:%22cumCasesByPublishDate%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/testing/testing-and-capacity-united-kingdom-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)


    #All nations in one
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nation&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22plannedCapacityByPublishDate%22:%22plannedCapacityByPublishDate%22,%22newPillarOneTestsByPublishDate%22:%22newPillarOneTestsByPublishDate%22,%22newPillarTwoTestsByPublishDate%22:%22newPillarTwoTestsByPublishDate%22,%22newPillarThreeTestsByPublishDate%22:%22newPillarThreeTestsByPublishDate%22,%22newPillarFourTestsByPublishDate%22:%22newPillarFourTestsByPublishDate%22,%22newTestsByPublishDate%22:%22newTestsByPublishDate%22,%22cumPillarOneTestsByPublishDate%22:%22cumPillarOneTestsByPublishDate%22,%22cumPillarTwoTestsByPublishDate%22:%22cumPillarTwoTestsByPublishDate%22,%22cumPillarThreeTestsByPublishDate%22:%22cumPillarThreeTestsByPublishDate%22,%22cumPillarFourTestsByPublishDate%22:%22cumPillarFourTestsByPublishDate%22,%22cumTestsByPublishDate%22:%22cumTestsByPublishDate%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/testing/testing-and-capacity-nations-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)

    #Pillar 1 (NHS and, in England, PHE) tests by nation

    #All nations in one (for all of them)
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nation&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22newPillarOneTestsByPublishDate%22:%22newPillarOneTestsByPublishDate%22,%22cumPillarOneTestsByPublishDate%22:%22cumPillarOneTestsByPublishDate%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/testing/pillar-1-nations-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)


    ###Cases
    #-------

    ##Cases by date reported

    #United Kingdom
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaName=United%2520Kingdom;areaType=overview&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22newCasesByPublishDate%22:%22newCasesByPublishDate%22,%22cumCasesByPublishDate%22:%22cumCasesByPublishDate%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/cases/cases-by-date-reported-united-kingdom-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)

    #Nations
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nation&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22newCasesBySpecimenDate%22:%22newCasesBySpecimenDate%22,%22cumCasesBySpecimenDate%22:%22cumCasesBySpecimenDate%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/cases/cases-by-date-reported-nations-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)

    #Regions
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=region&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22newCasesBySpecimenDate%22:%22newCasesBySpecimenDate%22,%22cumCasesBySpecimenDate%22:%22cumCasesBySpecimenDate%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/cases/cases-by-date-reported-regions-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)

    #UTLA
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=utla&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22newCasesBySpecimenDate%22:%22newCasesBySpecimenDate%22,%22cumCasesBySpecimenDate%22:%22cumCasesBySpecimenDate%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/cases/cases-by-date-reported-utla-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)

    #LTLA
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=ltla&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22newCasesBySpecimenDate%22:%22newCasesBySpecimenDate%22,%22cumCasesBySpecimenDate%22:%22cumCasesBySpecimenDate%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/cases/cases-by-date-reported-ltla-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)

    ##Cases by date reported, by nation


    # All nations (England, Scotland, Wales, Northern Ireland)
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nation&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22newCasesByPublishDate%22:%22newCasesByPublishDate%22,%22cumCasesByPublishDate%22:%22cumCasesByPublishDate%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/cases/cases-by-date-reported-by-nations-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)

    ##Cases by date reported, by nation

    # Northern Ireland
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nation;areaName=Northern%2520Ireland&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22newCasesByPublishDate%22:%22newCasesByPublishDate%22,%22cumCasesByPublishDate%22:%22cumCasesByPublishDate%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/cases/cases-by-date-reported-northern-ireland-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)


    ##Cases by age and sex

    #England only
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nation&latestBy=femaleCases&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22femaleCases%22:%22femaleCases%22,%22maleCases%22:%22maleCases%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/cases/cases-by-age-and-sex-england-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)


    #Regions
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=region&latestBy=femaleCases&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22femaleCases%22:%22femaleCases%22,%22maleCases%22:%22maleCases%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/cases/cases-by-age-and-sex-regions-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)




    ##Cases by age and sex

    #England only
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nation&latestBy=femaleCases&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22femaleCases%22:%22femaleCases%22,%22maleCases%22:%22maleCases%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/cases/cases-by-age-and-sex-england-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)


    #Regions
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=region&latestBy=femaleCases&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22femaleCases%22:%22femaleCases%22,%22maleCases%22:%22maleCases%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/cases/cases-by-age-and-sex-regions-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)


    ##Case rates by age and sex
    ##(Rates per 100,000 resident population)

    #England only
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nation&latestBy=femaleCases&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22femaleCases%22:%22femaleCases%22,%22maleCases%22:%22maleCases%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/cases/cases-by-age-and-sex-certain-population-england-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)



    #Regions
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nation&latestBy=femaleCases&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22femaleCases%22:%22femaleCases%22,%22maleCases%22:%22maleCases%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/cases/cases-by-age-and-sex-certain-population-regions-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)





    ###Healthcare
    #------------

    ##Patients admitted to hospital


    #United Kingdom
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=overview;areaName=United%2520Kingdom&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22newAdmissions%22:%22newAdmissions%22,%22cumAdmissions%22:%22cumAdmissions%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/healthcare/patients-admitted-to-hospital-united-kingdom' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)

    #Nations
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nation&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22newAdmissions%22:%22newAdmissions%22,%22cumAdmissions%22:%22cumAdmissions%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/healthcare/patients-admitted-to-hospital-nations-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)

    #NHS regions
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nhsregion&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22newAdmissions%22:%22newAdmissions%22,%22cumAdmissions%22:%22cumAdmissions%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/healthcare/patients-admitted-to-hospital-regions-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)

    ##Patients in hospital
    #United Kingdom
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaName=United%2520Kingdom;areaType=overview&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22hospitalCases%22:%22hospitalCases%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/healthcare/patients-in-hospital-united-kingdom-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)

    #Nations (England, Scotland, Wales, Northern Ireland)
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nation&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22newAdmissions%22:%22newAdmissions%22,%22cumAdmissions%22:%22cumAdmissions%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/healthcare/patients-in-hospital-nations-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)

    #NHS Regions (All: East of England, London, Midlands, North East and Yorkshire, North West, South East, South West)
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nhsregion&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22newAdmissions%22:%22newAdmissions%22,%22cumAdmissions%22:%22cumAdmissions%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/healthcare/patients-in-hospital-nhs-regions-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)

    ##Patients in mechanical ventilation beds

    #United Kingdom
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaName=United%2520Kingdom;areaType=overview&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22covidOccupiedMVBeds%22:%22covidOccupiedMVBeds%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/healthcare/patients-in-mechanical-ventilation-beds-united-kingdom-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)


    #Nations (All: England, Scotland, Wales, Northern Ireland)
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nation&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22covidOccupiedMVBeds%22:%22covidOccupiedMVBeds%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/healthcare/patients-in-mechanical-ventilation-beds-nations-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)

    #NHS Region (All: East of England, London, Midlands, North East and Yorkshire, North West, South East, South West)
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nhsregion&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22newAdmissions%22:%22newAdmissions%22,%22cumAdmissions%22:%22cumAdmissions%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/healthcare/patients-in-mechanical-ventilation-beds-nhs-regions-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)



    ##Patients admitted to hospital, by age
    #England only
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nation&latestBy=cumAdmissionsByAge&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22cumAdmissionsByAge%22:%22cumAdmissionsByAge%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/healthcare/patients-admitted-to-hospital-by-age-england-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)

    #NHS Region
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nhsregion&latestBy=cumAdmissionsByAge&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22cumAdmissionsByAge%22:%22cumAdmissionsByAge%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/healthcare/patients-admitted-to-hospital-by-age-nhs-region-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)

    ##Admission rates by age
    ##(Rates per 100,000 resident population)

    #England
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nation&latestBy=cumAdmissionsByAge&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22cumAdmissionsByAge%22:%22cumAdmissionsByAge%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/healthcare/patients-admitted-to-hospital-by-age-per-certain-population-england-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)

    #NHS regions
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nhsregion&latestBy=cumAdmissionsByAge&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22cumAdmissionsByAge%22:%22cumAdmissionsByAge%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/healthcare/patients-admitted-to-hospital-by-age-per-certain-population-nhs-regions-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)



    ##Deaths by date reported, by nation

    #United Kingdom
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nation&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22newDeathsByPublishDate%22:%22newDeathsByPublishDate%22,%22cumDeathsByPublishDate%22:%22cumDeathsByPublishDate%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/deaths/deaths-by-date-reported-nation-united-kingdom-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)


    #Nations (all)
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nation&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22newDeathsByPublishDate%22:%22newDeathsByPublishDate%22,%22cumDeathsByPublishDate%22:%22cumDeathsByPublishDate%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/deaths/deaths-by-date-reported-nation-nations-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)


    #Regions (all)
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=region&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22newDeathsByDeathDate%22:%22newDeathsByDeathDate%22,%22cumDeathsByDeathDate%22:%22cumDeathsByDeathDate%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/deaths/deaths-by-date-reported-nation-regions-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)


    #UTLA (all)
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=utla&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22newDeathsByDeathDate%22:%22newDeathsByDeathDate%22,%22cumDeathsByDeathDate%22:%22cumDeathsByDeathDate%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/deaths/deaths-by-date-reported-nation-utla-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)


    #LTLA (all)
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=ltla&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22newDeathsByDeathDate%22:%22newDeathsByDeathDate%22,%22cumDeathsByDeathDate%22:%22cumDeathsByDeathDate%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/deaths/deaths-by-date-reported-nation-ltla-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)




    ##Deaths by age and sex

    #Nations (all)
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nation&latestBy=femaleDeaths&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22femaleDeaths%22:%22femaleDeaths%22,%22maleDeaths%22:%22maleDeaths%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/deaths/deaths-by-age-and-sex-nations-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)


    #Regions (all)
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=region&latestBy=femaleDeaths&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22femaleDeaths%22:%22femaleDeaths%22,%22maleDeaths%22:%22maleDeaths%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/deaths/deaths-by-age-and-sex-regions-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)

    time.sleep(5)


    ##Death rates by age and sex
    ##(Rates per 100,000 resident population)

    #Nations (all)
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=nation&latestBy=femaleDeaths&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22femaleDeaths%22:%22femaleDeaths%22,%22maleDeaths%22:%22maleDeaths%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/deaths/deaths-by-age-and-sex-by-certain-population-nations-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)


    time.sleep(5)


    #Regions (all)
    dateToday = today.strftime("%Y-%m-%d")
    solditems = requests.get('https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaType=region&latestBy=femaleDeaths&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22femaleDeaths%22:%22femaleDeaths%22,%22maleDeaths%22:%22maleDeaths%22%7D&format=json') # (your url)
    data = solditems.json()
    with open('dataset/deaths/deaths-by-age-and-sex-by-certain-population-regions-' + dateToday +'.json', 'w') as f:
        json.dump(data, f, sort_keys=True, indent=4)
