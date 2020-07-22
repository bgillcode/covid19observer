import React from "react";
import L from "leaflet";

const style = {
  // width: "100%",
  height: "75vh",
  flex: 1
};

class Map extends React.Component {
  state = {
    center: [54.7023545, -3.2765753],
    locationStart: this.props.locationStart,
  }


  componentDidMount() {
    // create map
    this.map = L.map("map", {
      center: this.state.center,
      zoom: 5,
      layers: [
        L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        })
      ]
    });

    // add layer
    this.layer = L.layerGroup().addTo(this.map);
    this.updateMarkers(this.props.markersData);
  }
  componentDidUpdate({ markersData, locationStart }) {
    // check if data has changed
    if (this.props.markersData !== markersData) {
      this.updateMarkers(this.props.markersData);
    }

    console.log('testing000');

    if (this.state.center !== locationStart) {
      console.log('not equal');
      console.log(this.props.locationStart);
      this.updateLocation(this.props.latOfArea, this.props.lonOfArea, this.props.locationStart);
    }
  }

  updateMarkers(markersData) {
    this.layer.clearLayers();
    markersData.forEach(marker => {
      L.marker(marker.latLng, { title: marker.title }).addTo(this.layer);
    });
  }

  updateLocation(latOfArea, lonOfArea, locationStart) {
    let valueOfZoom = 6
    this.layer.clearLayers();
    console.log(this.props.locationStart);
    if (this.props.locationStart) {

      // Change the zoom out if it's for the United Kingdom, otherwise the zoom will be more zoomed in if selecting a region
      if (this.props.locationStart.includes("United Kingdom")) {
        valueOfZoom = 5
      }
    }
    console.log(valueOfZoom);
    this.map.setView([latOfArea, lonOfArea], valueOfZoom);
  }

  render() {
    return <div id="map" style={style} />;
  }
}

export default Map;
