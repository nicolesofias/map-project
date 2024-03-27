import React from 'react'
import { findFeatureById, getArrayOfVectorLayers, getArrayOfVectorLayersWithoutDrawing } from '../map/mapUtils'
import { LayerNames } from '../../constants/layerNames'
import { createLine } from './createLine'
import { Types } from '../../constants/types'

const handleConnectedFeatures = (feature, map) => {
    const current_vector_layers_without_drawing = getArrayOfVectorLayersWithoutDrawing(map)
    const linesLayer = getArrayOfVectorLayers(map).find((layer) => layer.getProperties().name === LayerNames.LinesLayerName)
    const featureGeometry = feature.getGeometry()
    if(feature.getProperties().type === Types.Device){
        const siteId = feature.getProperties().site_id
        const siteFeature = findFeatureById(siteId, current_vector_layers_without_drawing)
        createLine(siteFeature.getGeometry(), featureGeometry, linesLayer)
      }
      else { // feature.getProperties().type === site
        current_vector_layers_without_drawing.forEach((layer) => {
          layer.getSource().forEachFeature((deviceFeature) => {
            if (deviceFeature.getProperties().site_id === feature.getId()) {
              createLine(featureGeometry, deviceFeature.getGeometry(), linesLayer)
            }
          })
        })
      }
}

export default handleConnectedFeatures