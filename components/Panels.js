import { html, Fragment } from "../deps.js";
import { Logo } from "./Logo.js";
import { SelectMapSize } from "./SelectMapSize.js";
import { Search } from "./Search.js";
import { Filter } from "./Filter.js";
import { System } from "./System.js";
import { Diagnostics } from "./Diagnostics.js";

const Panel = ({ className, children }) => {
  return html`
    <div className=${className}>
      <div className="sticky">
        ${children}
      </div>
    </div>
  `
}

export const Panel1 = ({ isLoading }) => {
  return html`
    <${Panel} className="panel1">
      <${Logo} isLoading=${isLoading} />
      ${!isLoading ? html`<${SelectMapSize} />` : ""}
    </${Panel}>
  `
}

export const Panel2 = ({ isLoading }) => {
  return html`
    <${Panel} className="panel2">
      ${!isLoading ? html`<${Search} />` : ""}
    </${Panel}>
  `
}

export const Panel3 = ({ isLoading }) => {
  return html`
    <${Panel} className="panel3">
      ${!isLoading ? html`<${Filter} />` : ""}
      ${!isLoading ? html`<${Diagnostics} />` : ""}
    </${Panel}>
  `
}

export const Panel4 = ({ isLoading }) => {
  return html`
    <${Panel} className="panel4">
      ${!isLoading ? html`<${System} />` : ""}
    </${Panel}>
  `
}

