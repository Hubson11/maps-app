import React from 'react';
import GoogleMapReact from 'google-map-react';
import supercluster from 'points-cluster';
import styled from 'styled-components';
import Marker from './Marker';
import ClusterMarker from './ClusterMarker';
import axios from 'axios';
import { FiltersCont } from './FiltersCont';

const MAP = {
  defaultZoom: 7,
  defaultCenter: [51.8, 18.6],
  options: {
    maxZoom: 19,
  },
};

export class SimpleMap extends React.PureComponent {
  state = {
    mapOptions: {
      center: MAP.defaultCenter,
      zoom: MAP.defaultZoom,
    },
    vehicleData: [],
    parkingData: [],
    poiData: [],
    carsClusters: [],
    trucksClusters: [],
    parkingClusters: [],
    poiClusters: [],
    selectedMarker: '',
    onlyAvailable: true,
    rangeFilter: '',
  };

  selectMarker = (name) => {
    this.setState({
      selectedMarker: name
    })
  }

  async componentDidMount(){
    await axios.all([
      axios.get('https://dev.vozilla.pl/api-client-portal/map?objectType=VEHICLE'),
      axios.get('https://dev.vozilla.pl/api-client-portal/map?objectType=PARKING'),
      axios.get('https://dev.vozilla.pl/api-client-portal/map?objectType=POI')
    ])
    .then(axios.spread((vehicleResp, parkingResp, poiResp) => {
      this.setState({
        vehicleData: vehicleResp.data.objects,
        parkingData: parkingResp.data.objects,
        poiData: poiResp.data.objects,
        loading: false,
      })
    }));
    this.createClusters()
  }

  getClusters = (type) => {
    const { vehicleData, mapOptions, parkingData, poiData, rangeFilter, onlyAvailable } = this.state;
    let clusterData = []
    if(type === 'parking'){
      clusterData = parkingData.filter(item => item.discriminator === type)
    } else if(type === 'poi') {
      clusterData = poiData.filter(item => item.discriminator === type)      
    } else {
      let filteredVehicle = vehicleData.filter(item => item.rangeKm >= rangeFilter)
      if(onlyAvailable){
        filteredVehicle = filteredVehicle.filter(item => item.status === 'AVAILABLE')
      } else {
        filteredVehicle = filteredVehicle.filter(item => item.status !== 'AVAILABLE')
      }
      clusterData = filteredVehicle.filter(item => item.type === type)

    }
    const markersData = clusterData.map(item => ({ lat: item.location.latitude, lng: item.location.longitude, ...item }))
    const clusters = supercluster(markersData, {
      minZoom: 0,
      maxZoom: 16,
      radius: 60,
    });
    return clusters(mapOptions);
  };

  getCluster = (type) => {
    const { mapOptions } = this.state;
    return mapOptions.bounds
    ? this.getClusters(type).map(({ wx, wy, numPoints, points }) => ({
        lat: wy,
        lng: wx,
        numPoints,
        id: `${numPoints}_${points[0].id}`,
        points,
      }))
    : []
  }

  createClusters = () => {
    this.setState({
      carsClusters: this.getCluster('CAR'),
      trucksClusters: this.getCluster('TRUCK'),
      parkingClusters: this.getCluster('parking'),
      poiClusters: this.getCluster('poi'),
    });
  };

  handleMapChange = ({ center, zoom, bounds }) => {
    this.setState(
      {
        mapOptions: {
          center,
          zoom,
          bounds,
        },
      },
      () => {
        this.createClusters(this.props);
      }
    );
  };

  renderMarker = (data, type) => {
    const { selectedMarker } = this.state;
    return data.map(item => {
        if (item.numPoints === 1) {
          const { status, id, lat, lng } = item.points[0]
          return (
                <Marker
                  status={status}
                  type={type}
                  key={id}
                  lat={lat}
                  lng={lng}
                  data={item.points[0]}
                  selectMarker={this.selectMarker}
                  selectedMarker={selectedMarker}
                  resetMarker={this.resetMarker}
                />
            );
        }
        return (
            <ClusterMarker
              key={item.points[0].id}
              lat={item.lat}
              lng={item.lng}
              points={item.points}
              type={item.type}
            />
        );
    })
  }
  resetMarker = () => this.setState({ selectedMarker: '' })

  setAvailable = () => this.setState({ onlyAvailable: !this.state.onlyAvailable })

  setRangeFilter = (value) => this.setState({ rangeFilter: value })

  render() {
    const { rangeFilter, onlyAvailable, poiClusters, trucksClusters, parkingClusters, carsClusters } = this.state;
    return (
      <MapWrapper>
        <FiltersCont 
          rangeFilter={rangeFilter}
          onlyAvailable={onlyAvailable}
          createClusters={this.createClusters}
          setAvailable={this.setAvailable}
          setRangeFilter={this.setRangeFilter}
        />
        <GoogleMapReact
          defaultZoom={MAP.defaultZoom}
          defaultCenter={MAP.defaultCenter}
          options={MAP.options}
          onChange={this.handleMapChange}
          yesIWantToUseGoogleMapApiInternals
          bootstrapURLKeys={{ key: 'AIzaSyCRzZjJAZjSHCMYQSLxu05SzDLVVzDxHjA' }}
        >
          {this.renderMarker(poiClusters, 'pois')}
          {this.renderMarker(trucksClusters, 'trucks')}  
          {this.renderMarker(parkingClusters, 'parkings')}
          {this.renderMarker(carsClusters, 'cars')}  
        </GoogleMapReact>
      </MapWrapper>
    );
  }
}

export default SimpleMap;

const MapWrapper = styled.div`
  position: relative;
  width: 800px;
  height: 800px;
`;