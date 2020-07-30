import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import LineChart from "./myChartsThis.js";


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
        {value === 0 && <TabContainer>{this.props.areaName} Overview</TabContainer>}
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
