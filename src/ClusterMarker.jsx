import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class ClusterMarker extends React.PureComponent {
  render() {
    const { points, type } = this.props;
    return (
      <MarkerGroup length={points.length}>
        {points.length > 1 &&
          <MarkerCounter type={type}>
            +{points.length - 1}
          </MarkerCounter>}
      </MarkerGroup>
    );
  }
}

ClusterMarker.propTypes = {
  points: PropTypes.array,
  type: PropTypes.string,
};

ClusterMarker.defaultProps = {
  points: '',
  type: '',
};

export default ClusterMarker;

const MarkerGroup = styled.div`
  display: flex;
  background: #fff;
`;

const MarkerCounter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  padding: 4px 12px;
  margin-left: -10px;
  text-align: center;
  font-size: 14px;
  color: #fff;
  border: 2px solid #fff;
  border-radius: 50%;
  background-color: ${props => props.type !== 'parking' ? 'silver' : 'blue'};
`;