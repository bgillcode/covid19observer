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


export default class LineChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // This is where the data is being stored
      dataGottenBack : [],
      getDataForChart: "",
      areaType: "overview",
      areaName: "",

      chart0Title: "Daily Cases:",
      chart1Title: "Patients in ventilation beds:",
      chart2Title: "Chart with results together for first two:",

      ifOverview: true,

      ifCases: true,

      ifDeaths: false,
      ifTesting: false,
      ifHospital: false,

      urlForChart0: 'https://api.coronavirus-staging.data.gov.uk/v1/data?filters=areaName=United%2520Kingdom;areaType=overview&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22newCasesByPublishDate%22:%22newCasesByPublishDate%22,%22cumCasesByPublishDate%22:%22cumCasesByPublishDate%22%7D&format=json',
    }

  }

  // Chart 0
  chartRef0 = React.createRef();

  // Chart 1
  chartRef1 = React.createRef();

  // Chart 2
  chartRef2 = React.createRef();

  // Get the data and then run the update for the chart to be displayed for each one
  componentDidMount() {
    this.setState({
      areaName: this.props.areaName,
      areaType: this.props.areaType,
      ifOverview: this.props.ifOverview,
      ifCases: this.props.ifCases,
      ifDeaths: this.props.ifDeaths,
      ifTesting: this.props.ifTesting,
      ifHospital: this.props.ifHospital,
      // chart0Title: this.props.chart0Title,
      // chart1Title: this.props.chart1Title,
      // chart2Title: this.props.chart2Title,
    })

    if (this.state.ifOverview) {

      var urlGotten = 'http://localhost:5000/apic/getoverview?areatype=' + this.state.areaType + '&areanamegiven=' + this.state.areaName

      console.log(urlGotten);

      fetch(urlGotten).then(res => res.json()).then(data => {
        var joined = this.state.dataGottenBack.concat(data)
        return joined
        console.log(data);
        // var dataToAdd = data;
      }).then( joined => {
        this.setState({
          dataGottenBack: joined,
          getDataForChart: this.props.getDataForChart,

        }, () => {
          this.updateLineChart0();
        })
      }
    )

  } else {
      this.setState({
        getDataForChart: "no",
      })
      fetch('http://localhost:5000/apic/getoverview?areatype=nation&areanamegiven=England').then(res => res.json()).then(data => {
        var joined = this.state.dataGottenBack.concat(data)
        // var dataToAdd = data;

        this.setState({
          dataGottenBack: joined,
          getDataForChart: this.props.getDataForChart,

        }, () => {
          this.updateLineChart0();
        })

      });
    }


    var urlGotten2 = 'http://localhost:5000/apic/getoverview?areatype=' + this.state.areaType + '&areanamegiven=' + this.state.areaName

    console.log(urlGotten2);

    fetch(urlGotten2).then(res => res.json()).then(data => {
      var joined = this.state.dataGottenBack.concat(data)
      return joined
      console.log(data);
      // var dataToAdd = data;
    }).then( joined => {
      this.setState({
        dataGottenBack: joined,
        // getDataForChart: this.props.getDataForChart,

      }, () => {
        this.updateLineChart1();
        this.updateLineChart2();
      })
    }
  )


  }



  componentDidUpdate(prevProps) {
  // Typical usage (don't forget to compare props):
  if (this.props.areaName !== prevProps.areaName) {
    console.log("areaName set");
    this.setState({
        areaName: this.props.areaName,
      });
  }


  if (this.props.areaType !== prevProps.areaType) {
    console.log("areaType set");
    this.setState({
        areaType: this.props.areaType,
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

    var myChart0 = new Chart(myChartRef0, {
      type: "line",
      data: {
        //Bring in data
        labels: this.state.dataGottenBack[0].data.map(d => d.date).reverse(),
        datasets: [
          {
            data: this.state.dataGottenBack[0].data.map(d => d.newCasesByPublishDate).reverse(),

          }]
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

    }

    }
  }



    updateLineChart1 = () => {

      console.log(this.state);

      const myChartRef1 = this.chartRef1.current.getContext("2d");

      var myChart1 = new Chart(myChartRef1, {
        type: "line",
        data: {
          //Bring in data
          labels: this.state.dataGottenBack[1].data.map(d => d.date).reverse(),
          datasets: [
            {
              data: this.state.dataGottenBack[1].data.map(d => d.covidOccupiedMVBeds).reverse(),
            }]
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
      }


      updateLineChart2 = () => {

        const transformedData = this.state.dataGottenBack[0].data.map(obj=>{
          return {
            x:obj.date,
            y:obj.newCasesByPublishDate,
          }
        })

        const transformedData2 = this.state.dataGottenBack[1].data.map(obj=>{
          return {
            x:obj.date,
            y:obj.covidOccupiedMVBeds,
          }
        })


        console.log(transformedData)

        console.log(this.state);

        const myChartRef2 = this.chartRef2.current.getContext("2d");

        var myChart2 = new Chart(myChartRef2, {
          type: "scatter",
          data: {
            //Bring in data
            labels: this.state.dataGottenBack[0].data.map(d => d.date).reverse(),
            datasets: [
              {
                label: 'Chart 0',
                data: transformedData,
                fill: false,
                borderColor: 'rgba(0, 200, 0, 1)',
              },
              {
                label: 'Chart 1',
                data: transformedData2,
                fill: false,
                borderColor: 'rgba(150, 50, 48, 1)'
              }

            ]
          },
          options: {
            tooltips: {
              mode: 'index',
              intersect: false,
            },
            hover: {
              mode: 'nearest',
              // intersect: true
            },
            scales: {
              yAxes: [{
                display: true,
                labelString: "Frequency (Hz)",
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
          title={this.state.chart1Title}
          action={
            <IconButton aria-label="settings">
            <AspectRatioIcon />
            </IconButton>
          }
          />
          <CardContent>
          <canvas id="myChart1" ref={this.chartRef1} />
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
