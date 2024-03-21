import React, { useEffect, useRef, useState } from 'react'
import { useMap } from '../../contexts/mapContext/mapContext';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { Box } from '@mui/material';
import PopoverComponent from '../map/popover/PopoverComponent';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Overlay } from 'ol';
import { getArrayOfAllLayers, getArrayOfVectorLayersWithoutDrawing, getLayers } from '../map/mapUtils';

const DisplayLayers = () => {
    const map = useMap();
    const popupContainerRef = useRef(null);
    const [openPopup, setOpenPopup] = useState(false)
    const [properties, setProperties] = useState(null)

    const showInfoForPopup = (feature) => {
        const info = feature.getProperties()
        setProperties({
          name: info.name,
          description: info.description,
          ruler: info.ruler,
          established: info.established
        })
        map.addOverlay(new Overlay({
          id: 'popup',
          element: popupContainerRef.current,
          position: feature.getGeometry().getCoordinates()
        }));
    }

    const addLayersToMap = () => {
        getLayers().then((data) => {
            const vector_layers = data.vector_layers
            vector_layers.forEach((vector_layer_json) => {
                const current_vector_layer = new VectorLayer({
                    source: new VectorSource({}),
                    properties: {
                        name: vector_layer_json.properties.name
                    },
                    style: new Style({
                      image: new Icon({
                        src: vector_layer_json.marker_source
                      })
                    })
                })
                const feats = new GeoJSON().readFeatures(vector_layer_json.features_collection);
                current_vector_layer.getSource().addFeatures(feats)
                if(!getArrayOfAllLayers(map).some((layer) => layer.getProperties().name === current_vector_layer.getProperties().name)){
                    map.addLayer(current_vector_layer)
                }
            })
        }).catch((err) => console.log(err));
    }

    const handleMapClick = (evt) => {
        getArrayOfVectorLayersWithoutDrawing(map).forEach((vectorLayer) => {vectorLayer.getFeatures(evt.pixel).then(function (features) {
          const feature = features.length ? features[0] : undefined;
          if (feature) {
            showInfoForPopup(feature)
            setOpenPopup(true)
          }
        })})
      }
    
    const handleClosePopover = () => {
        setOpenPopup(false);
        setProperties(null)
    }

    useEffect(() => {
        addLayersToMap()
        map.on('click', handleMapClick)
    }, [])

    return (
        <Box ref={popupContainerRef}>
            <PopoverComponent anchorEl={popupContainerRef.current} handleClose={handleClosePopover} info={properties} open={openPopup}/>
        </Box>
    )
}

export default DisplayLayers