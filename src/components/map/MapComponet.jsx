import { createRef, useEffect, useRef } from "react";
import 'ol/ol.css'
import { useMap } from "../../contexts/mapContext/mapContext";
import DisplayLayers from "../layers/displayLayers";
import DrawInteraction from "../layers/drawing/drawInteraction";
import { Box, Container } from "@mui/material";



const MapComponent = () => {
    const mapRef = useRef(useMap());
    const mapContainerRef = createRef()

    useEffect(() => {
        mapRef.current.setTarget(mapContainerRef.current);
    }, [])


    
    return (
        <Box>
          <Container ref={mapContainerRef} style={{ width: '100vw', height: '400px'}}/>
          <DisplayLayers />
          <DrawInteraction />
        </Box>
    )
}

export default MapComponent;