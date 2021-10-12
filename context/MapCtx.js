import { createContext, useState, html } from "../deps.js"; 
import { defaultMapData } from "../src/map.js";

export const MapCtx = createContext();

export const MapProvider = ({ children }) => {
  const [mapData, sMapData] = useState(defaultMapData);

  const setMapData = (data) => {
    sMapData(prev => ({ ...prev, ...data }));
  };

  const value = {
    mapData,
    setMapData,
  };

  return html`
    <${MapCtx.Provider} value=${value} >
      ${children}
    </${MapCtx.Provider}>
  `
}
