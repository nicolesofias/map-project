import { createRef, useEffect, useMemo, useRef, useState } from "react";

import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import GeoJSON from 'ol/format/GeoJSON.js';
import DialogComponent from "./DialogComponent";

const MapComponent = () => {
    // const [map, setMap] = useState(null)
    const [features, setFeatures] = useState(null)
    const [openDialog, setOpenDialog] = useState(false)
    const [properties, setProperties] = useState({
      name: "",
      description: "",
      ruler: "",
      established: ""
    })

    const mapRef = useRef(null);

    const vector = useMemo(() => new VectorLayer({
      source: new VectorSource({
        // features: features
      }),
      properties: {
          name: 'stam'
      },
      style: new Style({
        image: new Icon({
          src: '/map-marker.svg'
        })
      })
    }), [])

    const getFeatures = () => {
      fetch('/features_collection.json').then((res) => {
        res.json().then((data) => {
          const feats = new GeoJSON().readFeatures(data)
          setFeatures(feats)
        }).catch((err) => {
          console.log(err)
        })
      }).catch((err) => {
        console.log(err);
      })
    }

    const displayFeatureInfo = function (pixel) {
      vector.getFeatures(pixel).then(function (features) {
        const feature = features.length ? features[0] : undefined;
        if (features.length) {
          const info = feature.getProperties()
          setProperties({
            name: info.name,
            description: info.description,
            ruler: info.ruler,
            established: info.established
          })
          setOpenDialog(true);
        }
        else {
          setProperties({
            name: "",
            description: "",
            ruler: "",
            established: ""
          })
        }
      })
    }

    // useEffect(() => {
    //     map.setTarget(mapRef.current)
    //     if (!map.getLayers().getArray().find(layer => layer.getProperties().name === 'stam') && features){
    //       vector.getSource().addFeatures(features)
    //       map.addLayer(vector)
    //     }

    // }, [map, features])

    useEffect(() => {
      if(!mapRef.current){
        const mapInstance = new Map({
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
          ],
          target: 'map',
          view: new View({
            center: [0, 0],
            zoom: 2,
            projection: 'EPSG:4326'
          }),
        })
        mapRef.current = mapInstance
        getFeatures();
      }
    }, [])

    useEffect(() => {
        if(mapRef && features){
          vector.getSource().addFeatures(features)
          mapRef.current.addLayer(vector)
          mapRef.current.on('click', function (evt) {
            displayFeatureInfo(evt.pixel);
          });
        }
    }, [features])
    
    return (
        <div style={{ width: '100vw', height: '100vh'}}>
           <div id="map" style={{ width: '100%', height: '100%'}}/>
           <DialogComponent open={openDialog} setOpen={setOpenDialog} info={properties}/>
        </div>
    )
}

export default MapComponent;