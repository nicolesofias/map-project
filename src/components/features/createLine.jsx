import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import { LayerNames } from "../../constants/layerNames"
import { LineString } from "ol/geom"
import { Feature } from "ol"
import { getArrayOfAllLayers } from "../map/mapUtils"

export const createLine = (siteFeatureGeometry, deviceFeatureGeometry, linesLayer) => {
    const coors = [siteFeatureGeometry.getCoordinates(), deviceFeatureGeometry.getCoordinates()]

    const checkIfEqualCoordinates = (coordinates) => {
        coordinates[0][0] === coors[0][0] && coordinates[0][1] === coors[0][1] && coordinates[1][0] === coors[1][0] && coordinates[1][1] === coors[1][1]
    }
    
    if(!linesLayer.getSource().getFeatures().map((feature) => feature.getGeometry().getCoordinates()).find((coordinates) => checkIfEqualCoordinates(coordinates))){
        linesLayer.getSource().addFeature(new Feature(new LineString(coors)))
    }
}