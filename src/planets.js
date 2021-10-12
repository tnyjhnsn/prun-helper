export const defaultPlanetData = {
  planets: [],
  resources: [],
  resList: [],
  resMaxFactorMap: {},
  baseBuild: {},
};

export const createPlanetData = (resources) => {
  const resMaxFactorMap = new Map();
  resources.forEach(res => {
    resMaxFactorMap.set(
      res.ticker,
      Math.max(resMaxFactorMap.get(res.ticker) ?? 0, res.factor)
    );
  });
  const resList = [...resMaxFactorMap.keys()].sort()
  return { resMaxFactorMap, resList };
}

export const planetNamesList = (planets) => {
  const list = [];
  planets.forEach(planet => {
    if (planet.natId !==planet.name) {
      list.push(planet.name);
    }
  });
  return list;
}

import {
  GRAVITY_LOW,
  GRAVITY_HIGH,
  TEMP_LOW,
  TEMP_HIGH,
  PRESSURE_LOW,
  PRESSURE_HIGH
} from "./filter.js";

export const buildBase = (p, baseBuild) => {
  let base = [
    ...baseBuild.get("base"),
    ...baseBuild.get(p.surface ? "rocky" : "gaseous"),
  ];

  const gravity = p.gravity < GRAVITY_LOW 
    ? "lowGravity" : p.gravity > GRAVITY_HIGH ? "highGravity" : 0;
  const temp = p.temp < TEMP_LOW 
    ? "lowTemp" : p.temp > TEMP_HIGH ? "highTemp" : 0;
  const pressure = p.pressure < PRESSURE_LOW 
    ? "lowPressure" : p.pressure > PRESSURE_HIGH ? "highPressure" : 0;

  [gravity, temp, pressure].forEach(env => {
    if (env) base = [...base, ...baseBuild.get(env)];
  });

  return base;
}

