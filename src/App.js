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
import { Map as Maps, TileLayer, Marker, Popup, GeoJSON, CircleMarker as LeafletCircleMarker, Circle as CircleLeaflet } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';

import axios from 'axios';

import L from "leaflet";

// Import the countries boundaries for the UK
import CountriesNew from "./countries"

// // Import counties boundaries for the UK
// import CountiesLower from "./countieslower"

class App extends Component {

  state = {
    language: '',
    areaName: 'United Kingdom',
    areaType: 'overview',
    search: '',
    dataForSearch: ['United Kingdom', 'England', 'Northern Ireland', 'Scotland', 'Wales'],
    dataGottenBackFromAPI: [],
    chosenFromDropdownArray: 10,

    dataGottenBackPlaces: [],

    latOfArea: "54.7023545",
    lonOfArea: "-3.2765753",
    valueOfZoom: 5,
  }

  handleLanguage = (langValue) => {
    this.setState({
      language: 'blah',
    });
  }

  getGeoJSONNew() {
    // console.log(CountriesNew);
    return CountriesNew;
    // console.log();
  }

  getColor(d) {
    return d > 1000 ? '#800026' :
    d > 500  ? '#BD0026' :
    d > 200  ? '#E31A1C' :
    d > 100  ? '#FC4E2A' :
    d > 50   ? '#FD8D3C' :
    d > 20   ? '#FEB24C' :
    d > 10   ? '#FED976' :
    '#FFEDA0';

  }

  style(feature) {
    return {
      fillColor: this.getColor(250),
      weight: 2,
      opacity: 0.3,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.2
    };
  }

  createClusterCustomIcon(cluster) {
    var markers = cluster.getAllChildMarkers();
    var n = 0;
    console.log(markers);
    for (var i = 0; i < markers.length; i++) {
      // Adds the number passed to it in the props (params)
      n += markers[i].options.number;
    }
    return L.divIcon({ html: n, className: 'mycluster', iconSize: L.point(40, 40) });
  }

  // getGeoJSONNewCountiesLower() {
  //   // console.log(CountriesNew);
  //   return CountiesLower;
  //   // console.log();
  // }

  handleAreaName = (langValue) => {
    console.log('handleAreaName');
    this.setState({
      areaName: langValue,
    });
  }

//   getStyle(feature, layer) {
//     console.log(feature);
//   return {
//     color: '#022450',
//     weight: 2,
//     opacity: 0.1
//   }
// }

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

      console.log(joined);

      let valueOfZoom = 6;

      if (joined[0].lat && joined[0].lon) {
        // Change the zoom out if it's for the United Kingdom, otherwise the zoom will be more zoomed in if selecting a region
        if (gottenPlaceTarget.includes("United Kingdom")) {
          valueOfZoom = 5;
        }

        this.setState({
          dataGottenBackFromAPI: joined,
          latOfArea: joined[0].lat,
          lonOfArea: joined[0].lon,
          valueOfZoom: valueOfZoom,
          areaName: gottenPlaceTarget,
        }, () => {
          console.log(this.state);
        })

      }



    });

    // event.preventDefault();
    console.log(this);
  }


  chosenFromDropdown(event) {
    console.log(event);
    this.setState({
      chosenFromDropdownArray: event.target.value
    })

  };

  handleChange(event) {
  const name = event.target.value;
  console.log(name);
  this.setState({
    chosenFromDropdownArray: name,
  });
  console.log(this);
};


  // Get the data and then run the update for the chart to be displayed for each one
  componentDidMount() {
      var urlGotten = 'http://localhost:5000/apic/getoverview?areatype=' + this.state.areaType + '&areanamegiven=' + this.state.areaName

      console.log(urlGotten);

      fetch(urlGotten).then(res => res.json()).then(data => {
        var joined = this.state.dataGottenBackPlaces.concat(data)
        console.log(data);
        // var dataToAdd = data;
      })


    var urlGotten2 = 'http://localhost:5000/apic/getoverview?areatype=' + 'nation'

    fetch(urlGotten2).then(res => res.json()).then(data => {
      var joined = this.state.dataGottenBackPlaces.concat(data)
      console.log(data);
      // var dataToAdd = data;
    })


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
            {/* Map */}
            <Grid item xs={10} sm={4} md={4}>


              <div>
                <FormControl>
                  <InputLabel htmlFor="age-native-simple">Currently Displaying:</InputLabel>
                  <Select
                    native
                    onChange={this.handleChange.bind(this)}
                    value={this.state.chosenFromDropdown}
                    inputProps={{
                      name: 'age',
                      id: 'age-native-simple',
                    }}
                    >
                    <option value={10}>Cumulative Daily Cases</option>
                    <option value={20}>Cumulative Patients in Mechanical Ventilation Beds</option>
                    <option value={30}>Cumulative Testing</option>
                  </Select>
                </FormControl>
              </div>






              {/* <MappedClassOf areaName={this.state.areaName} onSelectLanguage={this.handleLanguage} dataGottenBackFromAPI={this.state.dataGottenBackFromAPI} /> */}

              Clustering test:
              <Maps className="markercluster-map" center={[this.state.latOfArea, this.state.lonOfArea]} zoom={this.state.valueOfZoom} maxZoom={18}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />

                {/* Put <MarkerClusterGroup {...props} /> inside react-leaflet after <TileLayer /> */}

                {/*<MarkerClusterGroup>

                  <Marker position={[54.3023545, -3.2765753]} />
                  <Marker position={[54.3013545, -3.2764753]} />

                  <Marker position={[51.7023545, -3.8765753]}>
                    <Popup
                      minWidth={200}
                      closeButton={false}
                      onClose={popup => console.warn('popup-close', popup)}
                      >
                      <div>
                        <b>Hello world!</b>
                        <p>stuff</p>
                      </div>
                    </Popup>

                  </Marker>

                </MarkerClusterGroup>
                */}

                <MarkerClusterGroup iconCreateFunction={this.createClusterCustomIcon}>

                <Marker position={[59.3023545, -3.2765753]} number={5}>
                  <Popup
                    minWidth={200}
                    closeButton={false}
                    onClose={popup => console.warn('popup-close', popup)}
                    >
                    <div>
                      <b>Location: Hello world2!</b>
                      <p>Count: {4}</p>
                    </div>
                  </Popup>
                  </Marker>

                <Marker position={[51.7323545, -3.2765753]} number={5} />

                  <Marker position={[55.7323545, -1.2765753]} number={8} />
                  <Marker position={[51.7323545, -1.2755753]} number={1000.23} />

              </MarkerClusterGroup>

                <CircleLeaflet center={[51.7323545, -3.2765753]} radius={5000} attribution="hello" >
                  <Popup
                    minWidth={200}
                    closeButton={false}
                    onClose={popup => console.warn('popup-close', popup)}
                    >
                    <div>
                      <b>Hello world2!</b>
                      <p>stuff</p>
                    </div>
                  </Popup>

                </CircleLeaflet>

                {/* // <GeoJSON data={this.getGeoJSONNew()} style={this.getStyle(1, 2)} /> */}
                <GeoJSON data={this.getGeoJSONNew()} style={this.style()} />
              </Maps>



            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <SimpleTabs handleAreaName={this.handleAreaName} areaName={this.state.areaName} areaType={this.state.areaType} dataGottenBackFromAPI={this.state.dataGottenBackFromAPI} />
            </Grid>

          </Grid>
        </Grid>
      );
    }
  }

  export default App;
