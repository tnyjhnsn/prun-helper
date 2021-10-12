import { useContext, html, Fragment } from "../deps.js";
import { Checkbox, Dropdown } from "../src/utils.js";
import {
  UniverseCtx,
  MapCtx,
  FilterCtx
} from "../context/index.js";
import { applyFilters } from "../src/filter.js";

const surfaceOptions = ["Rocky", "Gaseous", "Both"].map(o => ({ k: o, v: o }));
const envOptions = ["Normal", "Low", "High", "Ignore"].map(o => ({ k: o, v: o }));
const resOptions = (list) => {
  const options = list.map(o => ({ k: o, v: o }));
  options.unshift({ k: "- None -", v: "0" });
  return options;
};

const envFilters = [
  ["surface", "Surface", surfaceOptions],
  ["gravity", "Gravity", envOptions],
  ["temp", "Temperature", envOptions],
  ["pressure", "Pressure", envOptions],
];

export const Filter = () => {

  const {
    mapData: { showCx, showPathfinder },
    setMapData
  } = useContext(MapCtx);
  const { planetData, planetData: { resList } } = useContext(UniverseCtx);
  const {
    filterData,
    filterData: { filterEnv, incNormal },
    setFilterData
  } = useContext(FilterCtx);

  const handleFilterData = data => {
    const newData = { ...filterData, ...data };
    const filteredData = applyFilters(planetData, newData);
    setFilterData({ ...newData, ...filteredData });
  };

  const mapChecks = [
    ["showCx", "Show CXs", showCx],
    ["showPathfinder", "Show Pathfinder", showPathfinder],
  ];

  return html`
    <${Fragment}>
      ${mapChecks.map((c,i) => {
        return html` 
          <div key=${i}>
            <${Checkbox} 
              name=${c[0]}
              label=${c[1]}
              checked=${c[2]}
              onChange=${e => setMapData({ [e.target.name]: e.target.checked })}
            />
          </div>
        `
      })}
      <${Checkbox} 
        name="filterEnv"
        label="Include environment filter"
        checked=${filterEnv}
        onChange=${e => handleFilterData({ [e.target.name]: e.target.checked })}
      />
      <div className="environment-filter" hidden=${!filterEnv}>
        Environment filter
        <div>
          ${envFilters.map((f,i) => {
            return html` 
              <div key=${i}>
                <${Dropdown}
                  name=${f[0]}
                  label=${f[1]}
                  position="R"
                  options=${f[2]}
                  onChange=${e => handleFilterData(
                    { [e.target.name]: e.target.value }
                  )}
                />
              </div>
            `
          })}
          <div className="inc-normal">
            <${Checkbox} 
              name="incNormal"
              label="Include Normal with Low and High"
              checked=${incNormal}
              onChange=${e => handleFilterData(
                { [e.target.name]: e.target.checked }
              )}
            />
          </div>
        </div>
      </div>
      <div className="resource-filter">
        <${Dropdown}
          name="selectedRes"
          label="Include resource filter:"
          position="L"
          onChange=${e => handleFilterData({ [e.target.name]: e.target.value })}
          options=${resOptions(resList)}
        />
      </div>
    <//>
  `
}

