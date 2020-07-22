import React from 'react';
import { render } from 'react-dom';
import Map from './mapthis';
import { DropdownList } from 'react';

class MappedClassOf extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      markersData: [
        {
          title: 1,
          latLng: {
            lat: 49.8419,
            lng: 24.0315,
          }
        },         {
          title: 2,
          latLng: {
            lat: 49.8420,
            lng: 24.0316,
          }
        }
      ],
      selectedCode: '',
      selectedLanguage: 3,
      areaName: props.areaName,

    };
  }

  handleLangChange = () => {
      var lang = 'test';
      this.props.onSelectLanguage(lang);
      console.log('done');
  }

  addMarker = () => {
    const { markersData } = this.state;
    const lastMarker = markersData[markersData.length - 1];

    this.setState({
      markersData: [
        ...markersData,
        {
          title: +lastMarker.title + 1,
          latLng: {
            lat: lastMarker.latLng.lat + 0.0001,
            lng: lastMarker.latLng.lng + 0.0001,
          }
        }
      ]
    });
    console.log(markersData);
    this.handleLangChange();
  };


  render() {
    const { markersData, areaName } = this.state;

    let latOfArea = "";
    let lonOfArea = "";

    if (this.props.dataGottenBackFromAPI[0]) {
      latOfArea = this.props.dataGottenBackFromAPI[0].lat;
      lonOfArea = this.props.dataGottenBackFromAPI[0].lon;
  }

    console.log(this);
    return (
      <div>
      <Map className="mappedOfClass" markersData={markersData} locationStart={this.props.areaName} latOfArea={latOfArea} lonOfArea={lonOfArea} />

      <button onClick={this.props.onSelectLanguage}>
      Testingofbutton
      </button>
      </div>
    );
  }
}

export default MappedClassOf;
