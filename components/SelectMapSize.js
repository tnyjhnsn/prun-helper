import { useContext, html } from "../deps.js";
import { MapCtx } from "../context/index.js";
import { sizeOptions } from "../src/map.js";
import { Dropdown } from "../src/utils.js";

export const SelectMapSize = () => {
  const { setMapData } = useContext(MapCtx);

  return html`
    <div className="map-control">
      <${Dropdown}
        className="map-size"
        name="map-size"
        label="Map size:"
        position="L"
        onChange=${e => setMapData({ scale: e.target.value })}
        options=${sizeOptions}
      />
    </div>
  `
}
