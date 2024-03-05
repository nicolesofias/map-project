import { createRef, useEffect, useMemo, useRef, useState } from "react";

import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';

const MapComponent = () => {
    const mapRef = createRef()
    
    const map = useMemo(() => {
        return new Map({
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
          ],
          view: new View({
            center: [0, 0],
            zoom: 2,
          }),
        })
    }, [])

    useEffect(() => {
        map.setTarget(mapRef.current)
    }, [map])
    
    return (
        <div style={{ width: '100vw', height: '100vh'}}>
           <div ref={mapRef} style={{ width: '100%', height: '100%'}}/>
        </div>
    )
}

export default MapComponent;