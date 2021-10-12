import { createContext, useState, html } from "../deps.js"; 
import { defaultSelectStarsData } from "../src/stars.js";

export const SelectStarsCtx = createContext();

export const SelectStarsProvider = ({ children }) => {
  const [selectStarsData, sSelectStarsData] = useState(defaultSelectStarsData);

  const setSelectStarsData = (data) => {
    sSelectStarsData(prev => ({ ...prev, ...data }));
  }; 

  const value = {
    selectStarsData,
    setSelectStarsData,
  };
  
  return html`
    <${SelectStarsCtx.Provider} value=${value} >
      ${children}
    </${SelectStarsCtx.Provider}>
  `
}
