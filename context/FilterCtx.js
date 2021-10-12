import { createContext, useState, html } from "../deps.js"; 
import { defaultFilterData } from "../src/filter.js";

export const FilterCtx = createContext();

export const FilterProvider = ({ children }) => {
  const [filterData, sFilterData] = useState(defaultFilterData);

  const setFilterData = (data) => {
    sFilterData(prev => ({ ...prev, ...data }));
  };

  const value = {
    filterData,
    setFilterData,
  };

  return html`
    <${FilterCtx.Provider} value=${value} >
      ${children}
    </${FilterCtx.Provider}>
  `
}
