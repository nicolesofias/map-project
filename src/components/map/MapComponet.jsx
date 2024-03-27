import { createRef, useEffect, useRef } from "react";
import 'ol/ol.css'
import { useMap } from "../../contexts/mapContext/mapContext";
import DisplayLayers from "../layers/displayLayers";
import DrawInteraction from "../layers/drawing/drawInteraction";
import { Box } from "@mui/material";



const MapComponent = () => {
    const mapRef = useRef(useMap());
    const mapContainerRef = createRef()

    useEffect(() => {
        mapRef.current.setTarget(mapContainerRef.current);
    }, [])


    
    return (
        <Box>
          <Box ref={mapContainerRef} style={{ width: '100vw', height: '400px'}}/>
          <DrawInteraction />
          <DisplayLayers />
        </Box>
    )
}

export default MapComponent;