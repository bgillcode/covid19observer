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

for placeSelected in place:
  print(placeSelected)

  API_URL = 'https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=nation;areaName=' + place + '&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22newCasesByPublishDate%22:%22newCasesByPublishDate%22,%22cumCasesByPublishDate%22:%22cumCasesByPublishDate%22%7D&format=json'

  def pull_data(url):
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()['data']
        print("Unable to fetch data")

    data = pull_data(API_URL)
    df = pd.DataFrame(data)
    df.head()

    df.info()
    df['date']

    df['date'] = pd.to_datetime(df['date'])
    df = df.set_index('date').sort_index()
    # Drop the last row
    # df = df[:-2]
    df = df.tail(90)

    df.head()
    print(df)
    print(df.shape)

    # TARGETCUMULATIVE = 'cumCasesBySpecimenDate'
    # TARGETNEW = 'newCasesBySpecimenDate'
    TARGET = 'newCasesByPublishDate'
    # TARGET = 'cumCasesByPublishDate'

    df[TARGET].plot()

    # Number of days to predict
    NUM_FUTURE_DAYS_PRED = 7


    def get_train_test_split_data(df, test_percent=0.15):
        size = len(df)
        split_idx = int(size * (1 - test_percent))
        train_df = df[:split_idx]
        test_df = df[split_idx:]
        return train_df, test_df


    daily_cases_score_table = pd.DataFrame(columns=['r2_test', 'mse_test'])
    cumulative_cases_score_table = pd.DataFrame(columns=['r2_test', 'mse_test'])


    # For plotting the results
    def compute_result(algo, y_test, pred_test):
        # compute the performance
        r2_test = r2_score(y_test, pred_test)
        mse_test = mean_squared_error(y_test, pred_test)

        # log the performance
        daily_cases_score_table.loc[algo, :] = r2_test, mse_test


    # # For plotting the results
    # def compute_result2(algo, y_test, pred_test):
    #     # compute the performance
    #     r2_test = r2_score(y_test, pred_test)
    #     mse_test = mean_squared_error(y_test, pred_test)
    #
    #     # log the performance
    #     total_cases_score_table.loc[algo, :] = r2_test, mse_test


    train_df, test_df = get_train_test_split_data(df, 0.15)
    train_df.shape, test_df.shape


    scaler = MinMaxScaler()

    scaler.fit(train_df[TARGET].values.reshape(-1, 1))
    scaled_train_data = scaler.transform(train_df[TARGET].values.reshape(-1, 1))
    scaled_test_data = scaler.transform(test_df[TARGET].values.reshape(-1, 1))

    input_length = 15
    num_features = 1

    generator = TimeseriesGenerator(scaled_train_data, scaled_train_data, length=input_length, batch_size=1)

    lstm_model = Sequential()
    lstm_model.add(LSTM(100, activation='relu', input_shape=(input_length, num_features)))
    lstm_model.add(Dense(1))
    lstm_model.compile(optimizer='adam', loss='mse')
    lstm_model.summary()



    lstm_model.fit_generator(generator, epochs=20)

    losses_lstm = lstm_model.history.history['loss']
    plt.figure(figsize=(12,4))
    plt.xticks(np.arange(0,21,1))
    plt.plot(range(len(losses_lstm)),losses_lstm);



    lstm_predictions_scaled = list()
    batch = scaled_train_data[-input_length:]
    current_batch = batch.reshape((1, input_length, num_features))

    for i in range(len(test_df)):
        lstm_pred = lstm_model.predict(current_batch)[0]
        lstm_predictions_scaled.append(lstm_pred)
        current_batch = np.append(current_batch[:,1:,:],[[lstm_pred]],axis=1)

    lstm_predictions = scaler.inverse_transform(lstm_predictions_scaled)



    lstm_model.save("model_lstm_test_new.h5")


    compute_result('LSTM', test_df[TARGET], lstm_predictions)

    print(daily_cases_score_table)



    # PROPHET_TARGET = 'cumCasesByPublishDate'
    PROPHET_TARGET = 'newCasesByPublishDate'

    def prepare_prophet_df(df):
        prophet_df = pd.DataFrame()
        prophet_df['ds'], prophet_df['y'] = df.index.to_series(), df[PROPHET_TARGET]
        return prophet_df

    prophet_model = Prophet()
    propeht_train_df = prepare_prophet_df(train_df)
    propeht_test_df = prepare_prophet_df(test_df)
    res = prophet_model.fit(propeht_train_df)
    predictions = prophet_model.predict(propeht_test_df)




    prophet_model.plot(predictions)

    y_pred = predictions['yhat']
    y_test = propeht_test_df['y']

    plt.plot(test_df.index, y_test, label='Actual')
    plt.plot(test_df.index, y_pred, label='Predicted')
    plt.legend()
    plt.show()


    compute_result('Prophet', y_pred, y_test)

    print('Daily cases score table: ')
    print(daily_cases_score_table)


    # print("Mean absolute percentage error: {}".format(mape(test_df[PROPHET_TARGET].values, y_pred)))
    # print("MSE: {}".format(mean_squared_error(test_df[PROPHET_TARGET].values, y_pred)))



    prophet_model.plot_components(predictions)
    plt.show()


    # Predictions from LSTM:

    print(df[TARGET])

    cases_so_far = df[-1:].cumCasesByPublishDate.values[0]
    last_date = df[-1:].index.values[0]
    print(cases_so_far, last_date)

    lstm_data = scaler.fit_transform(df[TARGET].values.reshape(-1, 1))
    generator = TimeseriesGenerator(lstm_data, lstm_data, length=input_length, batch_size=1)
    # lstm_model.fit_generator(generator, epochs=20)

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
    # lstm_results['new_predicted'] = lstm_results['total_predicted'].diff()
    lstm_results['total_predicted'] = lstm_results['new_predicted'].cumsum() + cases_so_far
    lstm_results.index = pd.date_range(start=last_date, periods=NUM_FUTURE_DAYS_PRED)
    print(lstm_results)


    # New predicted cases using LSTM
    lstm_results['new_predicted'].plot()


    # Total predicted cases using LSTM
    lstm_results['new_predicted'].plot()



    # Predictions from Prophet:

    prophet_model = Prophet()

    propeht_df = prepare_prophet_df(df)
    prophet_model.fit(propeht_df)

    future_df = prophet_model.make_future_dataframe(periods=NUM_FUTURE_DAYS_PRED, include_history=False)
    future_preds = prophet_model.predict(future_df)
    results = pd.DataFrame()
    results =
    results['new_predicted'] = future_preds['yhat'].astype(int)
    results['total_predicted'] = results['new_predicted'].cumsum() + cases_so_far
    results.index = future_preds['ds']
    # results['new'] = results['total'].diff()


    # results



    jtopy = json.dumps(results)

    df6 = pd.read_json(jtopy)

    connectionOf = "mongodb+srv://bgillget:123newstuff0@cluster0.oevqw.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority"

    client = MongoClient(connectionOf)

    db = client.placedata

    people = db.forecasting_cases

    people.insert_many(df6.to_dict('records'))


    # people.update_many(df6.to_dict('records'))

    # people.update_many({'indice':0, 'thread_id': {'$in': df6.to_dict('records')}}, {'$set': {'updated':'yes'}})

    print("completed")


    client.close()
