import { useContext, useRef, useEffect, html } from "../deps.js";
import {
  UniverseCtx,
  SelectStarsCtx,
  MapCtx,
  FilterCtx
} from "../context/index.js";
import { pathFinder } from "../src/map.js";

export const Canvas = ({ width, height, draw }) => {

  const { starData, planetData } = useContext(UniverseCtx);
  const { selectStarsData, setSelectStarsData } = useContext(SelectStarsCtx);
  const { mapData } = useContext(MapCtx);
  const { filterData } = useContext(FilterCtx);

  const { stars, starMap } = starData;
  const { currentStar, selectedStar, lastSelectedStar } = selectStarsData;
  const { scale, offsetX, offsetY } = mapData;

  const canvasRef = useRef();
  let paths = {};

  const handleMouseMove = (e) => {
    let bestFit;
    let distance;
    const bx = e.target.getBoundingClientRect();
    const x1 = (parseFloat(e.clientX - bx.left)/scale) - offsetX;
    const y1 = (parseFloat(e.clientY - bx.top)/scale) - offsetY;
    stars.forEach(star => {
      const d = Math.pow(star.x - x1, 2) + Math.pow(star.y - y1, 2);
      if (!bestFit) {
        bestFit = star;
        distance = d;
      } else if (d < distance) {
        bestFit = star;
        distance = d;
      }
    });
    setSelectStarsData({currentStar: bestFit });
  }

  const handleMouseDown = () => {
    setSelectStarsData({
      lastSelectedStar: selectedStar,
      selectedStar: currentStar
    });
  }

  useEffect(() => {                             
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d"); 
    let paths = {}; 
    if (Object.keys(lastSelectedStar).length && selectedStar) {
      paths = pathFinder(starMap, lastSelectedStar, selectedStar);
    }
    if (stars) {
      draw(
        ctx,
        starData,
        selectStarsData,
        filterData,
        planetData,
        paths,
        mapData);
    }
  });

  return html`
    <div className="canvas-container">
      <canvas
        ref=${canvasRef}
        width=${width}
        height=${height}
        onMouseMove=${handleMouseMove}
        onMouseDown=${handleMouseDown}
      />
    </div>
    `
};

