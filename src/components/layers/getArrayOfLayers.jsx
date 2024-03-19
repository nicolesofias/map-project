import VectorLayer from "ol/layer/Vector";


export const getArrayOfAllLayers = (map) => {
  return map.getAllLayers();
}

export const getArrayOfVectorLayers = (map) => {
    return map.getAllLayers().filter((layer) => layer instanceof VectorLayer);
}

export const getArrayOfVectorLayersWithoutDrawing = (map) => {
    return map.getAllLayers().filter((layer) => layer instanceof VectorLayer && layer.getProperties().name !== 'drawLayer');
}