import React, { useState, useEffect } from 'react';
import { Component } from "react";
import { Grid } from "@material-ui/core";

var style = {
    backgroundColor: "#F8F8F8",
    borderTop: "1px solid #E7E7E7",
    textAlign: "center",
    padding: "10px",
    left: "0",
    bottom: "0",
    height: "30px",
    width: "100%",
    fontSize: "12px",
}

var phantom = {
  padding: '50px',
  height: '60px',
  width: '100%',
}

function Footer({ children }) {
    return (
        <div>
            <div style={phantom} />
              <div id='site-information' display={{ xs: 'none', sm: 'none', md: 'block' }}>
                <ul>
                <p>Site Information</p>
                <li>Accessibility</li>
                <li>Data sources</li>
                <li>Map information</li>
                <li>News and information</li>
                <li>COVID-19 Basics</li>
                <li>View Desktop / Mobile version</li>
                </ul>
                </div>

            <div style={style}>COVID-19 is an infectious disease caused by a newly discovered coronavirus.
This dashboard was created as a means of observing the infection rates of this disease across multiple regions for patients in the United Kingdom, taking into account various sources of data across a period of time, along with potential forecasting information. All of this has been compiled into an easy and informative view. Data is updated once per day to allow the system to gather relevant data.
            </div>
        </div>
    )
}

export default Footer
