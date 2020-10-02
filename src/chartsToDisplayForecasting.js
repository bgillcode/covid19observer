import React, { Component } from "react";
import { useState, useEffect } from 'react';
import "./styles.css";
import Chart from 'chart.js';
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ShareIcon from "@material-ui/icons/Share";
import { Avatar, IconButton, CardMedia } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import MoreVertIcon from '@material-ui/icons/MoreVert';


export default class LineChartForecasting extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // This is where the data is being stored
      dataGottenBack : [],
      getDataForChart: "",
      areaType: "overview",
      areaName: "United Kingdom",

      chart0Title: "Forecast data for daily cases with LSTM and Prophet models:",
      chart2Title: "Comparison of actual data with forecast data for daily cases with LSTM and Prophet models",

      ifOverview: true,

      ifCases: true,

      ifDeaths: false,
      ifTesting: false,
      ifHospital: false,
      myChart0: {},
      myChart2: {},

    }

  }

  // Chart 0
  chartRef0 = React.createRef();

  // Chart 1
  chartRef1 = React.createRef();

  // Chart 2
  chartRef2 = React.createRef();

  mychart0;

  runAllCharts() {
    console.log("test");
    this.setState({
      dataGottenBack: [],
      getDataForChart: "",

    });

    // if (this.state.ifOverview) {
    var baseURL = 'http://localhost:5000/'
    var apiName = 'apic/'
    var getRoute = 'getforecastinginformation'
    var getFieldForRoute1 = 'areatypegiven'
    var getFieldForRoute2 = ''

    getFieldForRoute2 = 'areanamegiven'


    var urlGotten = baseURL + apiName + getRoute + '?' + getFieldForRoute1 + '=' + this.state.areaType + '&' + getFieldForRoute2 + '=' + this.state.areaName + "&model=lstm"
      console.log(urlGotten);
      fetch(urlGotten).then(res => res.json()).then(data => {
        var joined = this.state.dataGottenBack.concat(data)
        // var dataToAdd = data;

        this.setState({
          dataGottenBack: joined,
          getDataForChart: this.props.getDataForChart,

        }, () => {
          // this.updateLineChart0();
        })

      });


      var urlGotten = baseURL + apiName + getRoute + '?' + getFieldForRoute1 + '=' + this.state.areaType + '&' + getFieldForRoute2 + '=' + this.state.areaName + "&model=prophet"
        console.log(urlGotten);
        fetch(urlGotten).then(res => res.json()).then(data => {
          var joined = this.state.dataGottenBack.concat(data)
          // var dataToAdd = data;
          console.log(joined);
          this.setState({
            dataGottenBack: joined,
            getDataForChart: this.props.getDataForChart,

          }, () => {

            // this.updateLineChart0();
          })

        });


        var baseURL = 'http://localhost:5000/'
        var apiName = 'apic/'
        var getRoute = 'getoverview'
        var getFieldForRoute1 = 'areatype'
        var getFieldForRoute2 = 'areaname '
        var urlGotten = baseURL + apiName + getRoute + '?' + getFieldForRoute1 + '=' + this.state.areaType + '&' + getFieldForRoute2 + '=' + this.state.areaName
        console.log(urlGotten);
        fetch(urlGotten).then(res => res.json()).then(data => {
          var joined = this.state.dataGottenBack.concat(data)
          // var dataToAdd = data;
          return joined;
        }).then( joined => {
          this.setState({
            dataGottenBack: joined,
          })
        }).then( () => {
          this.updateLineChart0();
          this.updateLineChart2();
        })

  }

  // Get the data and then run the update for the chart to be displayed for each one
  componentDidMount() {
    this.setState({
      areaName: this.props.areaName.trim(),
      areaType: this.props.areaType,
      ifOverview: this.props.ifOverview,
      ifCases: this.props.ifCases,
      ifDeaths: this.props.ifDeaths,
      ifTesting: this.props.ifTesting,
      ifHospital: this.props.ifHospital,
    })

    // if (this.state.ifOverview) {
    var baseURL = 'http://localhost:5000/'
    var apiName = 'apic/'
    var getRoute = 'getforecastinginformation'
    var getFieldForRoute1 = 'areatypegiven'
    var getFieldForRoute2 = ''
    // if (this.state.areaName !== "United Kingdom") {
    getFieldForRoute2 = 'areanamegiven'
    // } else {
    //   getFieldForRoute2 = 'areanamegiven'
    // }

    var urlGotten = baseURL + apiName + getRoute + '?' + getFieldForRoute1 + '=' + this.state.areaType + '&' + getFieldForRoute2 + '=' + this.state.areaName + "&model=lstm"
      console.log(urlGotten);
      fetch(urlGotten).then(res => res.json()).then(data => {
        var joined = this.state.dataGottenBack.concat(data)
        // var dataToAdd = data;
        console.log(joined);
        this.setState({
          dataGottenBack: joined,
          getDataForChart: this.props.getDataForChart,

        }, () => {

          // this.updateLineChart0();
        })

      });


      var urlGotten = baseURL + apiName + getRoute + '?' + getFieldForRoute1 + '=' + this.state.areaType + '&' + getFieldForRoute2 + '=' + this.state.areaName + "&model=prophet"
        console.log(urlGotten);
        fetch(urlGotten).then(res => res.json()).then(data => {
          var joined = this.state.dataGottenBack.concat(data)
          // var dataToAdd = data;
          console.log(joined);
          this.setState({
            dataGottenBack: joined,
            getDataForChart: this.props.getDataForChart,

          }, () => {

            // this.updateLineChart0();
          })

        });


        var baseURL = 'http://localhost:5000/'
        var apiName = 'apic/'
        var getRoute = 'getoverview'
        var getFieldForRoute1 = 'areatype'
        var getFieldForRoute2 = 'areaname '
        var urlGotten = baseURL + apiName + getRoute + '?' + getFieldForRoute1 + '=' + this.state.areaType + '&' + getFieldForRoute2 + '=' + this.state.areaName
        console.log(urlGotten);
        fetch(urlGotten).then(res => res.json()).then(data => {
          var joined = this.state.dataGottenBack.concat(data)
          // var dataToAdd = data;
          return joined;
        }).then( joined => {
          this.setState({
            dataGottenBack: joined,
          })
        }).then( () => {
          this.updateLineChart0();
          this.updateLineChart2();
        })

    }



    componentDidUpdate(prevProps) {
      // Typical usage (don't forget to compare props):
      if (this.props.areaName !== prevProps.areaName) {
        console.log(23423942);
        this.setState({
          areaName: this.props.areaName.trim(),
          areaType: this.props.areaType,
        }, () => {
          this.runAllCharts();

        });
      }
    }


  updateLineChart0 = () => {
    console.log(12345);
    console.log(this);

    console.log(this.state);

    const myChartRef0 = this.chartRef0.current.getContext("2d");

    if (this.state.ifOverview) {

      if (this.state.ifCases) {
        console.log(this.state);

    // var thisLength = Object.keys(this.state.dataGottenBack[2].data).length

    // console.log(thisLength);


    var myChart0 = new Chart(myChartRef0, {
      type: "line",
      data: {
        //Bring in data
        labels: this.state.dataGottenBack[0].data.map(d => d.date).reverse(),
        datasets: [
          {
            data: this.state.dataGottenBack[0].data.map(d => d.new_predicted).reverse(),
            label: 'Forecasting Daily Cases: ' + 'LSTM model: ' + this.state.areaName,
            borderColor: 'rgba(0, 200, 0, 1)',
          },
          {
            data: this.state.dataGottenBack[1].data.map(d => d.new_predicted).reverse(),
            label: 'Forecasting Daily Cases: ' + 'Prophet model: ' + this.state.areaName,
            borderColor: 'rgba(0, 100, 52, 1)',
          }
        ]
        },
        options: {
          scales: {
            xAxes: [{
              type: 'time',
              distribution: 'series'
            }]
          }
        }
      });

    this.setState({myChart0: myChart0});

    }

    }
  }




  updateLineChart2 = () => {

    console.log(this.state.dataGottenBack);

    if (this.state.dataGottenBack.length > 2) {

    const transformedData = this.state.dataGottenBack[0].data.map(obj=>{
      return {
        x:obj.date,
        y:obj.new_predicted,
      }
    })

    const transformedData2 = this.state.dataGottenBack[1].data.map(obj=>{
      return {
        x:obj.date,
        y:obj.new_predicted,
      }
    })

    let transformedData3 = {}


    if (this.state.areaType == 'region') {
    transformedData3 = this.state.dataGottenBack[2].data.map(obj=>{
      return {
        x:obj.date,
        y:obj.newCasesBySpecimenDate,
      }
    })
  } else {
    transformedData3 = this.state.dataGottenBack[2].data.map(obj=>{
      return {
        x:obj.date,
        y:obj.newCasesByPublishDate,
      }
    })
      }

    console.log(transformedData3);


    // console.log(transformedData)

    // console.log(this.state);

    const myChartRef2 = this.chartRef2.current.getContext("2d");

    var myChart2 = new Chart(myChartRef2, {
      type: "line",
      data: {
        //Bring in data
        labels: this.state.dataGottenBack[0].data.map(d => d.date).reverse(),
        datasets: [
          {
            label: 'Forecasting Daily Cases: ' + 'LSTM model: ' + this.state.areaName,
            data: transformedData,
            fill: false,
            borderColor: 'rgba(0, 200, 0, 1)',
          },
          {
            label: 'Forecasting Daily Cases: ' + 'Prophet model: ' + this.state.areaName,
            data: transformedData2,
            fill: false,
            borderColor: 'rgba(150, 50, 48, 1)'
          },
          {
            label: 'Forecasting Daily Cases: ' + 'Actual data: ' + this.state.areaName,
            data: transformedData3,
            fill: false,
            borderColor: 'rgba(48, 80, 20, 0.3)'
          }

        ]
      },
      options: {
        tooltips: {
          // mode: 'index',
          intersect: false,
        },
        hover: {
          // mode: 'nearest',
          // intersect: true
        },
        scales: {
          yAxes: [{
            display: true,
            labelString: "Total",
            ticks: {
              beginAtZero:true
            }
          }],
          // Important to include this
          xAxes: [{
            type: 'time',
            distribution: 'series'
          }]
        },
      }
    });

    this.setState({myChart2: myChart2});

  }

}






      render() {
        const { data, labels } = this.state;
        console.log(this.state);

        return (
          <div >
            <div>
              {this.state.areaName}
              </div>
            {/* The area name will be displayed at the top */}
          <Card>
          <CardHeader

          title={this.state.chart0Title}
          action={
            <IconButton aria-label="settings">
            <AspectRatioIcon />
            </IconButton>
          }
          />
          <CardContent>
          <canvas id="myChart0" ref={this.chartRef0} />
          </CardContent>
          <CardActions>
          <IconButton aria-label="settings">
          <MoreVertIcon />
          </IconButton>
          </CardActions>
          </Card>


          <Card>
          <CardHeader
          title={this.state.chart2Title}
          action={
            <IconButton aria-label="settings">
            <AspectRatioIcon />
            </IconButton>
          }
          />
          <CardContent>
          <canvas id="myChart2" ref={this.chartRef2} />
          </CardContent>
          <CardActions>
          <IconButton aria-label="settings">
          <MoreVertIcon />
          </IconButton>
          </CardActions>
          </Card>


          </div>
        );
      };

    };
