import { GeoJsonTypes } from "../../../constants/GeoJsonTypes";


const featuresCounter = (layers, geometry) => {
    const counter = new Array(layers.length).fill(0)
    const type = geometry.getType();
    if (type === GeoJsonTypes.Polygon) {
      layers.forEach((layer,index) =>
      layer.getSource().forEachFeature((feature) => {
        const coordinates = feature.getGeometry().getCoordinates()
        if(geometry.intersectsCoordinate(coordinates)) {
            counter[index] += 1
        }
      })
      );
    }
    return counter
}

export default featuresCounter