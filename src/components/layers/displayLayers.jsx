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
import { findFeatureById, findFeatureByIdFromLayer, findlayerByName, getArrayOfAllLayers, getArrayOfVectorLayersWithoutDrawing, getFeaturesForSelection, getLayers } from '../map/mapUtils';
import handleConnectedFeatures from '../features/handleConnectedFeatures';
import { LayerNames } from '../../constants/layerNames';
import SelectionComponent from '../map/selectFeatureToAdd/selectionComponent';
import handleAddFeatureAfterClick from '../features/handleAddFeatureAfterClick';
import CustomCursor from "../../../public/yellow.svg";

const DisplayLayers = () => {
    const map = useMap();
    const popupContainerRef = useRef(null);
    const [openPopup, setOpenPopup] = useState(false)
    const [properties, setProperties] = useState(null)

    const selectionFeaturesArrayRef = useRef([])
    const[selectionFeaturesArray, setSelectionFeaturesArray] = useState([])
    const selectionModeRef = useRef(false)
    const [selectionMode, setSelectionMode] = useState(false)
    const selectedFeatureRef = useRef(null)
    const [removeButtonExists, setRemoveButtonExists] = useState(false)

    const showInfoForPopup = (feature) => {
        const info = feature.getProperties()
        setProperties({
          id: feature.getId(),
          type: info.type,
          name: info.name,
          description: info.description,
          ruler: info.ruler,
          established: info.established,
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
            // add the' lines layer' and the 'features from selection layer'
            const linesLayer = new VectorLayer({
              source: new VectorSource(),
              properties: {
                  name: LayerNames.LinesLayerName
              },
          })

          const selectionFeaturesLayer = new VectorLayer({
            source: new VectorSource(),
            properties: {
              name: LayerNames.FeaturesFromSelection
            },
            style: new Style({
              image: new Icon({
                src: 'yellow.svg'
              })
            })
          })

          map.addLayer(linesLayer)
          map.addLayer(selectionFeaturesLayer)
        }).catch((err) => console.log(err));
    }

    const readSelectionFeatures = () => {
      getFeaturesForSelection().then((data) => {
        const feats = new GeoJSON().readFeatures(data)
        selectionFeaturesArrayRef.current = feats
        setSelectionFeaturesArray(feats)
      }).catch((err) => console.log(err))
  }

    const handleSelectFeature = (event, value) => {
      selectedFeatureRef.current = value
      if(value) {
        selectionModeRef.current = true
        setSelectionMode(true)
      }
      else {
        selectionModeRef.current = false
        setSelectionMode(false)
      }
    }

    const handleMapClick = (evt) => {

      // display feature info:

      getArrayOfVectorLayersWithoutDrawing(map).forEach((vectorLayer) => {vectorLayer.getFeatures(evt.pixel).then(function (features) {
        const feature = features.length ? features[0] : undefined;
        if (feature) {
          if(vectorLayer.getProperties().name === LayerNames.FeaturesFromSelection) {
            setRemoveButtonExists(true)
          }
          else {
            setRemoveButtonExists(false)
          }
          showInfoForPopup(feature)
          setOpenPopup(true)
          handleConnectedFeatures(feature, map)
        }
      })})

      // if clicked on newly added feature
      // findlayerByName(LayerNames.FeaturesFromSelection, map).getFeatures(evt.pixel).then((features) => {
      //   const feature = features.length ? features[0] : undefined;
      //   if(feature) {
      //     setRemoveButtonExists(true)
      //     showInfoForPopup(feature)
      //     setOpenPopup(true)
      //   }
      // })

      // add selected feature at the clicked pixel:

      if (selectionModeRef.current === true){
        console.log("in selection mode");
        const currentFeature = selectedFeatureRef.current
        const currentSelectionFeaturesArray = selectionFeaturesArrayRef.current

        const coordinates = map.getCoordinateFromPixel(evt.pixel)
        handleAddFeatureAfterClick(currentFeature, coordinates, map)

        //remove feature from selection options
        const index = currentSelectionFeaturesArray.indexOf(currentFeature)
        const newSelectionFeaturesArray = [...currentSelectionFeaturesArray]
        newSelectionFeaturesArray.splice(index, 1)
        selectionFeaturesArrayRef.current = newSelectionFeaturesArray
        setSelectionFeaturesArray(newSelectionFeaturesArray)
        
        //exit selection mode:
        selectionModeRef.current = false 
        setSelectionMode(false)
        selectedFeatureRef.current = null
      }
  }
    
    const handleClosePopover = () => {
        setOpenPopup(false);
        setProperties(null)
    }

    const handleRemoveClickedSelectionFeature = () => {
      const layer = findlayerByName(LayerNames.FeaturesFromSelection, map)
      const featureToRemove = findFeatureByIdFromLayer(properties.id, layer)
      layer.getSource().removeFeature(featureToRemove)

      const newSelectionFeaturesArray = [...selectionFeaturesArray]
      newSelectionFeaturesArray.push(featureToRemove)
      setSelectionFeaturesArray(newSelectionFeaturesArray)
      selectionFeaturesArrayRef.current = newSelectionFeaturesArray

      setOpenPopup(false)
    }

    useEffect(() => {
        addLayersToMap()
        readSelectionFeatures()
        map.on('click', handleMapClick)
        // if(map.getTargetElement()) {
          
        // }
    }, [])

    useEffect(() => {
      if(map.getTargetElement()) {
        const mapContainerStyle = map.getTargetElement().style
        if(selectionMode)
        {
        mapContainerStyle.cursor = "url(" + CustomCursor + "), auto"
        }
        else {
          mapContainerStyle.cursor = "auto"
        }
      }
    }, [selectionMode])

    return (
      <Box>
        <Box ref={popupContainerRef}>
            <PopoverComponent anchorEl={popupContainerRef.current} handleClose={handleClosePopover} info={properties} open={openPopup} removeButton={removeButtonExists} handleRemove={handleRemoveClickedSelectionFeature}/>
        </Box>
        <SelectionComponent selectionFeaturesArray={selectionFeaturesArray} selectedFeature={selectedFeatureRef.current} handleChange={handleSelectFeature} />
      </Box>
        
    )
}

export default DisplayLayers