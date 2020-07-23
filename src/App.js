import React, { useState, useEffect } from 'react';
import { Component } from "react";
import './App.css';
import LineChart from "./myChartsThis.js";
import { Grid } from "@material-ui/core";
import Header from "./header.js";
import MappedClassOf from './createmap';
import Map from './mapthis';
import SimpleTabs from './mytabs';
import Tooltip from '@material-ui/core/Tooltip';
import { Map as Maps, TileLayer, Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';


class App extends Component {

  state = {
    language: '',
    areaName: 'United Kingdom',
    search: '',
    dataForSearch: ['United Kingdom', 'England', 'Northern Ireland', 'Scotland', 'Wales'],
    dataGottenBackFromAPI: [],
  }

  handleLanguage = (langValue) => {
    this.setState({
        language: 'blah',
        areaName: '',
      });
  }

  handleAreaName = (langValue) => {
    console.log('handleAreaName');
    this.setState({
        areaName: langValue,
      });
  }

updateSearch(event) {
  console.log(event.target.value);

  // Limit to 20 characters in the search box
  this.setState({
    search: event.target.value.substr(0, 20)
  })

}

displayTextBox() {
  return (
    <input placeholder="Search" type="text"
    value={this.state.search}
    onChange={this.updateSearch.bind(this)} />

  );
}

clickedPlace(event) {
  const gottenPlaceTarget = event.currentTarget.innerHTML;
  // const gottenPlaceTargetInner = gottenPlaceTarget.innerHTML;
  console.log(gottenPlaceTarget);

  const urlToData = 'https://nominatim.openstreetmap.org/search?q=' + gottenPlaceTarget + ',%20United%20Kingdom';
  // Need to give the format of it too
  const formatForDataOutput = '&format=json';

  console.log(urlToData);

  fetch(urlToData + formatForDataOutput).then(res => res.json()).then(data => {

    this.setState({
      dataGottenBackFromAPI: [],
    }, () => {
      console.log("cleared");
    })


    var joined = this.state.dataGottenBackFromAPI.concat(data[0]);

    this.setState({
      dataGottenBackFromAPI: joined,
      areaName: gottenPlaceTarget,
    }, () => {
      console.log(this.state);
    })

  });

  // event.preventDefault();
  console.log(this);
}


  render() {

    let filteredSearchPlaces = this.state.dataForSearch.filter(
      (place) => {
        return place.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
      }
    );

    function handleLangChange(e) {
        var lang = e.target.value;
        console.log('done');
    }

  return (
    <Grid container direction="column">
      <Grid item>
        <Header />
      </Grid>
      <Grid item container>
        <Grid item xs={2} sm={2} md={2}>
        <div>
          Search for the region you want
          {this.displayTextBox()}

            {filteredSearchPlaces.map((place, i)=> {
              return <li onClick={this.clickedPlace.bind(this)} key={i}> {place} </li>;
            })}
        </div>

        </Grid>
        <Grid item xs={10} sm={5} md={5}>
        <MappedClassOf areaName={this.state.areaName} onSelectLanguage={this.handleLanguage} dataGottenBackFromAPI={this.state.dataGottenBackFromAPI} />

        Clustering test:
        <Maps className="markercluster-map" center={[51.0, 19.0]} zoom={4} maxZoom={18}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />

          {/* Put <MarkerClusterGroup {...props} /> inside react-leaflet after <TileLayer /> */}
          <MarkerClusterGroup>
            <Marker position={[54.3023545, -3.2765753]} />
            <Marker position={[54.3013545, -3.2764753]} />
            <Marker position={[51.7023545, -3.8765753]} />
          </MarkerClusterGroup>
        </Maps>

        </Grid>
        <Grid item xs={12} sm={5} md={5}>
        <SimpleTabs handleAreaName={this.handleAreaName} areaName={this.state.areaName} dataGottenBackFromAPI={this.state.dataGottenBackFromAPI} />
        </Grid>

      </Grid>
    </Grid>
  );
}
}

export default App;
