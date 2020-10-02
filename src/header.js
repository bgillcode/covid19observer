import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import AcUnitRoundedIcon from "@material-ui/icons/AcUnitRounded";
import { makeStyles } from "@material-ui/styles";
import InfoIcon from '@material-ui/icons/Info';


const useStyles = makeStyles(() => ({
  typographyStyles: {
    flex: 1,
  },
  heightOfThis: {
    height: 45,
    background: '#202b40',
  },
  textOfThis: {
    fontSize: 10,
    flex: 5,
    height: 50
  }
}));

const Header = () => {
  const classes = useStyles();
  return (
    <AppBar className={classes.heightOfThis} position="static">
      <Toolbar>
        <Typography className={classes.typographyStyles}>
          COVID-19 Observer
        </Typography>
        <Typography className={classes.textOfThis}>COVID-19 is an infectious disease caused by a newly discovered coronavirus. This dashboard was created as a means of observing the infection rates of this disease across multiple regions for patients in the United Kingdom, taking into account various sources of data across a period of time, along with potential forecasting information. All of this has been compiled into an easy and informative view. Data is updated once per day to allow the system to gather relevant data.
          </Typography>
        <InfoIcon />
      </Toolbar>
    </AppBar>

  );
};

export default Header;
