import React, { useEffect, useRef, useState } from 'react'
import { useMap } from '../../../contexts/mapContext/mapContext'
import Draw from 'ol/interaction/Draw'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { Box, Button, Typography } from '@mui/material'
import { findlayerByName, getArrayOfAllLayers, getArrayOfVectorLayersWithoutDrawing } from '../../map/mapUtils'
import featuresCounter from './featuresCounter'
import { LayerNames } from '../../../constants/layerNames'
import { GeoJsonTypes } from '../../../constants/GeoJsonTypes'

const DrawInteraction = () => {
    const map = useMap()
    const [disableButton, setDisableButton] = useState(false)
    const [counterArray, setCounterArray] = useState(null)
    const [vector_layers_without_drawing, set_vector_layers_without_drawing] = useState([])

    const onDraw = (event) => {
        const layers_without_drawing = getArrayOfVectorLayersWithoutDrawing(map)
        set_vector_layers_without_drawing(layers_without_drawing)
        const geometry = event.feature.getGeometry();
        const counter = featuresCounter(layers_without_drawing, geometry)
        setCounterArray(counter)
    }

    const handleInteraction = () => {
        if (!map) return;
        const source = findlayerByName(LayerNames.DrawLayerName, map).getSource()
        const draw = new Draw({
          source: source,
          type: GeoJsonTypes.Polygon,
        });

        draw.on('drawend', onDraw);

        map.addInteraction(draw);
        source.on('addfeature', function(evt){
            draw.setActive(false);
        });
        setDisableButton(true)

    }

    const clearSourceOfLayer = (name) => {
        findlayerByName(name, map).getSource().clear();
    }

    const handleClearDraw = () => {
        if (!map) return;

        clearSourceOfLayer(LayerNames.DrawLayerName)
        clearSourceOfLayer(LayerNames.LinesLayerName)
        setDisableButton(false)
        setCounterArray(null)
    }

    useEffect(() => {
          const newVector = new VectorLayer({
            source:  new VectorSource({wrapX: false}),
            name: LayerNames.DrawLayerName
          });
          map.addLayer(newVector);
    }, [])


    
    return (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'center', gap: '5px'}}>
                <Button disabled={disableButton} variant="contained" onClick={handleInteraction} sx={{mt: '10px'}}>create a polygon</Button>
                <Button variant="contained" onClick={handleClearDraw} sx={{mt: '10px'}}>clear</Button>
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                {vector_layers_without_drawing.map((layer, index) => (
                    counterArray && <Typography sx={{mr: '5px'}} key={layer.getProperties().name}>{layer.getProperties().name}: {`${counterArray[index]} features. `}  </Typography>
                ))}
            </Box>
        </Box>
    )
}

export default DrawInteraction