import React, { useEffect, useRef, useState } from 'react'
import { useMap } from '../../../contexts/mapContext/mapContext'
import Draw from 'ol/interaction/Draw'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { Box, Button, Typography } from '@mui/material'
import { getArrayOfAllLayers, getArrayOfVectorLayersWithoutDrawing } from '../getArrayOfLayers'
import featuresCounter from './featuresCounter'

const DrawInteraction = () => {
    const mapRef = useRef(useMap())
    const [disableButton, setDisableButton] = useState(false)
    const [counterArray, setCounterArray] = useState(null)
    const vector_layers_without_drawing = getArrayOfVectorLayersWithoutDrawing(mapRef.current)

    const onDraw = (event) => {
        const vector_layers_without_drawing = getArrayOfVectorLayersWithoutDrawing(mapRef.current)
        const geometry = event.feature.getGeometry();
        const counter = featuresCounter(vector_layers_without_drawing, geometry)
        setCounterArray(counter)
    }

    const handleInteraction = () => {
        if (!mapRef.current) return;
        const source = getArrayOfAllLayers(mapRef.current).find(element => element.getProperties().name === 'drawLayer').getSource()
        const draw = new Draw({
          source: source,
          type: "Polygon",
        });

        draw.on('drawend', onDraw);

        mapRef.current.addInteraction(draw);
        source.on('addfeature', function(evt){
            draw.setActive(false);
        });
        setDisableButton(true)

    }

    const handleClearDraw = () => {
        if (!mapRef.current) return;

        getArrayOfAllLayers(mapRef.current).find(element => element.getProperties().name === 'drawLayer').getSource().clear();
        setDisableButton(false)
        setCounterArray(null)
    }

    useEffect(() => {
          const newVector = new VectorLayer({
            source:  new VectorSource({wrapX: false}),
            name: "drawLayer"
          });
          mapRef.current.addLayer(newVector);
    }, [])


    
    return (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'center', gap: '5px'}}>
                <Button disabled={disableButton} variant="contained" onClick={handleInteraction} sx={{mt: '10px', marginLeft: '10px'}}>create a polygon</Button>
                <Button variant="contained" onClick={handleClearDraw} sx={{mt: '10px', marginLeft: '10px'}}>clear</Button>
            </Box>
            <Box>
                {vector_layers_without_drawing.map((layer, index) => (
                    counterArray && <Typography sx={{ml: '5px'}} key={layer.getProperties().name}>{layer.getProperties().name}: {`${counterArray[index]} features`}  </Typography>
                ))}
            </Box>
        </Box>
    )
}

export default DrawInteraction