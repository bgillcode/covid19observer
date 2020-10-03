# Used to generate the forecast data for the models by nation

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import requests

from fbprophet import Prophet
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import GridSearchCV
from sklearn.pipeline import Pipeline

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM
from tensorflow.keras.preprocessing.sequence import TimeseriesGenerator

import pandas as pd
from pandas import json_normalize
import datetime
import json
from pymongo import MongoClient
import requests
from datetime import date
today = date.today()

import time

from geopy.geocoders import Nominatim

place = ['England', 'Scotland', 'Wales', 'Northern Ireland']
areaType = 'nation'

# For each area run the forecasting
for placeSelected in place:

    # Get the data from the API for the region
    queryCreated = dbss[collectionNameUsed].find({ "areaType" : areaType }, { '_id' : False }).sort("date", -1).limit(limitAmount)
    json_str = dumps(queryCreated, default=json_util.default)
    # Remove the NaN values and change them to null values to have a valid json response
    mt = json_str.replace('NaN', 'null')
    # Load it as an object
    record2 = loads(mt)
    # Return it as json
    placeSelected = jsonify(data=record2)

    # Load it into a pandas dataframe
    data = pull_data(API_URL)
    df = pd.DataFrame(placeSelected)
    df.head()

    df.info()
    df['date']

    df['date'] = pd.to_datetime(df['date'])
    df = df.set_index('date').sort_index()
    # Put the data in from the last 90 days
    df = df.tail(90)

    print(df.shape)

    # Set the target
    TARGET = 'newCasesByPublishDate'

    # Number of days to predict
    NUM_FUTURE_DAYS_PRED = 7

    # For splitting the test and train data
    def get_train_test_split_data(df, test_percent=0.15):
        size = len(df)
        split_idx = int(size * (1 - test_percent))
        train_df = df[:split_idx]
        test_df = df[split_idx:]
        return train_df, test_df

    daily_cases_score_table = pd.DataFrame(columns=['r2_test', 'mse_test'])
    cumulative_cases_score_table = pd.DataFrame(columns=['r2_test', 'mse_test']

    # For getting the error rates for the models
    def compute_result(algo, y_test, pred_test):
        mse_test = mean_squared_error(y_test, pred_test)
        daily_cases_score_table.loc[algo, :] = mse_test

    # Split the data for test and trai
    train_df, test_df = get_train_test_split_data(df, 0.15)
    train_df.shape, test_df.shape


    scaler = MinMaxScaler()
    scaler.fit(train_df[TARGET].values.reshape(-1, 1))
    scaled_train_data = scaler.transform(train_df[TARGET].values.reshape(-1, 1))
    scaled_test_data = scaler.transform(test_df[TARGET].values.reshape(-1, 1))

    input_length = 15
    num_features = 1
    generator = TimeseriesGenerator(scaled_train_data, scaled_train_data, length=input_length, batch_size=1)

    cases_so_far = df[-1:].cumCasesByPublishDate.values[0]
    last_date = df[-1:].index.values[0]
    print(cases_so_far, last_date)

    lstm_model = Sequential()
    lstm_model.add(LSTM(100, activation='relu', input_shape=(input_length, num_features)))
    lstm_model.add(Dense(1))
    lstm_model.compile(optimizer='adam', loss='mse')
    lstm_model.summary()

    lstm_model.fit_generator(generator, epochs=20)

    losses_lstm = lstm_model.history.history['loss']

    lstm_predictions_scaled = list()
    batch = scaled_train_data[-input_length:]
    current_batch = batch.reshape((1, input_length, num_features))

    for i in range(len(test_df)):
        lstm_pred = lstm_model.predict(current_batch)[0]
        lstm_predictions_scaled.append(lstm_pred)
        current_batch = np.append(current_batch[:,1:,:],[[lstm_pred]],axis=1)

    lstm_predictions = scaler.inverse_transform(lstm_predictions_scaled)
    lstm_model.save("model_lstm_test_new.h5")

    lstm_data = scaler.fit_transform(df[TARGET].values.reshape(-1, 1))
    generator = TimeseriesGenerator(lstm_data, lstm_data, length=input_length, batch_size=1)

    from tensorflow.keras.models import load_model
    lstm_model_loaded = load_model('model_lstm_test_new.h5')

    lstm_predictions_scaled = []
    batch = scaled_train_data[-input_length:]
    current_batch = batch.reshape((1, input_length, num_features))

    for i in range(NUM_FUTURE_DAYS_PRED):
        lstm_pred = lstm_model_loaded.predict(current_batch)[0]
        lstm_predictions_scaled.append(lstm_pred)
        current_batch = np.append(current_batch[:,1:,:],[[lstm_pred]],axis=1)

    lstm_predictions = scaler.inverse_transform(lstm_predictions_scaled)

    lstm_results = pd.DataFrame()
    lstm_results['new_predicted'] = lstm_predictions.flatten().astype(int)
    lstm_results['total_predicted'] = lstm_results['new_predicted'].cumsum() + cases_so_far
    lstm_results.index = pd.date_range(start=last_date, periods=NUM_FUTURE_DAYS_PRED)
    lstm_results['date'] = pd.date_range(start=last_date, periods=NUM_FUTURE_DAYS_PRED)
    print(lstm_results)


    # Create the dataframe that results and other information about the area will be saved into
    gottenResults_lstm = lstm_results
    gottenResults_lstm['areaName'] = df.iloc[0]['areaName']
    gottenResults_lstm['areaCode'] = df.iloc[0]['areaCode']
    gottenResults_lstm['areaType'] = df.iloc[0]['areaType']
    gottenResults_lstm['model'] = 'lstm'


    # Prophet model
    PROPHET_TARGET = 'newCasesByPublishDate'

    def prepare_prophet_df(df):
        prophet_df = pd.DataFrame()
        prophet_df['ds'], prophet_df['y'] = df.index.to_series(), df[PROPHET_TARGET]
        return prophet_df

    # Predictions from Prophet:
    prophet_model = Prophet()
    propeht_df = prepare_prophet_df(df)
    prophet_model.fit(propeht_df)

    future_df = prophet_model.make_future_dataframe(periods=NUM_FUTURE_DAYS_PRED, include_history=False)
    future_preds = prophet_model.predict(future_df)
    results = pd.DataFrame()

    results['new_predicted'] = future_preds['yhat'].astype(int)
    results['total_predicted'] = results['new_predicted'].cumsum() + cases_so_far

    results.index = future_preds['ds']
    results['date'] = results.index


    # Create the dataframe that results and other information about the area will be saved into
    gottenResults_prophet = results
    gottenResults_prophet['areaName'] = df.iloc[0]['areaName']
    gottenResults_prophet['areaCode'] = df.iloc[0]['areaCode']
    gottenResults_prophet['areaType'] = df.iloc[0]['areaType']
    gottenResults_prophet['model'] = 'prophet'


    # Save the results generated for forecasting of the areas from the two models into a MongoDB database
    connectionOf = "mongodb+srv://<username>:<password>@cluster0.oevqw.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority"
    client = MongoClient(connectionOf)
    db = client.placedata
    people = db.forecasting_cases
    people.insert_many(gottenResults_lstm.to_dict('records'))
    people.insert_many(gottenResults_prophet.to_dict('records'))

    client.close()
