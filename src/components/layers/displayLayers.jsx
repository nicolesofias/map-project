import React, { useEffect, useRef, useState } from 'react'
import { useMap } from '../../contexts/mapContext/mapContext';
import { getLayers } from './getLayers';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { Box } from '@mui/material';
import PopoverComponent from '../popover/PopoverComponent';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Overlay } from 'ol';
import { getArrayOfAllLayers, getArrayOfVectorLayersWithoutDrawing } from './getArrayOfLayers';

const DisplayLayers = () => {
    const mapRef = useRef(useMap());
    const popupContainerRef = useRef(null);
    const [openPopup, setOpenPopup] = useState(false)
    const [properties, setProperties] = useState({
        name: "",
        description: "",
        ruler: "",
        established: ""
    })

    const getFeatureInfo = function (feature) {
        const info = feature.getProperties()
        setProperties({
          name: info.name,
          description: info.description,
          ruler: info.ruler,
          established: info.established
        })
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
                if(!getArrayOfAllLayers(mapRef.current).some((layer) => layer.getProperties().name === current_vector_layer.getProperties().name)){
                    mapRef.current.addLayer(current_vector_layer)
                }
            })
        }).catch((err) => console.log(err));
    }

    const handleMapClick = (evt) => {
        getArrayOfVectorLayersWithoutDrawing(mapRef.current).forEach((vectorLayer) => {vectorLayer.getFeatures(evt.pixel).then(function (features) {
          const feature = features.length ? features[0] : undefined;
          if (feature) {
            getFeatureInfo(feature)
            mapRef.current.addOverlay(new Overlay({
              id: 'popup',
              element: popupContainerRef.current,
              position: feature.getGeometry().getCoordinates()
            }));
            setOpenPopup(true)
          }
        })})
      }

    useEffect(() => {
        addLayersToMap()
        mapRef.current.on('click', handleMapClick)
    }, [])

    return (
        <Box ref={popupContainerRef}>
            <PopoverComponent anchorEl={popupContainerRef.current} setOpen={setOpenPopup} info={properties} open={openPopup} setProperties={setProperties}/>
        </Box>
    )
}

export default DisplayLayers