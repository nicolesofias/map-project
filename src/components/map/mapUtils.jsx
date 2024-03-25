import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { DEFAULT_PROJECTION, DEFAULT_ZOOM } from '../../constants/defaults'
import VectorLayer from "ol/layer/Vector";
import { layersPath } from '../../constants/paths';
import { LayerNames } from '../../constants/layerNames';

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
      return map.getAllLayers().filter((layer) => layer instanceof VectorLayer && !Object.values(LayerNames).includes(layer.getProperties().name));
  }

  export const getLayers = () => {
    return fetch(layersPath).then((res) => res.json())
  }

  export const findFeatureById = (id, layersArray) => {
    return layersArray.map((layer) => layer.getSource().getFeatureById(id)).find((val) => val !== null)
  }