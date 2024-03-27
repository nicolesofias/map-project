import { findlayerByName } from '../map/mapUtils'
import { LayerNames } from '../../constants/layerNames'

const handleAddFeatureAfterClick = (feature, coordinates, map) => {
    const selectionLayer = findlayerByName(LayerNames.FeaturesFromSelection, map)
    feature.getGeometry().setCoordinates(coordinates)
    selectionLayer.getSource().addFeature(feature)
}

export default handleAddFeatureAfterClick