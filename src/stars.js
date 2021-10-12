export const defaultStarData = {
  starMap: {},
  stars: [],
  starList: [],
  cx: ["OT-580", "UV-351", "VH-331", "ZV-307"],
};

export const defaultSelectStarsData = {
  currentStar: {},
  selectedStar: {},
  lastSelectedStar: {}
};

export const createStarData = (stars) => {
  const starMap = new Map();
  const starList = [];
  stars.forEach(star => {
    star.y *= -1;
    starMap.set(star.sysId, star);
    starList.push(star.natId);
    if (star.natId !== star.name) {
      starList.push(star.name);
    }
  });
  stars.forEach(star => {
    star.connections.forEach(c => {
      c.star = starMap.get(c.connection);
      c.distance = Math.sqrt(
        Math.pow(star.x - c.star.x, 2) 
        + Math.pow(star.y - c.star.y, 2)
        + Math.pow(star.z - c.star.z, 2)
      );
    });
  });
  return { starMap, starList }
}

export const starFromName = (starName, stars, planets) => {
  let text = starName.trim().toUpperCase();
  let selectedStar;

  if (!text) {
    console.log(
      "Star can be either XX-123, friendly name, or member planet friendly name");
    return;
  }

  if (text.charAt(2) == '-') {
    text = `${text.slice(0, 6)}`;
    selectedStar = stars.find(s => s.natId.toUpperCase() === text);
  } else {
    const planet = planets.find(p => p.name.toUpperCase() === text);
    if (planet) {
      selectedStar = stars.find(s => s.sysId === planet.sysId);
    } else {
      selectedStar = stars.find(s => s.name.toUpperCase() === text);
    }
  }

  if (!selectedStar) {
    console.log("Sorry -- I can't seem to find that");
    return;
  }

  return selectedStar;
}
