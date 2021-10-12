import { html }  from "../deps.js";

export const Checkbox = ({ name, label, checked, onChange, rest }) => {
  return html`
    <label htmlFor=${name}>
      <input
        type="checkbox"
        name=${name}
        checked=${checked}
        onChange=${onChange}
        ${rest}
      />
      ${label}
    </label>
  `
}

export const Dropdown = ({ name, label, position, onChange, options, rest }) => {
  return html`
    <label htmlFor=${name}>
      ${position === "L" ? label : ""} 
      <select
        name=${name}
        onChange=${onChange}
        ${rest}
      >
        ${options.map((o,i) =>
          html`<option key=${i} value=${o.v}>${o.k}</option>`)}
      </select>
      ${position === "R" ? label : ""} 
    </label>
  `
}

