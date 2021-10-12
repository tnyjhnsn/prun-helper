import { useContext, useState, useEffect, html, Fragment } from "../deps.js";
import { Canvas } from "./Canvas.js";
import { Panel1, Panel2, Panel3, Panel4 } from "./Panels.js";
import { UniverseCtx, FilterCtx } from "../context/index.js";
import { createStarData } from "../src/stars.js";
import { applyFilters } from "../src/filter.js";
import { createPlanetData, planetNamesList } from "../src/planets.js";
import { draw } from "../src/draw.js";

const files = [
  //fetch("/map/react/json/stars.json").then(v => v.json()),
  //fetch("/map/react/json/planets.json").then(v => v.json()),
  //fetch("/map/react/json/resources.json").then(v => v.json()),
  //fetch("/map/react/json/base.json").then(v => v.json())
  fetch("/json/stars.json").then(v => v.json()),
  fetch("/json/planets.json").then(v => v.json()),
  fetch("/json/resources.json").then(v => v.json()),
  fetch("/json/base.json").then(v => v.json()),
];

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { setUniverseData } = useContext(UniverseCtx); 
  const { filterData, setFilterData } = useContext(FilterCtx); 

  useEffect(() => {
    Promise.all(files)
      .then(([stars, planets, resources, baseBuild]) => {
      const { starMap, starList } = createStarData(stars);
      const newStarData = {
        starMap,
        stars: [...starMap.values()],
        starList: [...starList, ...planetNamesList(planets)],
      };
      const { resMaxFactorMap, resList } = createPlanetData(resources);
      const newPlanetData = {
        planets,
        resources,
        resList,
        resMaxFactorMap,
        baseBuild: new Map(baseBuild),
      };
      setUniverseData({ newStarData, newPlanetData });
      const filteredData = applyFilters({ planets, resources }, filterData);
      setFilterData(filteredData);
      setIsLoading(false);
    }).catch(e => console.error(e.message));
  }, []);

  return html`
    <${Fragment}>
      ${isLoading ? html`<div className="loader" />` : ""}
      <${Canvas}
        width="1700"
        height="1700"
        draw=${draw}
      />
      <div className="app">
       <${Panel1} isLoading=${isLoading} /> 
       <${Panel2} isLoading=${isLoading} /> 
       <${Panel3} isLoading=${isLoading} /> 
       <${Panel4} isLoading=${isLoading} /> 
      </div>
    <//>
    `
}

export default App;

