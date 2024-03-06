import { createRef, useEffect, useMemo, useRef, useState } from "react";

import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import Layer from "ol/layer/Layer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Geometry, Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import GeoJSON from 'ol/format/GeoJSON.js';
import Source from "ol/source/Source";

const MapComponent = () => {
  const [features, setFeatures] = useState(null);
    const mapRef = createRef();
    
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
            projection: 'EPSG:4326'
          }),
        })
    }, [])

    const vector = useMemo(() => new VectorLayer({
      source: new VectorSource({
        features: features
        // [
        //   new Feature({
        //     geometry: new Point(fromLonLat([34.771245363470314, 32.02891141680503])),
        //   })
        // ]
      }),
      properties: {
          name: 'stam'
      },
      style: new Style({
        image: new Icon({
          src: '/map-marker.svg'
        })
      })
    }), [features])

    const getFeatures = () => {
      fetch('/features_collection.json').then((res) => {
        res.json().then((data) => {
          const feats = new GeoJSON().readFeatures(data)
          setFeatures(feats)
        })
      }).catch((err) => {
        console.log(err);
      })
    }

    useEffect(() => {
        map.setTarget(mapRef.current)

        if (!map.getLayers().getArray().find(layer => layer.getProperties().name === 'stam') && features)
          map.addLayer(vector)

    }, [map, features])

    useEffect(() => {
      getFeatures()
    }, [])


    
    return (
        <div style={{ width: '100vw', height: '100vh'}}>
           <div ref={mapRef} style={{ width: '100%', height: '100%'}}/>
        </div>
    )
}

export default MapComponent;