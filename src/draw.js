const drawStarCircle = (ctx, x, y, size, color, style) => {
  switch (style) {
    case "filled":
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      break;
    case "halo":
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      for (let i=0; i<4; i++) {
        ctx.beginPath();
        ctx.arc(x, y, size * 2, (0.1+(0.5*i)) * Math.PI, (0.4+(0.5*i)) * Math.PI);
        ctx.stroke();
      }
      break;
    case "cx":
      ctx.lineWidth = 2;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.stroke();
      break;
    default:
      break;
  }
}

export const draw = (
    ctx,
    { starMap, stars, cx },
    { currentStar, selectedStar, lastSelectedStar },
    { filterEnv, selectedRes, starsFilterMap }, 
    { resMaxFactorMap },
    { selectedPath, selectedPathDistance },
    { scale, offsetX, offsetY, showCx, showPathfinder }
  ) => {

  const width = ctx.canvas.clientWidth;
  const height = ctx.canvas.clientHeight;

  // star colours
  const C_PINPOINT = "rgba(69,90,100,1.0)";
  const C_ENV_ONLY = "rgba(76,175,80,1.0)";
  const C_PATH = "rgba(255,255,255,0.6)";
  const C_LAST_STAR_HALO = "rgba(233,30,99,1.0)";
  const C_SELECTED_STAR_HALO = "rgba(255,235,59,1.0)";
  const C_CURRENT = "#2196f3";

  // star sizes
  const S_PINPOINT = 5;
  const S_SMALL = 8;
  const S_LARGE = 10;

  ctx.restore();
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(offsetX, offsetY);

  ctx.clearRect(0 - offsetX, 0 - offsetY, width/scale, height/scale);

  stars.forEach(star => {

    const isCurrentStar = currentStar && star.natId === currentStar.natId;
    const isSelectedStar = selectedStar && star.natId === selectedStar.natId;
    const isLastSelectedStar =
        lastSelectedStar && star.natId === lastSelectedStar.natId;

    const x = Math.round(star.x);
    const y = Math.round(star.y);

    // draw cx
    if (showCx && cx.includes(star.natId)) {
      drawStarCircle(ctx, x, y, 17, C_LAST_STAR_HALO, "cx");
    }

    // draw env and res stars
    if (starsFilterMap.has(star.natId)) {
      if (selectedRes !== "0") {
        const conc = starsFilterMap.get(star.natId)/resMaxFactorMap.get(selectedRes);
        const colour = conc >= 0.66 ? "#4caf50" : conc >= 0.33 ? "#ff9800" : "#f44336";
        drawStarCircle(ctx, x, y, S_LARGE, colour, "filled");
      } else {
        if (filterEnv) {
          drawStarCircle(ctx, x, y, S_LARGE, C_ENV_ONLY,"filled");
        } else {
          drawStarCircle(ctx, x, y, S_PINPOINT, C_PINPOINT,"filled");
        }
      }
    } else {
        drawStarCircle(ctx, x, y, S_PINPOINT, C_PINPOINT,"filled");
    }

    // highlight and label selected star
    if(isSelectedStar) {

      drawStarCircle(ctx, x, y, S_LARGE, C_SELECTED_STAR_HALO, "halo");

      const showDist = showPathfinder && selectedPathDistance;
      const pc = selectedPathDistance ? Math.round(selectedPathDistance/12.0) : 0;
      const cost = Math.round(pc * 2.16);
      const d = `${showDist ? ` Distance: ${pc}pc FF: ${cost}` : ""}`;
      const s = `${star.name} (Type ${star.type})${d}`;

      ctx.beginPath();
      ctx.font = "40px 'Open Sans'";
      ctx.fontWeight = 300;
      ctx.fillStyle = "rgba(255,255,255,1.0)";
      ctx.fillText(s, x + 20, y - 15);
      ctx.fill();

      ctx.fillStyle = "rgba(158,158,158,0.15)";
      ctx.fillRect(x + 5, y - 70, ctx.measureText(s).width + 30, 80);
      ctx.fill();
      
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.strokeRect(x+5, y - 70, ctx.measureText(s).width + 30, 80);
      ctx.stroke();
    }

    // highlight and paths from current star
    if (isCurrentStar) {
      drawStarCircle(ctx, x, y, S_SMALL, C_CURRENT,"filled");
      star.connections.forEach(c => {
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(c.star.x, c.star.y);
        const grd = ctx.createLinearGradient(
          star.x, star.y, c.star.x, c.star.y);
        grd.addColorStop(0, "rgba(255,255,255,0.0)");
        grd.addColorStop(0.3, "rgba(255,255,255,0.9)");
        grd.addColorStop(0.7, "rgba(255,255,255,0.9)");
        grd.addColorStop(1, "rgba(255,255,255,0.0)");
        ctx.strokeStyle = grd;
        ctx.stroke();
      });     
    };

    // label last selected star
    if (showPathfinder && isLastSelectedStar && !isSelectedStar) {
      drawStarCircle(ctx, x, y, S_LARGE, C_LAST_STAR_HALO, "halo");
    };

    // draw pathfinder
    if (showPathfinder && selectedPath && selectedPath[0] == star.sysId) {
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(starMap.get(selectedPath[0]).x,
        starMap.get(selectedPath[0]).y);
      selectedPath.forEach(systemId => {
        if (selectedPath[systemId] !== star.sysId)
          ctx.lineTo(starMap.get(systemId).x, starMap.get(systemId).y);
      }); 
      ctx.strokeStyle = C_PATH;
      ctx.stroke();
    }

    // label currentStar
    if (isCurrentStar && !isSelectedStar) {
      ctx.beginPath();
      ctx.font = "40px 'Open Sans'";
      ctx.fontWeight = 300;
      ctx.fillStyle = "rgba(255,255,255,1.0)";
      ctx.fillText(star.name, x + 20, y - 15);
      ctx.fill();
    }
  
  });
}
