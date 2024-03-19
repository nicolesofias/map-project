import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import React from 'react'

function createMap() {
    const mapInstance = new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: [0, 0],
          zoom: 2,
          projection: 'EPSG:4326'
        }),
      })
    
    return mapInstance
}

export default createMap