const MAP_LARGE = 0.4;
const MAP_MEDIUM = 0.35;
const MAP_SMALL = 0.3;

let scale = MAP_MEDIUM;
let offsetX = 1400;
let offsetY = 1700;

export const sizeOptions = [
  { k: "Medium", v: MAP_MEDIUM },
  { k: "Small", v: MAP_SMALL },
  { k: "Large", v: MAP_LARGE },
];

export const defaultMapData = {
  scale,
  offsetX,
  offsetY,
  showCx: true,
  showPathfinder: false
};

const calcDistance = (star1, star2) => {
  return Math.sqrt(
    Math.pow(star2.x - star1.x,2) + 
    Math.pow(star2.y - star1.y,2) + 
    Math.pow(star2.z - star1.z,2))
}

export const pathFinder = (starMap, star1, star2) => {
  const openlist = {};
  const closedlist = {};
  const predecessors = {};
  const g = {}; // Sum of all edge lengths of a node from the origin
  openlist[star1.sysId] = 0;
  g[star1.sysId] = 0;

  const expandNode = (currentNode) => {
    starMap.get(currentNode).connections.forEach(c => {
      let successor = c.connection;
      if (closedlist[successor]) return;
      let tentative_g = g[currentNode] + c.distance;
      if (openlist[successor] && g[successor] && tentative_g >= g[successor]) return;
      predecessors[successor] = currentNode;
      g[successor] = tentative_g;
      // heuristic is flight line
      let f = tentative_g + calcDistance(star2, starMap.get(successor)); 
      openlist[successor] = f;
    });
  }

  while (Object.keys(openlist).length) {
    let f = 0;
    let currentNode;
    for (const [key, value] of Object.entries(openlist)) 
      if (!currentNode || value < f) {
        currentNode = key;
        f = value;
      }

    delete openlist[currentNode]; 
    if (currentNode == star2.sysId) {
      let list = [star2.sysId];
      let distance = 0;
      let predecessor = predecessors[star2.sysId];
      while (predecessor) {
        distance +=
          calcDistance(starMap.get(predecessor), starMap.get(list[list.length-1]));
        list.push(predecessor)
        predecessor = predecessors[predecessor];
      }
      const selectedPath = list;
      const selectedPathDistance = distance;
      return {selectedPath, selectedPathDistance};
    }
    closedlist[currentNode] = true;
    expandNode(currentNode);
  }
}


