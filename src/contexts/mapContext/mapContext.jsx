import React, { createContext, useContext, useRef, useState } from 'react'
import createMap from '../../components/map/createMap'

export const MapContext = createContext()

export const MapContextProvider = ({children}) => {
  const mapRef = useRef(createMap());
  return (
    <MapContext.Provider value= {mapRef.current}>
        {children}
    </MapContext.Provider>
  )
}

export const useMap = () => useContext(MapContext);