import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { DEFAULT_PROJECTION, DEFAULT_ZOOM } from '../../constants/defaults'
import VectorLayer from "ol/layer/Vector";
import { layersPath } from '../../constants/paths';

export const createMap = () => {
    const mapInstance = new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: [0, 0],
          zoom: DEFAULT_ZOOM,
          projection: DEFAULT_PROJECTION
        }),
      })
    
    return mapInstance
}

export const getArrayOfAllLayers = (map) => {
    return map.getAllLayers();
  }
  
  export const getArrayOfVectorLayers = (map) => {
      return map.getAllLayers().filter((layer) => layer instanceof VectorLayer);
  }
  
  export const getArrayOfVectorLayersWithoutDrawing = (map) => {
      return map.getAllLayers().filter((layer) => layer instanceof VectorLayer && layer.getProperties().name !== 'drawLayer');
  }

  export const getLayers = () => {
    return fetch(layersPath).then((res) => res.json())
  }