import { useContext, html } from "../deps.js";
import { UniverseCtx, FilterCtx } from "../context/ctx.js";
import { buildBase } from "../src/planets.js";

export const PlanetDetails = ({ planet, res, headingClick, highlightEnv }) => {

  const { planetData: { resMaxFactorMap, baseBuild } } = useContext(UniverseCtx);
  const {
    filterData: { filterEnv, planetsFiltered, selectedRes }
  } = useContext(FilterCtx);

  const name = `${planet.natId}
    ${planet.natId != planet.name ? `(${planet.name})` : ""}`

  const pFiltered =
    filterEnv && planetsFiltered.find(pf => pf.natId === planet.natId);

  const getRes = res.map((r,i) => {
    const type = `${r.type.charAt(0)}${r.type.slice(1).toLowerCase()}`;
    const conc = r.factor/resMaxFactorMap.get(r.ticker);
    const colour =
      conc >= 0.66 ? "conc-high" : conc >= 0.33 ? "conc-medium" : "conc-low";
    const [v1, v2, v3] = [
      Math.round(conc * 100),
      Math.round(r.factor * 100),
      Math.round(resMaxFactorMap.get(r.ticker) * 100),
    ];
    const filtered = highlightEnv && r.ticker === selectedRes ? "filtered" : "";
    return html`
      <li key=${i} className=${filtered}>${r.ticker} (${type})
        <span key=${i} className=${colour}> ${v1}% (${v2}/${v3})</span>
      </li>
    `
  });

  const getBase = buildBase(planet, baseBuild).map((mat,i) => 
          html`<li key=${i}>${mat.amount} x ${mat.ticker}</li>`);

  const cssSurface = `${planet.surface ? "fa-mountain" : "fa-wind"}`;
  const cssFiltered = `${highlightEnv && pFiltered ? "filtered" : ""}`
  const className = `fas ${cssSurface} ${cssFiltered}`;

  return html`
    <div className="icon-heading">
      <i className=${className} />
      <h4
        className="heading ${cssFiltered}"
        onClick=${headingClick}>
        ${name}
      </h4> 
      <ul className="base-build" hidden>
        ${getBase}
      </ul>
      <ul>
        ${getRes}
      </ul>
    </div>
  `
}

