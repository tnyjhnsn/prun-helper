import { ReactDOM, html } from "./deps.js";
import App from "./components/App.js";
import { UniverseProvider } from "./context/UniverseCtx.js";
import { SelectStarsProvider } from "./context/SelectStarsCtx.js";
import { MapProvider } from "./context/MapCtx.js";
import { FilterProvider } from "./context/FilterCtx.js";

const rootElement = document.getElementById("root");

ReactDOM.render(
  html`
    <${UniverseProvider}>
      <${SelectStarsProvider}>
        <${MapProvider}>
          <${FilterProvider}>
            <${App} />
          </${FilterProvider}>
        </${MapProvider}>
      </${SelectStarsProvider}>
    </${UniverseProvider}>
  `,
  rootElement
);

