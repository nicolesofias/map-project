import { createRef, useEffect, useRef } from "react";
import 'ol/ol.css'
import { useMap } from "../../contexts/mapContext/mapContext";
import DisplayLayers from "../layers/displayLayers";
import DrawInteraction from "../layers/drawing/drawInteraction";
import { Box } from "@mui/material";



const MapComponent = () => {
    const mapRef = useRef(useMap());
    const ref = createRef()

    useEffect(() => {
        mapRef.current.setTarget(ref.current);
    }, [])


    
    return (
        <Box>
          <div ref={ref} style={{ width: '100vw', height: '400px'}}/>
          <DisplayLayers />
          <DrawInteraction />
        </Box>
    )
}

export default MapComponent;