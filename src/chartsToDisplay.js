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
      dataGottenBackAges : [],
      getDataForChart: "",
      areaType: "overview",
      areaName: "",

      chart0Title: "Daily Cases:",
      chart1Title: "Patients in ventilation beds:",
      chart2Title: "Comparison of: Daily Cases and Patients in ventilation beds:",
      chart3TitleAges: "Ages of people with infections in England ",

      ifOverview: true,

      ifCases: true,

      ifDeaths: false,
      ifTesting: false,
      ifHospital: false,

      chartType1: 'line',
      chartType2Ages: 'doughnut'
    }

  }

  // Chart 0
  chartRef0 = React.createRef();

  // Chart 1
  chartRef1 = React.createRef();

  // Chart 2
  chartRef2 = React.createRef();

  // Age chart
  myDoughnutChartRef1 = React.createRef();

  // Chart 4
  chartRef4 = React.createRef();

  // Chart 5
  chartRef5 = React.createRef();

  // Chart 6
  chartRef6 = React.createRef();


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

    if (this.state.areaName == 'United Kingdom' || this.state.areaName == 'England' || this.state.areaName == "" || this.state.areaType == 'nation' || this.state.areaType == 'overview' || this.props.areaType == 'overview') {

      if (this.state.ifOverview) {
        var baseURL = 'http://localhost:5000/'
        var apiName = 'apic/'
        var getRoute = 'getoverview'
        var getFieldForRoute1 = 'areatype'
        var getFieldForRoute2 = 'areaname'
        var urlGotten = baseURL + apiName + getRoute + '?' + getFieldForRoute1 + '=' + this.state.areaType + '&' + getFieldForRoute2 + '=' + this.state.areaName
        fetch(urlGotten).then(res => res.json()).then(data => {
          var joined = this.state.dataGottenBack.concat(data)

          this.setState({
            dataGottenBack: joined,
            getDataForChart: this.props.getDataForChart,

          }, () => {
            this.updateLineChart0();
          })

        });
      } else {
        this.setState({
          getDataForChart: "no",
        })
        var baseURL = 'http://localhost:5000'
        var apiName = 'apic'
        var getRoute = 'getoverview'
        var getFieldForRoute1 = 'areatype'
        var getFieldForRoute2 = 'areanamegiven'
        var urlGotten = baseURL + '/' + apiName + '/' + getRoute + '?' + getFieldForRoute1 + '=' + this.state.areaType + '&' + getFieldForRoute2 + '=' + this.state.areaName
        fetch(baseURL).then(res => res.json()).then(data => {
          var joined = this.state.dataGottenBack.concat(data)

          this.setState({
            dataGottenBack: joined,
            getDataForChart: this.props.getDataForChart,

          }, () => {
            this.updateLineChart0();
          })

        });
      }

      var baseURL2 = 'http://localhost:5000'
      var apiName = 'apic'
      var getRoute = 'getoverview'
      var getFieldForRoute1 = 'areatype'
      var getFieldForRoute2 = 'areaname'
      var urlGotten = baseURL + '/' + apiName + '/' + getRoute + '?' + getFieldForRoute1 + '=' + this.state.areaType + '&' + getFieldForRoute2 + '=' + this.state.areaName

      fetch(urlGotten).then(res => res.json()).then(data => {
        var joined = this.state.dataGottenBack.concat(data)

        this.setState({
          dataGottenBack: joined,

        }, () => {
          console.log(this);
          this.updateLineChart1();
          this.updateLineChart2();
        })

      });


      var baseURL2 = 'http://localhost:5000'
      var apiName = 'apic'
      var getRoute = 'getagegroupsforcumulativeadmissions'
      var getFieldForRoute2 = 'areaname'
      var urlGotten = baseURL + '/' + apiName + '/' + getRoute + '?' + getFieldForRoute1
      fetch(urlGotten).then(res => res.json()).then(data => {
        var joined = this.state.dataGottenBackAges.concat(data)

        this.setState({
          dataGottenBackAges: joined,

        }, () => {
          this.updateAgeChart();
        })

      });

    } else if (this.state.areaType == 'region') {

      if (this.state.ifOverview) {
        var baseURL = 'http://localhost:5000'
        var apiName = 'apic'
        var getRoute = 'getoverview'
        var getFieldForRoute1 = 'areatype'
        var getFieldForRoute2 = ''
        if (this.state.areaName !== "United Kingdom") {
          getFieldForRoute2 = 'areanamegiven'
        } else {
          getFieldForRoute2 = 'areaname'
        }

        var urlGotten = baseURL + '/' + apiName + '/' + getRoute + '?' + getFieldForRoute1 + '=' + this.state.areaType + '&' + getFieldForRoute2 + '=' + this.state.areaName
        // console.log(urlGotten);
        fetch(urlGotten).then(res => res.json()).then(data => {
          var joined = this.state.dataGottenBack.concat(data)
          // var dataToAdd = data;

          this.setState({
            dataGottenBack: joined,
            getDataForChart: this.props.getDataForChart,

          }, () => {
            this.updateLineChart0();
          })

        });
      } else {
        this.setState({
          getDataForChart: "no",
        })
        var baseURL = 'http://localhost:5000'
        var apiName = 'apic'
        var getRoute = 'getoverview'
        var getFieldForRoute1 = 'areatype'
        var getFieldForRoute2 = 'areanamegiven'
        var urlGotten = baseURL + '/' + apiName + '/' + getRoute + '?' + getFieldForRoute1 + '=' + this.state.areaType + '&' + getFieldForRoute2 + '=' + this.state.areaName
        // console.log(urlGotten);
        fetch(baseURL).then(res => res.json()).then(data => {
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
    }

  }



  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.areaName !== prevProps.areaName) {
      // console.log(23423942);
      if (this.props.areaName.trim() !== 'United Kingdom') {
        this.setState({
          areaName: this.props.areaName.trim(),
          areaType: this.props.areaType,
        }, () => {
          this.runAllCharts();
          this.getAndDisplayCOVIDInformation();
        });
      } else {
        if (this.props.areaName.trim() == 'United Kingdom') {
          this.setState({
            areaName: this.props.areaName.trim(),
            areaType: 'overview',
          }, () => {
            this.runAllCharts();
            this.getAndDisplayCOVIDInformation();
          });

        }
      }


    }


  }



  getAndDisplayCOVIDInformation() {
    var gottenCumulativeAdmissions = 0;
    if (this.state.dataGottenBack[0]) {

      if (this.state.dataGottenBack[0]) {


        if (this.state.dataGottenBack[0].data[0].areaType == 'nation' || this.state.dataGottenBack[0].data[0].areaType == 'overview') {
          return (
            <div>
              <div>
                Last updated for {this.state.areaName}: {this.state.dataGottenBack[0].data[0].date} {"\n"}
              </div>
              New Cases for {this.state.areaName}: {this.state.dataGottenBack[0].data[0].newCasesByPublishDate} {"\n"}
              <div>
                Cumulative Cases for {this.state.areaName}: {this.state.dataGottenBack[0].data[0].cumCasesByPublishDate} {"\n"}
              </div>
              <div>
                Patients in Mechanical Ventilation beds for {this.state.areaName}: {this.state.dataGottenBack[0].data[0].covidOccupiedMVBeds} {"\n"}
              </div>
              <div>
                Cumulative Admissions to Hospital for {this.state.areaName}: {this.state.dataGottenBack[0].data[3].cumAdmissions} {"\n"}
                <div>
                  New deaths for {this.state.areaName}: {this.state.dataGottenBack[0].data[3].newDeathsByPublishDate} {"\n"}
                </div>
                <div>
                  Cumulative deaths for {this.state.areaName}: {this.state.dataGottenBack[0].data[3].cumDeathsByPublishDate} {"\n"}
                </div>
              </div>
            </div>
          );
        }
        else if (this.state.dataGottenBack[0].data[0].areaType == 'region') {
          return (
            <div>
              <div>
                Last updated for {this.state.areaName}: {this.state.dataGottenBack[0].data[0].date} {"\n"}
              </div>
              New Cases for {this.state.areaName}: {this.state.dataGottenBack[0].data[0].newCasesBySpecimenDate} {"\n"}
              <div>
                Cumulative Cases for {this.state.areaName}: {this.state.dataGottenBack[0].data[0].cumCasesBySpecimenDate} {"\n"}
                <div>
                  New deaths for {this.state.areaName}: {this.state.dataGottenBack[0].data[0].newDeathsByPublishDate} {"\n"}
                </div>
                <div>
                  Cumulative deaths for {this.state.areaName}: {this.state.dataGottenBack[0].data[0].cumDeathsByPublishDate} {"\n"}
                </div>
              </div>
            </div>
          );
        }

      }

    }

  }



  updateLineChart0 = () => {

    const myChartRef0 = this.chartRef0.current.getContext("2d");

    var variableToUseForCases = 'newCasesByPublishDate';

    if (this.state.areaType == 'region') {
      variableToUseForCases = 'newCasesBySpecimenDate';
    } else {
      variableToUseForCases = 'newCasesByPublishDate';
    }


    if (this.state.areaType == 'region') {

      if (this.state.ifOverview) {

        if (this.state.ifCases) {

          var myChart0 = new Chart(myChartRef0, {
            type: "line",
            data: {
              // Bring in data
              labels: this.state.dataGottenBack[0].data.map(d => d.date).reverse(),
              datasets: [
                {
                  data: this.state.dataGottenBack[0].data.map(d => d.newCasesBySpecimenDate).reverse(),
                  label: 'Daily Cases: ' + this.state.areaName,
                  borderColor: 'rgba(0, 200, 0, 1)',
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

      } else {

        if (this.state.ifOverview) {

          if (this.state.ifCases) {

            var myChart0 = new Chart(myChartRef0, {
              type: "line",
              data: {
                // Bring in data
                labels: this.state.dataGottenBack[0].data.map(d => d.date).reverse(),
                datasets: [
                  {
                    data: this.state.dataGottenBack[0].data.map(d => d.newCasesByPublishDate).reverse(),
                    label: 'Daily Cases: ' + this.state.areaName,
                    borderColor: 'rgba(0, 200, 0, 1)',
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

      }



      updateLineChart1 = () => {
        if (this.state.dataGottenBack.length > 1) {
          const myChartRef1 = this.chartRef1.current.getContext("2d");



          var myChart1 = new Chart(myChartRef1, {
            type: "line",
            title: 'COVID-19 patients in ventilation beds: ' + this.state.areaName,
            data: {
              // Bring in data
              labels: this.state.dataGottenBack[1].data.map(d => d.date).reverse(),
              datasets: [
                {
                  data: this.state.dataGottenBack[1].data.map(d => d.covidOccupiedMVBeds).reverse(),
                  borderColor: '#F56565',
                  label: 'COVID-19 patients in ventilation beds: ' + this.state.areaName,
                }]
              },
              options: {
                title: 'COVID-19 patients in ventilation beds: ' + this.state.areaName,
                scales: {
                  xAxes: [{
                    type: 'time',
                    distribution: 'series',
                    labelString: 'days'
                  }]
                }
              }
            });
          }

        }


        updateLineChart2 = () => {

          if (this.state.dataGottenBack.length > 1) {

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


            const myChartRef2 = this.chartRef2.current.getContext("2d");

            var myChart2 = new Chart(myChartRef2, {
              type: "scatter",
              data: {
                //Bring in data
                labels: this.state.dataGottenBack[0].data.map(d => d.date).reverse(),
                datasets: [
                  {
                    label: 'Daily Cases',
                    data: transformedData,
                    fill: false,
                    borderColor: 'rgba(0, 200, 0, 1)',
                  },
                  {
                    label: 'COVID-19 patients in ventilation beds: ' + this.state.areaName,
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
          }

        }





        updateAgeChart = () => {

          if (this.state.dataGottenBackAges.length > 0) {

            if (this.state.areaName == 'United Kingdom' || this.state.areaName == 'England' || this.state.areaName == "") {
              // console.log(this.state);

              const myDoughnutChartRef1 = this.myDoughnutChartRef1.current.getContext("2d");

              var qssc = [
                this.state.dataGottenBackAges[0].data[0].cumAdmissionsByAge[0].value,
                this.state.dataGottenBackAges[0].data[0].cumAdmissionsByAge[1].value,
                this.state.dataGottenBackAges[0].data[0].cumAdmissionsByAge[2].value,
                this.state.dataGottenBackAges[0].data[0].cumAdmissionsByAge[3].value,
                this.state.dataGottenBackAges[0].data[0].cumAdmissionsByAge[4].value,
              ];

              // console.log(qssc);

              var myDoughnutChart = new Chart(myDoughnutChartRef1, {
                type: "doughnut",
                data: {
                  labels: ['0-5', '65-84', '6-17', '18-64', "85+"],
                  title: 'Ages of people with infections',
                  label: 'Ages of people with infections',
                  datasets: [{
                    label: '# of People',
                    data: qssc,
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.5)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                  }]
                },
                options: {
                  //cutoutPercentage: 40,
                  title: 'Ages of people with infections',
                  responsive: true,

                }
              });


            } else {
              return;
            }




          }
        }


        // This is run on subsequent updating of the data and page
        runAllCharts() {
          this.setState({
            dataGottenBack: [],
            getDataForChart: "",
          });

          if (this.state.areaName == 'United Kingdom' || this.state.areaName == 'England' || this.state.areaName == "" || this.state.areaType == 'nation' || this.state.areaType == "overview") {

            if (this.state.ifOverview) {
              var baseURL = 'http://localhost:5000/'
              var apiName = 'apic/'
              var getRoute = 'getoverview'
              var getFieldForRoute1 = 'areatype'
              var getFieldForRoute2 = ''
              if (this.state.areaName !== "United Kingdom") {
                getFieldForRoute2 = 'areanamegiven'
              } else {
                getFieldForRoute2 = 'areaname'
              }

              var urlGotten = baseURL + apiName + getRoute + '?' + getFieldForRoute1 + '=' + this.state.areaType + '&' + getFieldForRoute2 + '=' + this.state.areaName
              fetch(urlGotten).then(res => res.json()).then(data => {
                var joined = this.state.dataGottenBack.concat(data)

                this.setState({
                  dataGottenBack: joined,
                  getDataForChart: this.props.getDataForChart,

                }, () => {
                  this.updateLineChart0();
                })

              });
            } else {
              this.setState({
                getDataForChart: "no",
              })
              var baseURL = 'http://localhost:5000/'
              var apiName = 'apic/'
              var getRoute = 'getoverview'
              var getFieldForRoute1 = 'areatype'
              var getFieldForRoute2 = 'areanamegiven'
              var urlGotten = baseURL + apiName + getRoute + '?' + getFieldForRoute1 + '=' + this.state.areaType + '&' + getFieldForRoute2 + '=' + this.state.areaName
              fetch(baseURL).then(res => res.json()).then(data => {
                var joined = this.state.dataGottenBack.concat(data)

                this.setState({
                  dataGottenBack: joined,
                  getDataForChart: this.props.getDataForChart,

                }, () => {
                  this.updateLineChart0();
                })

              });
            }

            var baseURL2 = 'http://localhost:5000/'
            var apiName = 'apic/'
            var getRoute = 'getoverview'
            var getFieldForRoute1 = 'areatype'
            var getFieldForRoute2 = ''
            if (this.state.areaName !== "United Kingdom") {
              getFieldForRoute2 = 'areanamegiven'
            } else {
              getFieldForRoute2 = 'areaname'
            }
            var urlGotten = baseURL + apiName + getRoute + '?' + getFieldForRoute1 + '=' + this.state.areaType + '&' + getFieldForRoute2 + '=' + this.state.areaName

            fetch(urlGotten).then(res => res.json()).then(data => {
              var joined = this.state.dataGottenBack.concat(data)

              this.setState({
                dataGottenBack: joined,

              }, () => {
                console.log(this);
                this.updateLineChart1();
                this.updateLineChart2();
              })

            });



            var baseURL2 = 'http://localhost:5000/'
            var apiName = 'apic/'
            var getRoute = 'getoverview'
            var getFieldForRoute1 = 'areatype'
            var getFieldForRoute2 = 'areaname'
            var urlGottenThis = 'https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=nation&latestBy=&structure=%7B%22areaType%22:%22areaType%22,%22areaName%22:%22areaName%22,%22areaCode%22:%22areaCode%22,%22date%22:%22date%22,%22cumAdmissionsByAge%22:%22cumAdmissionsByAge%22%7D&format=json'
            fetch(urlGottenThis).then(res => res.json()).then(data => {
              var joined = this.state.dataGottenBackAges.concat(data)
              // var dataToAdd = data;

              // console.log(joined);

              this.setState({
                dataGottenBackAges: joined,

              }, () => {
                this.updateAgeChart();
              })

            });

          } else if (this.state.areaType == 'region') {

            if (this.state.ifOverview) {
              var baseURL = 'http://localhost:5000/'
              var apiName = 'apic/'
              var getRoute = 'getoverview'
              var getFieldForRoute1 = 'areatype'
              var getFieldForRoute2 = ''
              if (this.state.areaName !== "United Kingdom") {
                getFieldForRoute2 = 'areanamegiven'
              } else {
                getFieldForRoute2 = 'areaname'
              }

              var urlGotten = baseURL + apiName + getRoute + '?' + getFieldForRoute1 + '=' + this.state.areaType + '&' + getFieldForRoute2 + '=' + this.state.areaName
              fetch(urlGotten).then(res => res.json()).then(data => {
                var joined = this.state.dataGottenBack.concat(data)
                this.setState({
                  dataGottenBack: joined,
                  getDataForChart: this.props.getDataForChart,

                }, () => {
                  this.updateLineChart0();
                })

              });
            } else {
              this.setState({
                getDataForChart: "no",
              })
              var baseURL = 'http://localhost:5000/'
              var apiName = 'apic/'
              var getRoute = 'getoverview'
              var getFieldForRoute1 = 'areatype'
              var getFieldForRoute2 = 'areanamegiven'
              var urlGotten = baseURL + apiName + getRoute + '?' + getFieldForRoute1 + '=' + this.state.areaType + '&' + getFieldForRoute2 + '=' + this.state.areaName
              // console.log(urlGotten);
              fetch(baseURL).then(res => res.json()).then(data => {
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
          }


        }



        doughnutChartShow() {
          if (this.state.areaName == 'United Kingdom' || this.state.areaName == 'England' || this.state.areaName == "") {
            return (<div><Card>
              <CardHeader
                title={this.state.chart3TitleAges}
                action={
                  <IconButton aria-label="settings">
                    <AspectRatioIcon />
                  </IconButton>
                }
                />
              <CardContent>
                <canvas id="myDoughnutChart" ref={this.myDoughnutChartRef1} />
              </CardContent>
              <CardActions>
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              </CardActions>
            </Card></div>);
          } else {
            return;
          }
        }


        lineChartShow() {
          if (this.state.areaName == 'United Kingdom' || this.state.areaName == 'England' || this.state.areaName == "" || this.state.areaType == 'nation' || this.state.areaType == 'overview') {
            return (<div>          <Card>
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
            </Card></div>);
          } else if ((this.state.areaType == 'region' || this.props.areaType == 'region')) {
            return (<div>          <Card>
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
            </Card></div>);
          } else {
            return;
          }
        }


        render() {
          const { data, labels } = this.state;

          return (
            <div>
              <div>
                {this.state.areaName}
              </div>
              {/* The area name will be displayed at the top */}

              {/* This is for displaying part of the information about the region, specifically about the COVID-19 figures such as infections, deaths, hospitalisations, etc */}
              {this.getAndDisplayCOVIDInformation()}

              {this.lineChartShow()}

              {/* This will show the doughnut chart if the area is set to England or the United Kingdom only, because this data for ages of hospitalisations is only currently available for England */}
              {this.doughnutChartShow()}

            </div>
          );
        };

      };
