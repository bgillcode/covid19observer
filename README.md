# COVID-19 Observer App
Online web app for tracking COVID-19 data, along with forecasting and predictions.

Backend: Flask

Frontend: React

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
