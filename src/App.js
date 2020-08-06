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

// // Import counties boundaries for the UK
// import CountiesLower from "./countieslower"

// const useStylesTextField = makeStyles((theme) => ({
//   root: {
//     '& > *': {
//       margin: theme.spacing(1),
//       width: '25ch',
//     },
//   },
// }));

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
      gottenCollatedRegionInformation: [[[51.505, 1.45], 5, 'test']],


      areaDetailsForOverview: [{data: {Male: 0}}],
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

//   addMarker = (e) => {
//   const {markers} = this.state
//   markers.push(e.latlng)
//   this.setState({markers})
// }

  getGeoJSONNew() {
    // console.log(CountriesNew);
    return CountriesNew;
    // console.log();
  }

  getColor(d) {
    console.log(d);
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

      // <input placeholder="Search" type="text"
      //   value={this.state.search}
      //   onChange={this.updateSearch.bind(this)} />

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

    this.getPopulationDetails();

    // event.preventDefault();
    console.log(this);
  }


  loadPointsOnMap() {
    return;
    // Set state at the beginning
    // this.setState({
    //   gottenCollatedRegionInformation: [51.505, 1.45, 5, 'test']
    // }, () => {
    //   console.log(this.state);
    // })
    //
    // this.state.dataForMapGottenRegion.forEach({
    //
    // })
    //
    // this.state.dataForMapGottenRegion.map((areaName) => {
    //   // console.log(a);
    // } )
  }



  //   {this.state.dataForMapGottenRegion[0].map((areaType, areaName, areaCode, date, newCasesBySpecimenDate, cumCasesBySpecimenDate, lat, long) =>
  //     var q = [lat, long]
  //     <Marker position={lat}, {long} number={ newCasesBySpecimenDate }>
  //       <Popup>
  //         <span>A pretty CSS3 popup. <br/> Easily customizable.</span>
  //       </Popup>
  //     </Marker>
  //   )}
  //
  // }

        // this.setState({
        //   dataGottenBackFromAPI: [],
        // }, () => {
        //   console.log("cleared");
        // })


        // joined = data[0];
      // })
    //
    //     console.log(joined)
    //
    //     // let valueOfZoom = 6;
    //
    //     if (joined[0].lat && joined[0].lon) {
    //       // Change the zoom out if it's for the United Kingdom, otherwise the zoom will be more zoomed in if selecting a region
    //       // if (gottenPlaceTarget.includes("United Kingdom")) {
    //       //   valueOfZoom = 5;
    //       // }
    //
    //
    //       var gottenCollatedRegionInformationvar = this.state.gottenCollatedRegionInformation;
    //
    //
    //       // thisCoordinatesOfThis = [joined[0].lat, joined[0].lon]
    //       // thisAreaNameOfThis = region.areaName
    //       // thisRegionOfThis = region.cumCasesBySpecimenDate
    //
    //       var newArrayOfThisNow = [[joined[0].lat, joined[0].lon], region.areaName, region.cumCasesBySpecimenDate]
    //
    //
    //       var macv = gottenCollatedRegionInformationvar.concat(newArrayOfThisNow)
    //
    //
    //       gottenCollatedRegionInformationvar = gottenCollatedRegionInformationvar.push(macv)
    //
    //       this.setState({
    //         gottenCollatedRegionInformation: gottenCollatedRegionInformationvar
    //       }, () => {
    //         console.log(this.state);
    //       })
    //
    //     }
    //
    //
    // })
    // // const urlToData = 'https://nominatim.openstreetmap.org/search?q=' + gottenPlaceTarget + ',%20United%20Kingdom';
    // // // Need to give the format of it too
    // // const formatForDataOutput = '&format=json';

  // }


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




    // layer.bindPopup("Cumulative Daily Cases: " + gottenFeature + ": " + gottenFeatureNumber);
  }

  getPopulationDetails() {
    var areatypegiven = ""
    console.log(this.state.areaName);
    if (this.state.areaName == 'United Kingdom') {
      areatypegiven = 'overview'
    } else {
      areatypegiven = 'nation'
    }
    console.log(areatypegiven);
    fetch('http://localhost:5000/apic/getdetailsofarea?areanamegiven=' + this.state.areaName + '&areatypegiven=' + areatypegiven).then(res => res.json()).then(data => {
      var qcget = data
      console.log(qcget);
      var mss = []
      mss.push(qcget)
      return mss
    }).then( mss => {
      this.setState({
        areaDetailsForOverview: mss,
      })
      console.log(mss);
      console.log(this.state.areaDetailsForOverview);
    })

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


    this.getPopulationDetails();




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

              Display:
              <Maps className="markercluster-map" center={[this.state.latOfArea, this.state.lonOfArea]} zoom={this.state.valueOfZoom} maxZoom={18} ref={this.myMapRef}>
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

                    <Marker position={[55.2970314, -1.72889996]} number={35284}>
                      <Popup
                        minWidth={200}
                        closeButton={false}
                        onClose={popup => console.warn('popup-close', popup)}
                        >
                        <div>
                          <b>Location: North East</b>
                          <p>Count: {35284}</p>
                        </div>
                      </Popup>
                    </Marker>



                    <Marker position={[54.44945145, -2.7723701]} number={45684}>
                      <Popup
                        minWidth={200}
                        closeButton={false}
                        onClose={popup => console.warn('popup-close', popup)}
                        >
                        <div>
                          <b>Location: North West</b>
                          <p>Count: {45684}</p>
                        </div>
                      </Popup>
                    </Marker>



                    <Marker position={[51.4509697, -0.99311]} number={35284}>
                      <Popup
                        minWidth={200}
                        closeButton={false}
                        onClose={popup => console.warn('popup-close', popup)}
                        >
                        <div>
                          <b>Location: South East</b>
                          <p>Count: {35284}</p>
                        </div>
                      </Popup>
                    </Marker>


                    <Marker position={[52.79571915, -0.84966999]} number={23252}>
                      <Popup
                        minWidth={200}
                        closeButton={false}
                        onClose={popup => console.warn('popup-close', popup)}
                        >
                        <div>
                          <b>Location: East Midlands</b>
                          <p>Count: {23252}</p>
                        </div>
                      </Popup>
                    </Marker>


                    <Marker position={[59.3023545, -3.2765753]} number={31728}>
                      <Popup
                        minWidth={200}
                        closeButton={false}
                        onClose={popup => console.warn('popup-close', popup)}
                        >
                        <div>
                          <b>Location: Yorkshire and The Humber</b>
                          <p>Count: {31728}</p>
                        </div>
                      </Popup>
                    </Marker>


                    <Marker position={[52.55696869, -2.2035799]} number={26920}>
                      <Popup
                        minWidth={200}
                        closeButton={false}
                        onClose={popup => console.warn('popup-close', popup)}
                        >
                        <div>
                          <b>Location: West Midlands</b>
                          <p>Count: {26920}</p>
                        </div>
                      </Popup>
                    </Marker>


                    <Marker position={[55.2970314, -1.72889996]} number={15314}>
                      <Popup
                        minWidth={200}
                        closeButton={false}
                        onClose={popup => console.warn('popup-close', popup)}
                        >
                        <div>
                          <b>Location: North East</b>
                          <p>Count: {15314}</p>
                        </div>
                      </Popup>
                    </Marker>


                    <Marker position={[52.24066925, 0.50414598]} number={24641}>
                      <Popup
                        minWidth={200}
                        closeButton={false}
                        onClose={popup => console.warn('popup-close', popup)}
                        >
                        <div>
                          <b>Location: East of England</b>
                          <p>Count: {4}</p>
                        </div>
                      </Popup>
                    </Marker>


                    <Marker position={[50.81119156, -3.63343]} number={13193}>
                      <Popup
                        minWidth={200}
                        closeButton={false}
                        onClose={popup => console.warn('popup-close', popup)}
                        >
                        <div>
                          <b>Location: South West</b>
                          <p>Count: {13193}</p>
                        </div>
                      </Popup>
                    </Marker>




                  </MarkerClusterGroup>

                  <Marker position={[55.2970314, -1.72889996]} number={35284}>
                    <Popup
                      minWidth={200}
                      closeButton={false}
                      onClose={popup => console.warn('popup-close', popup)}
                      >
                      <div>
                        <b>Location: North East</b>
                        <p>Count: {35284}</p>
                      </div>
                    </Popup>
                  </Marker>


                  {/* // <GeoJSON data={this.getGeoJSONNew()} style={this.getStyle(1, 2)} /> */}
                  <GeoJSON data={this.getGeoJSONNew()} style={this.style} onEachFeature={this.onEachFeature.bind(this)} ref="geojson">

                  </GeoJSON>



                </Maps>



              </Grid>
              <Grid item xs={12} sm={6} md={6}>

                <SimpleTabs handleAreaName={this.handleAreaName} areaName={this.state.areaName} areaType={this.state.areaType} areaDetailsForOverview={this.state.areaDetailsForOverview} dataGottenBackFromAPI={this.state.dataGottenBackFromAPI} />
              </Grid>

            </Grid>
            <Footer></Footer>
          </Grid>

        );
      }
    }

    export default App;
