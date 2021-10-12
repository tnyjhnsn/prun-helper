import { html, Fragment } from "../deps.js";

export const Logo = ({ isLoading }) => {

  const loadingText = html`<h3>Calculating Star and Planet data. Please wait...</h3>`

  return html`
    <${Fragment}>
      <div className="logo">
        <h1>Plexucra<span className="cc">.de</span></h1>
        <span className="byline">Tools for the Galactic CEO</span>
      </div>
      ${isLoading ? loadingText : ""}
    <//>
  `
}
