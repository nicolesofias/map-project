import { Autocomplete, Box, TextField } from '@mui/material'
import React, {  } from 'react'

const SelectionComponent = ({selectionFeaturesArray, selectedFeature, handleChange}) => {
    return (
        <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '15px'}}>
            <Autocomplete 
            label='new feature'
            value={selectedFeature}
            getOptionLabel={(option) => option.getProperties().name}
            onChange={handleChange}
            options={selectionFeaturesArray}
            renderInput={(params) => <TextField {...params} label="select feature to add" />}
            sx={{width: '250px'}}
            >
            </Autocomplete>
        </Box>
    )
}

export default SelectionComponent