import { useContext, html, Fragment } from "../deps.js";
import { PlanetDetails } from "./PlanetDetails.js";
import {
  UniverseCtx,
  SelectStarsCtx,
  FilterCtx
} from "../context/index.js";
import { starFromName } from "../src/stars.js";

const TOP_HIT_LIMIT = 8;

export const Diagnostics = () => {

  const {
    starData: { stars },
    planetData,
    planetData: { planets, resMaxFactorMap, baseBuild }
  } = useContext(UniverseCtx);

  const { filterData: {
    filterEnv,
    selectedRes,
    planetsFiltered,
    starsFilterMap,
    planetResCounter,
    resourcesFiltered
  }} = useContext(FilterCtx);

  const {
    selectStarsData: { selectedStar },
    setSelectStarsData
  } = useContext(SelectStarsCtx);
  
  let text = "";

  if (filterEnv) {
    if (selectedRes === "0") {
      text = `Filter: ${planetsFiltered.length} Planets, ${starsFilterMap.size} Star Systems`
    } else {
      text = `Filter: ${planetResCounter} Planets, ${starsFilterMap.size} Star Systems with ${selectedRes} resources`;
    }
  } else {
    if (selectedRes === "0") {
      text = `Filter: ${planetsFiltered.length} Planets, ${starsFilterMap.size} Star Systems`
    } else {
      text = `Filter: ${planetResCounter} Planets, ${starsFilterMap.size} Star Systems with ${selectedRes} resources`;
    }
  }

  const handleHeadingClick = (e, name) => {
    e.preventDefault();
    const selectedStar =
      starFromName(name, stars, planets);
    if (selectedStar) setSelectStarsData({ selectedStar });
  };

  const listHits = () => {
    resourcesFiltered.sort((a,b) => b.factor - a.factor);
    const topHits = resourcesFiltered.slice(0, TOP_HIT_LIMIT);

    return html`
      <${Fragment}>
        ${resourcesFiltered.length > TOP_HIT_LIMIT 
          ? html`<h3>Top ${TOP_HIT_LIMIT} Hits from the Filter</h3>`
          : ""}
        ${topHits.map(res => {
          const planet = planetsFiltered.find(pf => pf.natId === res.planet);
          return html`<${PlanetDetails}
            key=${planet.natId}
            planet=${planet}
            res=${[res]}
            headingClick=${e => handleHeadingClick(e, planet.name)}
            highlightEnv=${false}
          />`
        })}
      <//>
    `
  };

  const style = {
    margin: "0.5rem 0",
  }

  return html`
    <div className="diagnostics">
      <div style=${style}>
        ${text}
      </div>
      ${resourcesFiltered.length && selectedRes !== "0"
        ? listHits() : "" }
    </div>
  `
}
