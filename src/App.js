import React, { useState, useEffect } from 'react';
import { Component } from "react";
import './App.css';
import LineChart from "./myChartsThis.js";
import { Grid } from "@material-ui/core";
import Header from "./header.js";
import Footer from "./footer.js";
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

import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";

import Choropleth from 'react-leaflet-choropleth'

import TextField from '@material-ui/core/TextField';

import axios from 'axios';

import L from "leaflet";

// Import the countries boundaries for the UK
import CountriesNew from "./countries"

class App extends Component {

  constructor(props) {
    super(props)


    this.state = {
      language: '',
      areaName: 'United Kingdom',
      areaType: 'overview',
      search: '',
      dataForSearch: ['United Kingdom', 'England', 'Northern Ireland', 'Scotland', 'Wales'],
      dataForSearchRegion: ['East of England', 'East Midlands', 'London', 'North East', 'North West', 'South East', 'South West', 'West Midlands', 'Yorkshire and The Humber'],
      dataGottenBackFromAPI: [],
      chosenFromDropdownArray: 10,

      dataGottenBackPlaces: [],

      latOfArea: "54.7023545",
      lonOfArea: "-3.2765753",
      valueOfZoom: 5,
      dataForMapGotten: [],
      dataForMapGottenNation: [],
      dataForMapGottenRegion: ["region", "London", "E12000007", "2020-07-29T00:00:00.000+00:00", "0", "35231", "51.49227142", "-0.30864"],
      loadedBorderInfo: 0,
      gottenCollatedRegionInformation: [[[51.505, 1.45], 5, 'test']]
    }

    this.geojson = L.geoJson();

    this.getColor = this.getColor.bind(this);
    this.style = this.style.bind(this);

    this.gotNewNumber = this.gotNewNumber.bind(this);

    this.myMapRef = React.createRef();

  }

  handleLanguage = (langValue) => {
    this.setState({
      language: 'blah',
    });
  }


  getGeoJSONNew() {
    return CountriesNew;
  }

  getColor(d) {
    return d > 200000 ? '#800026' :
    d > 18000  ? '#FD8D3C' :
    d > 17000  ? '#FEB24C' :
    d > 5000  ? '#99cc99' :
    d > 50   ? '#FEECBB' :
    d > 20   ? '#FEF7E3' :
    d > 10   ? '#E3EAFE' :
    '#99cc99';
  }

  style(feature) {
    var gottenFeature = ''
    var gottenFeatureNumber = 0
    console.log(feature);
    console.log(this.state.dataForMapGottenNation.length);
    if (this.state.dataForMapGottenNation.length > 0) {
      console.log(this.state.dataForMapGottenNation[0]);
      console.log(this.state.dataForMapGottenNation[0].data);
      for (let dataFromStateArray of this.state.dataForMapGottenNation[0].data) {
        console.log(dataFromStateArray);
        if (dataFromStateArray.areaName == feature.properties.ctry19nm) {
          gottenFeature = dataFromStateArray.areaName
          gottenFeatureNumber = dataFromStateArray.cumCasesByPublishDate
          console.log(gottenFeature + ": " + gottenFeatureNumber);
          break;
        }
      }
    }

    return {
      fillColor: this.getColor(gottenFeatureNumber),
      weight: 3,
      opacity: 0.5,
      color: 'black',
      dashArray: '3',
      fillOpacity: 0.2
    };
  }


  gotNewNumber(feature) {
    var gottenFeature = ''
    var gottenFeatureNumber = 0
    console.log(feature);
    console.log(this.state.dataForMapGottenNation.length);
    if (this.state.dataForMapGottenNation.length > 0) {
      console.log(this.state.dataForMapGottenNation[0]);
      console.log(this.state.dataForMapGottenNation[0].data);
      for (let dataFromStateArray of this.state.dataForMapGottenNation[0].data) {
        console.log(dataFromStateArray);
        if (dataFromStateArray.areaName == feature.properties.ctry19nm) {
          gottenFeature = dataFromStateArray.areaName
          gottenFeatureNumber = dataFromStateArray.cumCasesByPublishDate
          console.log(gottenFeature + ": " + gottenFeatureNumber);
          break;
        }
      }
    }

    return gottenFeatureNumber
  }




  highlightFeature(e) {
    console.log(e);
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
      // layer.bindPopup("a");
    }


    var gottenFeature = ''
    var gottenFeatureNumber = 0
    console.log(layer);
    console.log(this.state.dataForMapGottenNation.length);
    console.log(this);
    if (this.state.dataForMapGottenNation.length > 0) {
      console.log(this.state.dataForMapGottenNation[0]);
      console.log(this.state.dataForMapGottenNation[0].data);
      for (let dataFromStateArray of this.state.dataForMapGottenNation[0].data) {
        console.log(dataFromStateArray);
        if (dataFromStateArray.areaName == layer.feature.properties.ctry19nm) {
          gottenFeature = dataFromStateArray.areaName
          gottenFeatureNumber = dataFromStateArray.cumCasesByPublishDate
          console.log(gottenFeature + ": " + gottenFeatureNumber);
          break;
        }
      }
    }



    layer.bindPopup(gottenFeature + ": " + gottenFeatureNumber);
    // e.openPopup();
    layer.openPopup();
  }

  resetHighlight(e) {
    console.log(this.geojson);
    // component
    console.log(e);

    var feature = e.target.feature;


    var gottenFeature = ''
    var gottenFeatureNumber = 0
    console.log(feature);
    console.log(this.state.dataForMapGottenNation.length);
    if (this.state.dataForMapGottenNation.length > 0) {
      console.log(this.state.dataForMapGottenNation[0]);
      console.log(this.state.dataForMapGottenNation[0].data);
      for (let dataFromStateArray of this.state.dataForMapGottenNation[0].data) {
        console.log(dataFromStateArray);
        if (dataFromStateArray.areaName == feature.properties.ctry19nm) {
          gottenFeature = dataFromStateArray.areaName
          gottenFeatureNumber = dataFromStateArray.cumCasesByPublishDate
          console.log(gottenFeature + ": " + gottenFeatureNumber);
          break;
        }
      }
    }

    e.target.setStyle({
      fillColor: this.getColor(gottenFeatureNumber),
      weight: 3,
      opacity: 0.5,
      color: 'black',
      dashArray: '3',
      fillOpacity: 0.2
    });

    e.target.closePopup();
  }

  zoomToFeature(e) {
    this.myMapRef.current.leafletElement.fitBounds(e.target.getBounds())
    // Maps.fitBounds(e.target.getBounds());
    // this.refs.leafletElement.map.
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

  updateMapBorders() {
    this.setState({
      loadedBorderInfo: 1
    });
    console.log(this.state.dataForMapGottenNation);
  }

  showOnMap() {
    this.loadPointsOnMap();
    console.log(this.state.dataForMapGottenRegion);
  }

  displayTextBox() {
    return (
      <TextField id="filled-search" value={this.state.search} onChange={this.updateSearch.bind(this)}  label="Search locations" type="search"

        InputProps={{
          endAdornment: (
            <InputAdornment>
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          )
        }}

        />

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


  loadPointsOnMap() {
    return;
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

  onEachFeature(feature, layer) {
    // console.log(f);
    console.log(feature);
    layer.on({
      mouseover: this.highlightFeature.bind(this),
      mouseout: this.resetHighlight.bind(this),
      click: this.zoomToFeature.bind(this)
    });


  }


  // Get the data and then run the update for the chart to be displayed for each one
  componentDidMount() {
    var baseURL = 'http://localhost:5000'
    var apiName = 'apic'
    var getRoute = 'getoverview'
    var getFieldForRoute1 = 'areatype'
    var getFieldForRoute2 = 'areanamegiven'
    var urlGotten = baseURL + '/' + apiName + '/' + getRoute + '?' + getFieldForRoute1 + '=' + this.state.areaType + '&' + getFieldForRoute2 + '=' + this.state.areaName

    console.log(urlGotten);

    fetch(urlGotten).then(res => res.json()).then(data => {
      var joined = this.state.dataGottenBackPlaces.concat(data)
      console.log(data);

    }).then( joined => {
      this.setState({
        dataForMapGotten: joined,
      })
    });


    var urlGotten2 = 'http://localhost:5000/apic/getoverview?areatype=' + 'nation'

    fetch(urlGotten2).then(res => res.json()).then(data => {
      var joined = this.state.dataForMapGottenNation.concat(data)
      console.log(data.data);
      return joined;
    }).then( joined => {
      this.setState({
        dataForMapGottenNation: joined,
      })
    }).then( () => {
      this.updateMapBorders();
    })


    var urlGotten3 = 'http://localhost:5000/apic/getoverview?areatype=' + 'region'

    fetch(urlGotten3).then(res => res.json()).then(data => {
      data.data.forEach((a) => {
        console.log(a);
      })
      console.log(data);
      var joined = this.state.dataForMapGottenRegion.concat(data)
      console.log(data.data);
      return joined;
    }).then( joined => {
      this.setState({
        dataForMapGottenRegion: joined,
      })
    }).then( () => {
      this.showOnMap();
    })


  }


  render() {
    let filteredSearchPlaces = this.state.dataForSearch.concat(this.state.dataForSearchRegion).filter(
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
              <div id="last-updated-on">
                <p>
                  Last updated on: "{Date}"
                </p>
                </div>
              {this.displayTextBox()}

              {filteredSearchPlaces.map((place, i)=> {
                return <li onClick={this.clickedPlace.bind(this)} key={i}> {place} </li>;
                })}
              </div>

              <div id='site-information'>
                <ul>
                <li>Site Information</li>
                <li>Accessibility</li>
                <li>Data sources</li>
                <li>Map information</li>
                <li>News and information</li>
                <li>COVID-19 Basics</li>
                <li>View Desktop / Mobile version</li>
                </ul>
                </div>

            </Grid>
            {/* Map */}
            <Grid item xs={10} sm={4} md={4}>


              <div>
                <div id='currently-selected-label-above-map'>
                  <p>Currently displaying: {this.state.areaName}
                    </p>
                </div>
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
              <Maps className="markercluster-map" center={[this.state.latOfArea, this.state.lonOfArea]} zoom={this.state.valueOfZoom} maxZoom={18} ref={this.myMapRef}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />


                  {/* // <GeoJSON data={this.getGeoJSONNew()} style={this.getStyle(1, 2)} /> */}
                  <GeoJSON data={this.getGeoJSONNew()} style={this.style} onEachFeature={this.onEachFeature.bind(this)} ref="geojson">

                  </GeoJSON>



                </Maps>



              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <SimpleTabs handleAreaName={this.handleAreaName} areaName={this.state.areaName} areaType={this.state.areaType} dataGottenBackFromAPI={this.state.dataGottenBackFromAPI} />
              </Grid>

            </Grid>
            <Footer></Footer>
          </Grid>

        );
      }
    }

    export default App;
