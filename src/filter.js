export const GRAVITY_LOW = 0.25;
export const GRAVITY_HIGH = 2.5;
export const TEMP_LOW = -25;
export const TEMP_HIGH = 75;
export const PRESSURE_LOW = 0.25;
export const PRESSURE_HIGH = 2.0;

export const defaultFilterData = {
  filterEnv: true,
  incNormal: true,
  surface: "Rocky",
  gravity: "Normal",
  temp: "Normal",
  pressure: "Normal",
  selectedRes: "0",
  planetsFiltered: [],
  planetResCounter: 0,
  resourcesFiltered: [],
  starsFilterMap: new Map()
};

const checkRange = (check, min, max) => min <= check && check <= max; 

const checkExtremes = (p, filter, min, max, incNormal) => {
  const isLow = filter === "Low";
  const isNormal = filter === "Normal";
  const isHigh = filter === "High";
  return isLow || isHigh
  ? (isLow && p < (incNormal ? max : min)) || (isHigh && p > (incNormal ? min :  max))
  : isNormal ? checkRange(p, min, max) : true;
}

const checkGravityExtremes = (p, filter, incNormal) => {
  return checkExtremes(
    p.gravity, filter, GRAVITY_LOW, GRAVITY_HIGH, incNormal);
}

const checkTempExtremes = (p, filter, incNormal) => {
  return checkExtremes(
    p.temp, filter, TEMP_LOW, TEMP_HIGH, incNormal);
}

const checkPressureExtremes = (p, filter, incNormal) => {
  return checkExtremes(
    p.pressure, filter, PRESSURE_LOW, PRESSURE_HIGH, incNormal);
}

export const applyFilters = (
  { planets, resources },
  { filterEnv,
    incNormal,
    surface,
    gravity,
    temp,
    pressure,
    selectedRes,
  }) => {

  let planetsFiltered = [];
  const starsFilterMap = new Map();

  const isRocky = surface === "Rocky";
  const isGaseous = surface === "Gaseous";
  let planetResCounter = 0;
  let resourcesFiltered = [];

  if (filterEnv) {
    planetsFiltered = planets.filter(p => {
      return isRocky || isGaseous
      ? (p.surface && isRocky) || (!p.surface && isGaseous)
      : p;
    }).filter(p => checkGravityExtremes(p, gravity, incNormal))
      .filter(p => checkTempExtremes(p, temp, incNormal))
      .filter(p => checkPressureExtremes(p, pressure, incNormal));
  } else {
    planetsFiltered = planets
  }

  if (selectedRes == 0) {
    planetsFiltered.forEach(pf => {
      const name = pf.natId.substring(0,6);
      starsFilterMap.set(name, 0);
    });
  } else {
    planetsFiltered.forEach(pf => {
      resources
        .filter(res => res.ticker === selectedRes && res.planet === pf.natId)
        .forEach(res => {
          resourcesFiltered.push(res);
          planetResCounter += 1;
          const name = res.planet.substring(0,6);
          starsFilterMap.set(name, Math.max(starsFilterMap.get(name) ?? 0, res.factor));
        });
    });
  }

  return { planetsFiltered, starsFilterMap, planetResCounter, resourcesFiltered };
}
