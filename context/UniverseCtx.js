import { createContext, useState, html } from "../deps.js"; 
import { defaultStarData } from "../src/stars.js";
import { defaultPlanetData } from "../src/planets.js";

export const UniverseCtx = createContext();

export const UniverseProvider = ({ children }) => {
  const [starData, setStarData] = useState(defaultStarData);
  const [planetData, setPlanetData] = useState(defaultPlanetData);

  const setUniverseData = ({ newStarData, newPlanetData }) => {
    setStarData(prev => ({ ...prev, ...newStarData }));
    setPlanetData(prev => ({ ...prev, ...newPlanetData }));
  };

  const value = {
    starData,
    planetData,
    setUniverseData,
  };

  return html`
    <${UniverseCtx.Provider} value=${value} >
      ${children}
    </${UniverseCtx.Provider}>
  `
}
