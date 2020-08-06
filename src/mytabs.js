import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import LineChart from "./myChartsThis.js";
import './App.css';
import { Grid } from "@material-ui/core";
import { Component } from "react";


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
      console.log(this.props);

    }
  }

  handleChange = (event, value) => {
    this.setState({ Tabvalue: value });
    console.log(this.props);
    console.log(this.props.areaDetailsForOverview[0].data.Male);
  };

  populateDetails() {
    return (
    <div>
      <Grid container direction="column">
        <Grid item container>
          <Grid item xs={12} sm={12} md={6}>
            <div style={{ fontSize: 13, lineHeight: 0 }}>
            <p> Region selected: {this.props.areaName} </p>
            <p> Population: {this.props.areaDetailsForOverview[0].data['All ages']} </p>
            <p> Population density: {this.props.areaName} </p>
            <p> Number of people in region with: {this.props.areaName} </p>
            <p> - Diabetes: {this.props.areaName} </p>
            <p> - Kidney-related: {this.props.areaName} </p>
            <p> Number of people aged over 65: {this.props.areaName} </p>
            <p> People in poverty: {this.props.areaName} </p>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <div style={{ fontSize: 13, lineHeight: 0 }}>
            <p> School information: {this.props.areaName} </p>
            <p> - Schools open: {this.props.areaName} </p>
            <p> - Schools closed: {this.props.areaName} </p>
            <p> Weather: Temperature: {this.props.areaName} </p>
            <p> Travel: {this.props.areaName} </p>
            <p> Lockdown on this date: {this.props.areaName} </p>
            </div>
          </Grid>
        </Grid>
      </Grid>
        </div>

    )
  }

  render() {
    const { classes } = this.props;
    const { Tabvalue } = this.state;

    let value = Tabvalue;
    console.log(this.props.areaName);

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
      <Tab style={{ minWidth: 30 }} label="Charts" />
      <Tab style={{ minWidth: 30 }} label="Cases" />
      <Tab style={{ minWidth: 30 }} label="Hospitalised" />
      <Tab style={{ minWidth: 30 }} label="Testing" />
      <Tab style={{ minWidth: 30 }} label="Deaths" />
      <Tab style={{ minWidth: 30 }} label="Forecasting" />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer style={{ fontSize: 12 }}>{this.populateDetails()}<LineChart getDataForChart={this.props.areaName} ifOverview={1} ifCases={1} areaName={this.props.areaName} areaType={this.props.areaType} /></TabContainer>}
        {value === 1 && <TabContainer><LineChart getDataForChart={this.props.areaName} ifOverview={1} ifCases={1} areaName={this.props.areaName} areaType={this.props.areaType} /></TabContainer>}
        {value === 2 && <TabContainer>Cases</TabContainer>}
        {value === 3 && <TabContainer>Hospitalised</TabContainer>}
        {value === 4 && <TabContainer>Testing</TabContainer>}
        {value === 5 && <TabContainer>Deaths</TabContainer>}
        {value === 6 && <TabContainer>Forecasting</TabContainer>}
      </div>
    );
  }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleTabs);
