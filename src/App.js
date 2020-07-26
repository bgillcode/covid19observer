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

import L from "leaflet";

// Import the countries boundaries for the UK
import CountriesNew from "./countries"

// Import counties boundaries for the UK
import CountiesLower from "./countieslower"

class App extends Component {

  state = {
    language: '',
    areaName: 'United Kingdom',
    search: '',
    dataForSearch: ['United Kingdom', 'England', 'Northern Ireland', 'Scotland', 'Wales'],
    dataGottenBackFromAPI: [],
    chosenFromDropdownArray: 10,

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

  getGeoJSONNewCountiesLower() {
    // console.log(CountriesNew);
    return CountiesLower;
    // console.log();
  }

  handleAreaName = (langValue) => {
    console.log('handleAreaName');
    this.setState({
      areaName: langValue,
    });
  }

  getStyle(feature, layer) {
    console.log(feature);
  return {
    color: '#022450',
    weight: 2,
    opacity: 0.1
  }
}

getStuff() {
  return {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "LineString",
            "coordinates": [
              [
                -122.47979164123535,
                37.830124319877235
              ],
              [
                -122.47721672058105,
                37.809377088502615
              ]
            ]
          }
        },
      ]
  }
}

// function getGeoJson() {
// return {
//   "type": "FeatureCollection",
//   "features": [
//     {
//       "type": "Feature",
//       "properties": {},
//       "geometry": {
//         "type": "LineString",
//         "coordinates": [
//           [
//             -122.47979164123535,
//             37.830124319877235
//           ],
//           [
//             -122.47721672058105,
//             37.809377088502615
//           ]
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {},
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           -122.46923446655273,
//           37.80293476836673
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {},
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           -122.48399734497069,
//           37.83466623607849
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {},
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           -122.47867584228514,
//           37.81893781173967
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {},
//       "geometry": {
//         "type": "Polygon",
//         "coordinates": [
//           [
//             [
//               -122.48069286346434,
//               37.800637436707525
//             ],
//             [
//               -122.48069286346434,
//               37.803104310307276
//             ],
//             [
//               -122.47950196266174,
//               37.803104310307276
//             ],
//             [
//               -122.47950196266174,
//               37.800637436707525
//             ],
//             [
//               -122.48069286346434,
//               37.800637436707525
//             ]
//           ]
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {},
//       "geometry": {
//         "type": "Polygon",
//         "coordinates": [
//           [
//             [
//               -122.48103886842728,
//               37.833075326166274
//             ],
//             [
//               -122.48065531253813,
//               37.832558431940114
//             ],
//             [
//               -122.4799284338951,
//               37.8322660885204
//             ],
//             [
//               -122.47963070869446,
//               37.83231693093747
//             ],
//             [
//               -122.47948586940764,
//               37.832467339549524
//             ],
//             [
//               -122.47945636510849,
//               37.83273426112019
//             ],
//             [
//               -122.47959315776825,
//               37.83289737938241
//             ],
//             [
//               -122.48004108667372,
//               37.833109220743104
//             ],
//             [
//               -122.48058557510376,
//               37.83328293020496
//             ],
//             [
//               -122.48080283403395,
//               37.83332529830436
//             ],
//             [
//               -122.48091548681259,
//               37.83322785163939
//             ],
//             [
//               -122.48103886842728,
//               37.833075326166274
//             ]
//           ]
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {},
//       "geometry": {
//         "type": "Polygon",
//         "coordinates": [
//           [
//             [
//               -122.48043537139893,
//               37.82564992009924
//             ],
//             [
//               -122.48129367828368,
//               37.82629397920697
//             ],
//             [
//               -122.48240947723389,
//               37.82544653184479
//             ],
//             [
//               -122.48373985290527,
//               37.82632787689904
//             ],
//             [
//               -122.48425483703613,
//               37.82680244295304
//             ],
//             [
//               -122.48605728149415,
//               37.82639567223645
//             ],
//             [
//               -122.4898338317871,
//               37.82663295542695
//             ],
//             [
//               -122.4930953979492,
//               37.82415839321614
//             ],
//             [
//               -122.49700069427489,
//               37.821887146654376
//             ],
//             [
//               -122.4991464614868,
//               37.82171764783966
//             ],
//             [
//               -122.49850273132326,
//               37.81798857543524
//             ],
//             [
//               -122.50923156738281,
//               37.82090404811055
//             ],
//             [
//               -122.51232147216798,
//               37.823344820392535
//             ],
//             [
//               -122.50150680541992,
//               37.8271414168374
//             ],
//             [
//               -122.48743057250977,
//               37.83093781796035
//             ],
//             [
//               -122.48313903808594,
//               37.82822612280363
//             ],
//             [
//               -122.48043537139893,
//               37.82564992009924
//             ]
//           ]
//         ]
//       }
//     }
//   ]
// }
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
                      <b>Hello world2!</b>
                      <p>stuff</p>
                    </div>
                  </Popup>
                  </Marker>
                <Marker position={[59.3035545, -3.2746753]} number={5} />


                  <Marker position={[63.3023545, -3.2765753]} number={8} />
                  <Marker position={[63.355545, -3.2746753]} number={1000.23} />



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

                // <GeoJSON data={this.getGeoJSONNew()} style={this.getStyle(1, 2)} />
                <GeoJSON data={this.getGeoJSONNewCountiesLower()} style={this.getStyle()} />
              </Maps>

            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <SimpleTabs handleAreaName={this.handleAreaName} areaName={this.state.areaName} dataGottenBackFromAPI={this.state.dataGottenBackFromAPI} />
            </Grid>

          </Grid>
        </Grid>
      );
    }
  }

  export default App;
