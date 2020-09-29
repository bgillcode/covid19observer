import React, { Component } from "react";
import LineChart from "./chartsToDisplay.js";
import LineChartForecasting from "./chartsToDisplayForecasting";
import './App.css';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import './App.css';
import { Grid } from "@material-ui/core";

export default class Overview extends Component {



  populateDetails() {
    var gottenThis = " "
    if (this.props.areaDetailsForOverview[0].data !== null) {
      console.log(this.props.areaDetailsForOverview);
      var populationAllAges = "Not available"
      if (this.props.areaDetailsForOverview[0].data['All ages']) {
        populationAllAges = this.props.areaDetailsForOverview[0].data['All ages']
      }
      var populationMale = "Not available"
      if (this.props.areaDetailsForOverview[0].data['Male']) {
        populationMale = this.props.areaDetailsForOverview[0].data['Male']
      }
      var populationFemale = "Not available"
      if (this.props.areaDetailsForOverview[0].data['Female']) {
        populationAllAges = this.props.areaDetailsForOverview[0].data['Female']
      }
      console.log(gottenThis);
    }
    return (

    <div>
      <Grid container direction="column">
        <Grid item container>
          <Grid item xs={12} sm={12} md={6}>
            <div style={{ fontSize: 13, lineHeight: 0 }}>
            <p> Region selected: {this.props.areaName} </p>
            <p> Population total: {populationAllAges} </p>
            <p> - Male population: {populationMale} </p>
            <p> - Female population: {populationFemale} </p>
            <p> Number of people in region with: </p>
            <p> - Diabetes: {this.props.areaName} </p>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <div style={{ fontSize: 13, lineHeight: 0 }}>
            <p> School information: {this.props.areaName} </p>
            <p> Weather: Temperature: {this.props.areaName} </p>
            <p> Travel: {this.props.areaName} </p>
            <p> Policies on this date: {this.props.areaName} </p>
            </div>
          </Grid>
        </Grid>
      </Grid>
        </div>

    )
  }




  render() {
    return (
      <React.Fragment>
      {this.populateDetails()}<LineChart getDataForChart={this.props.areaName} ifOverview={1} ifCases={1} areaName={this.props.areaName} areaType={this.props.areaType} />
      </React.Fragment>
    )
  }
}
