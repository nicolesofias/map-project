import { layersPath } from '../../constants/paths';

export const getLayers = () => {
    const dataPromise = fetch(layersPath).then((res) => res.json())
    return dataPromise
  }