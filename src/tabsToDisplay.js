// This is used to display the tabs and overview information as well as pass data to the charts including forecasting charts to be viewed when a tab is clicked on

import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import LineChart from "./chartsToDisplay.js";
import LineChartForecasting from "./chartsToDisplayForecasting"
import './App.css';
import { Grid } from "@material-ui/core";
import { Component } from "react";
import Overview from './overview';
import { Paper } from '@material-ui/core';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  }
});

class SimpleTabs extends React.Component {
  state = {
    Tabvalue: 0,
    thisGraphData: [],
  };

  componentDidMount() {
    if (this.props.open) {
      this.setState({ Tabvalue: this.props.open });
    }
  }

  handleChange = (event, value) => {
    this.setState({ Tabvalue: value });
  };


  render() {
    const { classes } = this.props;
    const { Tabvalue } = this.state;

    let value = Tabvalue;
    // console.log(this.props.areaName);

    return (
      <div className={classes.root}>
      <AppBar position="static" style={{ background: '#2E3B55', height: 40  }}>
      <Tabs value={value}
      onChange={this.handleChange}
      variant="scrollable"
      scrollButtons="auto"
      aria-label="scrollable auto tabs example"
      >
      <Tab style={{ minWidth: 30 }} label="Overview" />
      <Tab style={{ minWidth: 30 }} label="Forecasting" />
      <Tab style={{ minWidth: 30 }} label="Cases" />
      <Tab style={{ minWidth: 30 }} label="Policies" />
          </Tabs>
        </AppBar><Paper style={{maxHeight: 600, overflow: 'auto'}}>
        {/* Overview information is displayed here in the first one, the Overview class also contains the chart data to be passed and runs this (the LineChart class in chartsToDisplay.js) */}
        {value === 0 && <TabContainer style={{ fontSize: 12 }}><Overview areaName={this.props.areaName} areaType={this.props.areaType} getDataForChart={this.props.getDataForChart} areaDetailsForOverview={this.props.areaDetailsForOverview}/></TabContainer>}
        {value === 1 && <TabContainer><LineChartForecasting getDataForChart={this.props.areaName} ifOverview={1} ifCases={1} areaName={this.props.areaName} areaType={this.props.areaType} /></TabContainer>}
        {value === 2 && <TabContainer>Cases</TabContainer>}
        {value === 5 && <TabContainer>
          Policies
        </TabContainer>}
      </Paper>
      </div>
    );
  }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleTabs);
