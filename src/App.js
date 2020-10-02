import React, { useState, useEffect } from 'react';
import { Component } from "react";
import './App.css';
import LineChart from "./chartsToDisplay.js";
import LineChartForecasting from "./chartsToDisplayForecasting.js";
import { Grid } from "@material-ui/core";
import Header from "./header.js";
import Footer from "./footer.js";
import SimpleTabs from './tabsToDisplay';
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
import { Paper } from '@material-ui/core';



import Choropleth from 'react-leaflet-choropleth'

import TextField from '@material-ui/core/TextField';

import axios from 'axios';

import L from "leaflet";

import CountriesNew from "./countries"

import RegionsBoundaries from "./regions"

export const pointerIcon = new L.Icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
  iconRetinaUrl: '../assets/pointerIcon.svg',
  iconAnchor: [5, 55],
  popupAnchor: [10, -44],
  iconSize: [10, 15],
  shadowUrl: '../assets/marker-shadow.png',
  shadowSize: [15, 20],
  shadowAnchor: [25, 30],
})

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
      dataForSearchUTLA: ['Barking and Dagenham', 'Barnet', 'Barnsley', 'Bath and North East Somerset', 'Bedford', 'Bexley', 'Birmingham', 'Blackburn with Darwen', 'Blackpool', 'Blaenau Gwent', 'Bolton', 'Bournemouth, Christchurch and Poole', 'Bracknell Forest', 'Bradford', 'Brent', 'Bridgend', 'Brighton and Hove', 'Bristol, City of', 'Bromley', 'Buckinghamshire', 'Bury', 'Caerphilly', 'Calderdale', 'Cambridgeshire', 'Camden', 'Cardiff', 'Carmarthenshire', 'Central Bedfordshire', 'Ceredigion', 'Cheshire East', 'Cheshire West and Chester', 'Conwy', 'Cornwall and Isles of Scilly', 'County Durham', 'Coventry', 'Croydon', 'Cumbria', 'Darlington', 'Denbighshire', 'Derby', 'Derbyshire', 'Devon', 'Doncaster', 'Dorset', 'Dudley', 'Ealing', 'East Riding of Yorkshire', 'East Sussex', 'Enfield', 'Essex', 'Flintshire', 'Gateshead', 'Gloucestershire', 'Greenwich', 'Gwynedd', 'Hackney and City of London', 'Halton', 'Hammersmith and Fulham', 'Hampshire', 'Haringey', 'Harrow', 'Hartlepool', 'Havering', 'Herefordshire, County of', 'Hertfordshire', 'Hillingdon', 'Hounslow', 'Isle of Anglesey', 'Isle of Wight', 'Islington', 'Kensington and Chelsea', 'Kent', 'Kingston upon Hull, City of', 'Kingston upon Thames', 'Kirklees', 'Knowsley', 'Lambeth', 'Lancashire', 'Leeds', 'Leicester', 'Leicestershire', 'Lewisham', 'Lincolnshire', 'Liverpool', 'Luton', 'Manchester', 'Medway', 'Merthyr Tydfil', 'Merton', 'Middlesbrough', 'Milton Keynes', 'Monmouthshire', 'Neath Port Talbot', 'Newcastle upon Tyne', 'Newham', 'Newport', 'Norfolk', 'North East Lincolnshire', 'North Lincolnshire', 'North Somerset', 'North Tyneside', 'North Yorkshire', 'Northamptonshire', 'Northumberland', 'Nottingham', 'Nottinghamshire', 'Oldham', 'Oxfordshire', 'Pembrokeshire', 'Peterborough', 'Plymouth', 'Portsmouth', 'Powys', 'Reading', 'Redbridge', 'Redcar and Cleveland', 'Rhondda Cynon Taf', 'Richmond upon Thames', 'Rochdale', 'Rotherham', 'Rutland', 'Salford', 'Sandwell', 'Sefton', 'Sheffield', 'Shropshire', 'Slough', 'Solihull', 'Somerset', 'South Gloucestershire', 'South Tyneside', 'Southampton', 'Southend-on-Sea', 'Southwark', 'St. Helens', 'Staffordshire', 'Stockport', 'Stockton-on-Tees', 'Stoke-on-Trent', 'Suffolk', 'Sunderland', 'Surrey', 'Sutton', 'Swansea', 'Swindon', 'Tameside', 'Telford and Wrekin', 'Thurrock', 'Torbay', 'Torfaen', 'Tower Hamlets', 'Trafford', 'Vale of Glamorgan', 'Wakefield', 'Walsall', 'Waltham Forest', 'Wandsworth', 'Warrington', 'Warwickshire', 'West Berkshire', 'West Sussex', 'Westminster', 'Wigan', 'Wiltshire', 'Windsor and Maidenhead', 'Wirral', 'Wokingham', 'Wolverhampton', 'Worcestershire', 'Wrexham', 'York'],
      dataGottenBackFromAPI: [],
      chosenFromDropdownArray: 10,

      dataGottenBackPlaces: [],

      latOfArea: "54.7023545",
      lonOfArea: "-3.2765753",
      valueOfZoom: 5,
      dataForMapGotten: [],
      dataForMapGottenNation: [],
      dataForMapGottenRegion: [],
      loadedBorderInfo: 0,
      gottenCollatedRegionInformation: [[[51.505, 1.45], 5, 'test']],

      schoolsInformation: [],

      showSchoolsOnMap: false,


      areaDetailsForOverview: [{data: {Male: 0}}],
    }

    this.geojson = L.geoJson();
    this.geojson2 = L.geoJson();

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
    // console.log(this.state.valueOfZoom);
    return CountriesNew;
  }


  getGeoJSONNewRegions() {
    return RegionsBoundaries;

    // return RegionsBoundaries;
    // console.log(CountriesNew);

    // console.log();
  }

  getGeoJSONAppear() {
    if (this.state.valueOfZoom <= 6) {
      this.geojson.clearLayers();
        console.log('stateboundariesloaded');
      return(
      <GeoJSON data={this.getGeoJSONNew()} style={this.style} key={4} onEachFeature={this.onEachFeature.bind(this)} ref="geojson">

      </GeoJSON>
    )

  } else {
    console.log('regionsboundariesloaded');
    return(
    <GeoJSON data={this.getGeoJSONNewRegions()} style={this.style} key={5} onEachFeature={this.onEachFeature.bind(this)} ref="geojson">
    </GeoJSON>
  )
  }

  }

  getColor(d) {
    console.log(d);
    if (this.state.valueOfZoom <= 6) {
    return d > 200000 ? '#800026' :
    d > 18000  ? '#FD8D3C' :
    d > 17000  ? '#FEB24C' :
    d > 5000  ? '#99cc99' :
    d > 50   ? '#FEECBB' :
    d > 20   ? '#FEF7E3' :
    d > 10   ? '#E3EAFE' :
    '#99cc99';
  } else if (this.state.valueOfZoom > 6 && this.state.valueOfZoom < 8) {
    console.log(d);
    return d > 50000 ? '#800026' :
    d > 40000  ? '#FD8D3C' :
    d > 30000  ? '#FEB24C' :
    d > 20000  ? '#99cc99' :
    d > 10000   ? '#FEECBB' :
    d > 5000   ? '#FEF7E3' :
    d > 50   ? '#E3EAFE' :
    '#99cc99';
    }
  }

  style(feature) {
    var gottenFeature = ''
    var gottenFeatureNumber = 0

    if (this.state.valueOfZoom <= 6) {


    // console.log(feature);
    // console.log(this.state.dataForMapGottenNation.length);
    if (this.state.dataForMapGottenNation.length > 0) {
      // console.log(this.state.dataForMapGottenNation[0]);
      // console.log(this.state.dataForMapGottenNation[0].data);
      for (let dataFromStateArray of this.state.dataForMapGottenNation[0].data) {
        // console.log(dataFromStateArray);
        if (dataFromStateArray.areaName == feature.properties.ctry19nm) {
          gottenFeature = dataFromStateArray.areaName
          gottenFeatureNumber = dataFromStateArray.cumCasesByPublishDate
          // console.log(gottenFeature + ":: " + gottenFeatureNumber);
          break;
        }
      }
    }
  } else if (this.state.valueOfZoom > 6 && this.state.valueOfZoom < 8) {
    // console.log("into style for region");
    //
    // console.log(this.state);

    if (this.state.dataForMapGottenRegion.length > 0) {
      console.log(this.state.dataForMapGottenRegion);
      // console.log(this.state.dataForMapGottenNation[0]);
      // console.log(this.state.dataForMapGottenNation[0].data);
      for (let dataFromStateRegion of this.state.dataForMapGottenRegion[0].data) {
        console.log(dataFromStateRegion);
        if (dataFromStateRegion.areaName == feature.properties.rgn19nm) {
          gottenFeature = dataFromStateRegion.areaName
          gottenFeatureNumber = dataFromStateRegion.cumCasesBySpecimenDate
          // console.log(gottenFeature + ":: " + gottenFeatureNumber);
          break;
        }
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
    if (this.state.dataForMapGottenNation.length > 0) {
      for (let dataFromStateArray of this.state.dataForMapGottenNation[0].data) {
        if (dataFromStateArray.areaName == feature.properties.ctry19nm) {
          gottenFeature = dataFromStateArray.areaName
          gottenFeatureNumber = dataFromStateArray.cumCasesByPublishDate
          break;
        }
      }
    }

    return gottenFeatureNumber
  }




  highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }


    var gottenFeature = ''
    var gottenFeatureNumber = 0

    if (this.state.valueOfZoom <= 6) {

      if (this.state.dataForMapGottenNation.length > 0) {
        for (let dataFromStateArray of this.state.dataForMapGottenNation[0].data) {
          if (dataFromStateArray.areaName == layer.feature.properties.ctry19nm) {
            gottenFeature = dataFromStateArray.areaName
            gottenFeatureNumber = dataFromStateArray.cumCasesByPublishDate
            break;
          }
        }
      }

    }


      else if (this.state.valueOfZoom > 6 && this.state.valueOfZoom < 8) {
        for (let dataFromRegionArray of this.state.dataForMapGottenRegion[0].data) {
          // console.log(dataFromRegionArray);
          if (dataFromRegionArray.areaName == layer.feature.properties.rgn19nm) {
            gottenFeature = dataFromRegionArray.areaName
            gottenFeatureNumber = dataFromRegionArray.cumCasesBySpecimenDate
            break;
          }
        }
      }







    layer.bindPopup(gottenFeature + ": " + gottenFeatureNumber);
    // e.openPopup();
    layer.openPopup();
  }


  resetHighlight(e) {
    var feature = e.target.feature;
    var gottenFeature = ''
    var gottenFeatureNumber = 0
    // console.log(feature);
    // console.log(this.state.dataForMapGottenNation.length);

    if (this.state.valueOfZoom < 6) {

    if (this.state.dataForMapGottenNation.length > 0) {
      // console.log(this.state.dataForMapGottenNation[0]);
      // console.log(this.state.dataForMapGottenNation[0].data);
      for (let dataFromStateArray of this.state.dataForMapGottenNation[0].data) {
        // console.log(dataFromStateArray);
        if (dataFromStateArray.areaName == feature.properties.ctry19nm) {
          gottenFeature = dataFromStateArray.areaName
          gottenFeatureNumber = dataFromStateArray.cumCasesByPublishDate
          break;
        }
      }
    }
  }


      else if (this.state.valueOfZoom > 6 && this.state.valueOfZoom < 8) {

    if (this.state.dataForMapGottenRegion.length > 0) {
      for (let dataFromRegionArray of this.state.dataForMapGottenRegion[0].data) {
        // console.log(dataFromRegionArray);
        if (dataFromRegionArray.areaName == feature.properties.rgn19nm) {
          gottenFeature = dataFromRegionArray.areaName
          gottenFeatureNumber = dataFromRegionArray.cumCasesBySpecimenDate
          break;
        }
      }
    }
  }

  console.log(gottenFeatureNumber);
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

    this.clickedPlace(e);
    // Maps.fitBounds(e.target.getBounds());
    // this.refs.leafletElement.map.
  }



  createClusterCustomIcon(cluster) {
    var markers = cluster.getAllChildMarkers();
    var n = 0;
    // console.log(markers);
    for (var i = 0; i < markers.length; i++) {
      // Adds the number passed to it in the props (params)
      n += markers[i].options.number;
    }
    return L.divIcon({ html: n, className: 'mycluster', iconSize: L.point(40, 40) });
  }


  createClusterCustomIcon2(cluster) {
    var markers = cluster.getAllChildMarkers();
    var n = 0;
    // console.log(markers);
    // for (var i = 0; i < markers.length; i++) {
    //   // Adds the number passed to it in the props (params)
    //   n += markers[i].number;
    // }
    return L.divIcon({ html: markers.length, className: 'mycluster2', iconSize: L.point(32, 32) });
  }

  // getGeoJSONNewCountiesLower() {
  //   // console.log(CountriesNew);
  //   return CountiesLower;
  //   // console.log();
  // }

  handleAreaName = (langValue) => {
    // console.log('handleAreaName');
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
    // console.log(event.target.value);

    // Limit to 20 characters in the search box
    this.setState({
      search: event.target.value.substr(0, 20)
    })

  }

  checkBoundaryDisplayType() {
    if (this.state.areaType == 'overview' || this.state.areaType == 'nation') {
      return 'United Kingdom and Nations view'
    } else if (this.state.areaType == 'region') {
      return 'Regions view'
    }
  }

  updateMapBorders() {
    this.setState({
      loadedBorderInfo: 1
    });
    // console.log(this.state.dataForMapGottenNation);
  }

  showOnMap() {
    this.loadPointsOnMap();
    // console.log(this.state.dataForMapGottenRegion);
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
    // gottenPlaceTarget.innerHTML;
    let gottenPlaceTarget = ""
    console.log(event);
    if (event.sourceTarget != null) {
      gottenPlaceTarget = event.sourceTarget.feature.properties.ctry19nm
    } else if (event.currentTarget) {
      gottenPlaceTarget = event.currentTarget.innerHTML;
      console.log(gottenPlaceTarget);
    }

    console.log(gottenPlaceTarget);


    const urlToData = 'https://nominatim.openstreetmap.org/search?q=' + gottenPlaceTarget + ',%20United%20Kingdom';
    // Need to give the format of it too
    const formatForDataOutput = '&format=json';

    // console.log(urlToData);

    fetch(urlToData + formatForDataOutput).then(res => res.json()).then(data => {

      this.setState({
        dataGottenBackFromAPI: [],
      }, () => {
        // console.log("cleared");
      })


      var joined = this.state.dataGottenBackFromAPI.concat(data[0]);

      // console.log(joined);

      let valueOfZoom = 6;

      if (joined[0].lat && joined[0].lon) {
        // Change the zoom out if it's for the United Kingdom, otherwise the zoom will be more zoomed in if selecting a region
        if (gottenPlaceTarget.includes("United Kingdom")) {
          valueOfZoom = 5;
        }

        var areatypegiven = 'nation';

        // if (this.state.dataForSearch.some(dataSearching => input.toLowerCase().includes )) (words.some(word => input.toLowerCase().includes(word.toLowerCase()));

        if (gottenPlaceTarget.trim().includes('United Kingdom')) {
          // console.log("first");
          areatypegiven = 'overview'
        } else if (this.state.dataForSearch.includes(gottenPlaceTarget.trim())) {
          // console.log("nation");
          areatypegiven = 'nation'
          valueOfZoom = 5
        } else if (this.state.dataForSearchRegion.includes(gottenPlaceTarget.trim())) {
          // console.log("region");
          areatypegiven = 'region'
          valueOfZoom = 7

        } else if (this.state.dataForSearchUTLA.includes(gottenPlaceTarget.trim())) {
          // console.log("region");
          areatypegiven = 'utla'
          valueOfZoom = 7

        }

        // console.log(this.state.areaName.trim());

        // console.log(this.state.dataForSearchRegion);
        // console.log(gottenPlaceTarget.trim());

        if (this.state.dataForSearchRegion.includes('North East')) {
          // console.log(128391203812);
        }

        // console.log(gottenPlaceTarget);

        // console.log(areatypegiven);

        this.setState({
          dataGottenBackFromAPI: joined,
          latOfArea: joined[0].lat,
          lonOfArea: joined[0].lon,
          valueOfZoom: valueOfZoom,
          areaName: gottenPlaceTarget,
          areaType: areatypegiven
        }, () => {
          // console.log(this.state);
          this.getGeoJSONAppear();
        })

        // console.log(this.state.areaName.trim());

      }



    });

    this.getPopulationDetails();
    // console.log(this);
  }



  clickedSchoolSelectionText(event) {
    const gottenPlaceTarget = event.currentTarget.innerHTML;
    // const gottenPlaceTargetInner = gottenPlaceTarget.innerHTML;
    // console.log(gottenPlaceTarget);

    var gottenSelection = this.state.showSchoolsOnMap;
    // console.log(gottenSelection);

    if (gottenSelection == false) {
      this.setState({
        showSchoolsOnMap: true
      });
    } else if (gottenSelection == true) {
        this.setState({
          showSchoolsOnMap: false
        });
    }

    // console.log(this.state.showSchoolsOnMap);
  }


  loadPointsOnMap() {
    return;
  }

  getDate() {
    var dateGottenForUpdate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    return dateGottenForUpdate;
  }


  chosenFromDropdown(event) {
    // console.log(event);
    this.setState({
      chosenFromDropdownArray: event.target.value
    })

  };

  handleChange(event) {
    const name = event.target.value;
    // console.log(name);
    this.setState({
      chosenFromDropdownArray: name,
    });
    console.log(this);
  };

  onEachFeature(feature, layer) {
    // console.log(f);
    // console.log(feature);
    layer.on({
      mouseover: this.highlightFeature.bind(this),
      mouseout: this.resetHighlight.bind(this),
      click: this.zoomToFeature.bind(this)
    });




    // layer.bindPopup("Cumulative Daily Cases: " + gottenFeature + ": " + gottenFeatureNumber);
  }

  getPopulationDetails() {
    var areatypegiven = ""
    // console.log(this.state.areaName);
    if (this.state.areaName == 'United Kingdom') {
      areatypegiven = 'overview'
    } else if (this.state.areaName.includes(this.state.dataForSearch)) {
      areatypegiven = 'nation'
    } else if (this.state.areaName.includes(this.state.dataForSearchRegion)) {
      areatypegiven = 'region'
    }
    // console.log(areatypegiven);
    var getURL = 'http://localhost:5000/apic/getdetailsofarea?areanamegiven=' + this.state.areaName.trim();
    var getURL = 'http://localhost:5000/apic/getdetailsofarea?areanamegiven=' + this.state.areaName.trim();
    // console.log(getURL);
    fetch(getURL).then(res => res.json()).then(data => {
      var qcget = data
      // console.log(qcget);
      var mss = []
      mss.push(qcget)
      return mss
    }).then(


      mss => {
      if (mss) {


      this.setState({
        areaDetailsForOverview: mss,
      })
      // console.log(mss);
      // console.log(this.state.areaDetailsForOverview);
    } else {
      console.log("area not available yet");
    }

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



    // console.log(urlGotten);

    fetch(urlGotten).then(res => res.json()).then(data => {
      var joined = this.state.dataGottenBackPlaces.concat(data)
      // console.log(data);

    }).then( joined => {
      this.setState({
        dataForMapGotten: joined,
      })
    });


    var urlGotten2 = 'http://localhost:5000/apic/getoverview?areatype=' + 'nation'

    fetch(urlGotten2).then(res => res.json()).then(data => {
      var joined = this.state.dataForMapGottenNation.concat(data)
      // console.log(data.data);
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
        // console.log(a);
      })
      // console.log(data);
      var joined = this.state.dataForMapGottenRegion.concat(data)
      // console.log(data.data);
      return joined;
    }).then( joined => {
      this.setState({
        dataForMapGottenRegion: joined,
      })
    }).then( () => {
      this.updateMapBorders();
    })


    this.getPopulationDetails();




    var urlGotten5 = 'http://localhost:5000/apic/getschoolsdata'

    fetch(urlGotten5).then(res => res.json()).then(data => {
      if (data.data.latitude !== null && data.data.longitude !== null && data.data.latitude !== isNaN() && data.data.longitude !== isNaN()) {
        var joined = this.state.schoolsInformation.concat(data)
        return joined;
      }

    }).then( joined => {
      this.setState({
        schoolsInformation: joined,
      })
    }).then( () => {
      this.showSchools();
    })


  }

  checkIfSchoolsTextHasBeenSelected() {
    if (this.state.showSchoolsOnMap == false) {
      // console.log(this.state.showSchoolsOnMap);
      return "View schools on the map";
    }
    else if (this.state.showSchoolsOnMap == true) {
      // console.log(this.state.showSchoolsOnMap);
      return "Hide schools on the map";
    }
  }


  renderMarkers = () => {
    if (this.state.schoolsInformation.length) {
    return this.state.schoolsInformation[0].data.map(
        (marker) => {
          if (marker.latitude !== null && marker.latitude !== isNaN()) {
            return <Marker key={`${marker.URN}`} position={[parseFloat(marker.latitude), parseFloat(marker.longitude)]} icon={pointerIcon} > <Popup
               minWidth={200}
               closeButton={false}
               onClose={popup => console.warn('popup-close', popup)}
               >
               <div>
                 <b>School name: {marker.SCHNAME}</b>
                 <p>School status: {marker.SCHSTATUS}</p>
               </div>
             </Popup></Marker>
        }
      }
    )
}
}



  showSchools() {
    // return
  }



  render() {

    let filteredSearchPlaces = this.state.dataForSearch.concat(this.state.dataForSearchRegion).concat(this.state.dataForSearchUTLA).filter(
      (place) => {
        return place.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
      }
    );

    function handleLangChange(e) {
      var lang = e.target.value;
      // console.log('done');
    }

    const position = [this.state.lat, this.state.lng]



    return (

      <Grid container direction="column">
        <Grid item>
          <Header />
        </Grid>
        <Grid item container>
          <Grid item xs={3} sm={3} md={2}>
            <div>
              <div id="last-updated-on">
                <p>
                  {/*Last updated on: {this.getDate()}*/}
                </p>
                </div>
              {this.displayTextBox()}
              <Paper style={{maxHeight: 600, overflow: 'auto'}}>
              {filteredSearchPlaces.map((place, i)=> {
                if (place == 'United Kingdom') {
                  return <li style={{cursor: 'pointer'}} onClick={this.clickedPlace.bind(this)} key={i}> {place} </li>;
                }
                return <li style={{cursor: 'pointer'}} onClick={this.clickedPlace.bind(this)} key={i}> {place} </li>;
                })}
                </Paper>
              </div>




            </Grid>
            {/* Map */}
            <Grid item xs={9} sm={3} md={4}>


              <div>
                <div id='currently-selected-label-above-map'>
                  <p>Currently displaying on the map: {this.state.areaName}
                    </p>
                </div>
                <FormControl>
                  <InputLabel htmlFor="age-native-simple">Currently Displaying on the map:</InputLabel>
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

              Display: {this.checkBoundaryDisplayType()}

              <Maps className="markercluster-map" center={[this.state.latOfArea, this.state.lonOfArea]} zoom={this.state.valueOfZoom} maxZoom={18} ref={this.myMapRef}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />









                {this.state.showSchoolsOnMap == true ?
                <MarkerClusterGroup iconCreateFunction={this.createClusterCustomIcon2}>
                  {this.renderMarkers()}
                </MarkerClusterGroup> :

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
              }






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

                  {this.getGeoJSONAppear()}






                </Maps>

                <div>
                  <span onClick={this.clickedSchoolSelectionText.bind(this)} style={{cursor: 'pointer'}} id="schoolSelectionText">{this.checkIfSchoolsTextHasBeenSelected()}</span>
                </div>



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
