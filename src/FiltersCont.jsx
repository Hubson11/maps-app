import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

export const FiltersCont = ({ rangeFilter, onlyAvailable, createClusters, setAvailable, setRangeFilter }) => (
    <FiltersWrapper>
        <FilterElement>
            <Label>
                Write range to filter
            </Label>
            <input value={rangeFilter} onChange={e => setRangeFilter(e.target.value) } />
        </FilterElement>
        <FilterElement>
            <Label>
                Only available
            </Label>
            <input type="checkbox" checked={onlyAvailable} value={onlyAvailable} onChange={setAvailable} />
        </FilterElement>
        <Button onClick={() => createClusters()}>
            Submit filters
        </Button>
    </FiltersWrapper>
)

FiltersCont.propTypes = {
    rangeFilter: PropTypes.string.isRequired,
    onlyAvailable: PropTypes.bool.isRequired,
    createClusters: PropTypes.func.isRequired,
    setAvailable: PropTypes.func.isRequired,
    setRangeFilter: PropTypes.func.isRequired,
}

const FiltersWrapper = styled.div`
    display: flex;
    flex-direction: column;
`

const FilterElement = styled.div`
    margin: 10px 0;
`

const Button = styled.button`
    padding: 4px 8px; 
    margin: 10px 0; 
    width: 140px;
`

const Label = styled.span`
    margin: 0 15px 0 0;
`