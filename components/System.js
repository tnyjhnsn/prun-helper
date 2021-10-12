import { useContext, html, Fragment } from "../deps.js";
import { UniverseCtx, SelectStarsCtx } from "../context/index.js";
import { PlanetDetails } from "./PlanetDetails.js";

export const System = () => {
  const { planetData: { planets, resources } } = useContext(UniverseCtx);
  const { selectStarsData: { selectedStar } } = useContext(SelectStarsCtx);

  const filterPlanets = planets.filter(p => p.sysId === selectedStar.sysId).sort();

  const handleHeadingClick = (e) => {
    e.preventDefault();
    let hidden = e.target.nextSibling.hidden;
    e.target.nextSibling.hidden = !hidden;
  };

  return html`
  <${Fragment}>
    ${ selectedStar.name ? html`
      <div>
        <h3>Planets/Resources in the ${selectedStar.name} System</h3>
        ${filterPlanets.map(planet => {
          const res = resources.filter(r => r.planet === planet.natId)
          return html`<${PlanetDetails}
            key=${planet.natId}
            planet=${planet}
            res=${res}
            headingClick=${handleHeadingClick}
            highlightEnv=${true}
          />`
        })}
      </div>
    ` : ""}
  <//>
  `
}

