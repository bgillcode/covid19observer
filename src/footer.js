import React, { useState, useEffect } from 'react';
import { Component } from "react";
import { Grid } from "@material-ui/core";

var style = {
    backgroundColor: "#F8F8F8",
    borderTop: "1px solid #E7E7E7",
    textAlign: "left",
    padding: "10px",
    left: "0",
    bottom: "0",
    height: "30px",
    width: "100%",
    fontSize: "12px",
}

var phantom = {
  padding: '0px',
  height: '0px',
  width: '0%',
}

var textExplanations = {
  textAlign: "right",
  padding: '2px',
  width: '30%',
}

function Footer({ children }) {
    return (
        <div>
            <div style={phantom} />
              <div id='site-information' display={{ xs: 'none', sm: 'none', md: 'none' }}>
                <ul>
                  <p>About</p>
                  <p>Data sources</p>
                  <p>Map information</p>
                  <p>News and information</p>
                  <p>COVID-19 Basics</p>
                </ul>
                </div>
            </div>
    )
}

export default Footer
