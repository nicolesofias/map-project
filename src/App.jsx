
import './App.css'
import MapComponent from './components/map/MapComponet'
import {MapContextProvider} from './contexts/mapContext/mapContext'

function App() {

  return (
    <MapContextProvider>
      <MapComponent/>
    </MapContextProvider>
  )
}

export default App
