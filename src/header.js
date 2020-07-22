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
    height: 45
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
        <InfoIcon />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
