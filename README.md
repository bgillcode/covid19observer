# COVID-19 Observer App
An automated online web application for tracking COVID-19 related data, along with forecasting and predictions using machine learning.
Data is processed on the backend and stored in a database.
Information is displayed in a frontend using graphs and maps that are able to be clicked on by users.

Backend: Flask

Frontend: React

Database used: MongoDB


## Report

The JavaScript code is in the 'src'/ directory.

The scripts used in cron to automate the application are in the 'Scripts used (for report)'/ directory.
Machine learning code is included in the Jupyter Notebooks titled 'Cases for Project - Forecasting (For report)' and 'Cases for Project - Regression (For report)', this has been provided for reference on how the models were built and tested and include the error scores for this proof of concept prototype application.

A dump of the currently available data is available for reference in the 'Database dump (For report)'/ directory), the forecasted data is available in the 'dump/placedata/forecasting_cases.bson' file. To restore the MongoDB database collections use mongorestore and point it to the database to restore.


## How to install

### Clone the COVID-19 Observer repository and type:
```npm install```

### Set up a virtual environment:

##### Mac OSX, Linux:
```cd api```

```python3 -m venv venv```

```cd ..```

Then to activate it (make sure you are in the main project folder):

```source api/venv/bin/activate```

OR:

##### Windows:
```cd api```

```python -m venv venv```


```cd ..```

Then to activate it (make sure you are in the main project folder):

```api\venv\Scripts\activate```

### Install requirements.txt:
```pip install -r requirements.txt```


## How to run the frontend and backend

### To run the client frontend:
```npm start```

### To run the backend (Mac OSX, Linux):
```npm run start-api```

### To run the backend (Windows):
```\api\venv\Scripts\flask run --no-debugger```


Note that for the API backend, the CONNECTION_STRING environment variable must be declared for the connection to the database.

Data sources used: http://coronavirus.data.gov.uk, https://www.ons.gov.uk, https://fingertips.phe.org.uk, https://visualcrossing.com, https://www.health.org.uk, https://geoportal.statistics.gov.uk
