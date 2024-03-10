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
import PopoverComponent from "./PopoverComponent";
import Overlay from "ol/Overlay";
import { Box, Button, Typography } from "@mui/material";
import Draw from 'ol/interaction/Draw.js';
import Source from "ol/source/Source";


const MapComponent = () => {
    // const [map, setMap] = useState(null)
    const [features, setFeatures] = useState(null)
    // const [openDialog, setOpenDialog] = useState(false)
    const [openPopup, setOpenPopup] = useState(false)
    const [properties, setProperties] = useState({
      name: "",
      description: "",
      ruler: "",
      established: ""
    })
    const mapRef = useRef(null);
    const popupContainerRef = useRef(null);
    const source = new VectorSource({wrapX: false});
    const vector = useMemo(() => new VectorLayer({
      source: new VectorSource({}),
      properties: {
          name: 'stam'
      },
      style: new Style({
        image: new Icon({
          src: '/map-marker.svg'
        })
      })
    }), [])

    // const popup = useMemo(() => new Overlay({
    //   element: document.getElementById('popover'),
    // }), [])

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

    const getFeatureInfo = function (feature) {
          const info = feature.getProperties()
          setProperties({
            name: info.name,
            description: info.description,
            ruler: info.ruler,
            established: info.established
          })
          // setOpenDialog(true);
    }

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

    const handleMapClick = (evt) => {
      console.log("clicked");
      vector.getFeatures(evt.pixel).then(function (features) {
        const feature = features.length ? features[0] : undefined;
        if (feature) {
          getFeatureInfo(feature)
          mapRef.current.addOverlay(new Overlay({
            id: 'popup',
            element: popupContainerRef.current,
            position: feature.getGeometry().getCoordinates()
          }));
          setOpenPopup(true)
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

    const handleInteraction = () => {
      const draw = new Draw({
        source: source,
        type: "Polygon",
      });
      mapRef.current.addInteraction(draw);
    }
    useEffect(() => {
        if(mapRef.current && features){
          vector.getSource().addFeatures(features)
          mapRef.current.addLayer(vector)
          const newVector = new VectorLayer({
            source: source,
          });
          mapRef.current.addLayer(newVector);
        }
    }, [features])

    useEffect(() => {
        if (mapRef.current) {
          mapRef.current.on('click', handleMapClick);
        }
          
        return () => {
          mapRef.current.on('click', handleMapClick);
        }
    }, [mapRef.current])
    
    return (
        <div style={{ width: '100vw', height: '100vh'}}>
          <div id="map" style={{ width: '100%', height: '100%'}}/>
          <Button variant="contained" onClick={handleInteraction} sx={{mt: '10px', marginLeft: '10px'}}>create a polygon</Button>
           {/* <DialogComponent open={openDialog} setOpen={setOpenDialog} info={properties}/> */}
          <Box ref={popupContainerRef}>
            {/* { !!properties?.name && <Box>
                { Object.keys(properties).map(prop => <Typography key={prop}>{properties[prop]}</Typography>)}
            </Box> } */}
            <PopoverComponent anchorEl={popupContainerRef.current} setOpen={setOpenPopup} info={properties} open={openPopup} setProperties={setProperties}/>
          </Box>
        </div>
    )
}

export default MapComponent;