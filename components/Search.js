import { html, useState, useContext } from "../deps.js";
import { UniverseCtx, SelectStarsCtx } from "../context/index.js";
import { starFromName } from "../src/stars.js";

export const Search = () => {
  const [starName, setStarName] = useState({})
  const { starData, planetData, starList } = useContext(UniverseCtx);
  const { setSelectStarsData } = useContext(SelectStarsCtx);

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedStar =
      starFromName(starName, starData.stars, planetData.planets);
    if (selectedStar) setSelectStarsData({ selectedStar });
  }

  return html`
    <div className="search-input">
      <form onSubmit=${handleSubmit}>
        <label htmlFor="search">Star search</label>
        <input 
          className="search"
          list="star-list"
          type="text"
          name="search"
          onChange=${e => setStarName(e.target.value)}
        ></input>
        <datalist id="star-list">
          ${starData.starList.map(o =>
            html`<option key=${o} value=${o}></option>`)}
        </datalist>
        <input type="submit" className="search-submit" value="Go"></input>
        <div className="error"></div>
      </form>
    </div>
  `
}

