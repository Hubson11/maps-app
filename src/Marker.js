import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import truck from './static/images/truck.png';
import car from './static/images/car.png';
import parking from './static/images/parking.png';
import poi from './static/images/poi.png';

class Marker extends React.PureComponent {
  static defaultProps = {
    inGroup: false,
  };

  closeRender = () => {
    const { resetMarker } = this.props;
    return(
      <CloseCont onClick={resetMarker} >
        x
      </CloseCont>
    )
  }

  renderParking = () => {
    const { data } = this.props;
    return(
      <DescWrapper>
        {this.closeRender()}
        <DescTitle>{data.name}</DescTitle>
        <DescElement>
          {data.description}
        </DescElement>
        {data.address &&
          <DescElement>
            Address: {data.address.street} - {data.address.house} - {data.address.city}
          </DescElement>
        }
        <DescElement>
          Spaces: {data.availableSpacesCount} / {data.spacesCount}
        </DescElement>
      </DescWrapper>
    )
  }

  renderTrucks = () => {
    const { data } = this.props;
    return(
      <DescWrapper>
        {this.closeRender()}
        <DescTitle>{data.name}</DescTitle>
        <DescElement>
          Plates number: {data.platesNumber}
        </DescElement>
        <DescElement>
          Range: {data.rangeKm}
        </DescElement>
        <DescElement>
          Status: {data.status}
        </DescElement>
      </DescWrapper>
    )
  }

  renderPoi = () => {
    const { data } = this.props;
    return(
      <DescWrapper>
        {this.closeRender()}
        <DescTitle>{data.name}</DescTitle>
        <DescElement>
          Category: {data.category}
        </DescElement>
      </DescWrapper>
    )
  }

  renderDescription = () => {
    const { type } = this.props;
    if(type === 'parkings'){
      return this.renderParking()
    }
    if(type === 'cars' || type === 'trucks' ){
      return this.renderTrucks()
    }
    if(type === 'pois'){
      return this.renderPoi()
    }
  }

  render() {
    const { inGroup, status, type, data, selectedMarker, selectMarker } = this.props;
    let icon = ''
    let color = ''
    switch(type){
      case 'cars':
        icon = car;
        color = status === 'AVAILABLE' ? 'green' : 'red'
        break;
      case 'trucks':
        icon = truck;
        color = status === 'AVAILABLE' ? 'green' : 'red'
        break;
      case 'parkings':
        icon = parking;
        color = 'transparent'
        break;
      case 'pois':
        icon = poi;
        color = 'transparent';
        break;
      default:
        break;
    }
    return (
      <MarkerCont>
        {inGroup
          ? <MarkerInGroupStyled />
          :
          <MarkerWrapper>
            <MarkerStyled color={color} icon={icon} onClick={() => selectMarker(data.id)} />
            {selectedMarker === data.id &&
              this.renderDescription()
            }
          </MarkerWrapper> 
        }
      </MarkerCont>
    );
  }
}

Marker.propTypes = {
  inGroup: PropTypes.bool,
  resetMarker: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  status: PropTypes.string,
  selectedMarker: PropTypes.string.isRequired,
  selectMarker: PropTypes.func.isRequired,
  availableSpacesCount: PropTypes.number,
  spacesCount: PropTypes.number,
  platesNumber: PropTypes.string,
  rangeKm: PropTypes.number,
  category: PropTypes.string,
  data: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    address: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        street: PropTypes.string,
        house: PropTypes.string,
        city: PropTypes.string,
      }),
    ]),
  }),
};

Marker.defaultProps = {
  inGroup: false,
  data: {
    name: '',
    description: '',
    availableSpacesCount: 0,
    spacesCount: 0,
    platesNumber: '',
    rangeKm: 0,
    status: '',
    category: '',
    address: {
      street: '',
      house: '',
      city: '',
    },
  },
}

export default Marker;

const CloseCont = styled.div`
  position: absolute;
  font-size: 14px; 
  right: 10px; 
  top: 5px; 
  cursor: pointer;
`

const MarkerCont = styled.div`
`

const DescElement = styled.div`
  margin: 10px 0;
`

const DescTitle = styled.h2`

`

const MarkerWrapper = styled.div`
  display: block;
`

const DescWrapper = styled.div`
  position: fixed;
  z-index: 2; 
  background-color: #FFF; 
  padding: 10px;
`

const MarkerStyled = styled.div`
  width: 30px;
  height: 30px;
  font-size: 14px;
  color: #fff;
  text-transform: uppercase;
  border: 2px solid #fff;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s;
  background-color: ${props => props.color};
  background-image: url(${props => props.icon});
  &:hover {
    transform: scale(1.2);
  }
`;

const MarkerInGroupStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  margin-left: -7px;
  font-size: 14px;
  color: #fff;
  text-transform: uppercase;
  border: 2px solid #fff;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-color: green;
`;