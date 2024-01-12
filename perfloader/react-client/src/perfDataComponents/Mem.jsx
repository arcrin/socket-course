import { useRef } from "react";
import drawCircle from "../utilities/canvasLoadAnimation";

export const Mem = ({data}) => {
  const canvasEl = useRef();

  const totalMemInGB = (Math.floor(data.totalMem / 1073741824) * 100) / 100;
  const freeMemInGb = (Math.floor(data.freeMem / 1073741824) * 100) / 100;

  drawCircle(canvasEl.current, data.memUsage * 100);
  return (
    <div className="mem col-3">
      <h3>Mem Usage</h3>
      <div className="canvas-wrapper"> 
        <canvas ref={canvasEl} className="" width="200" height="200"></canvas>
        <div className="mem-text">{data.memUsage * 100}%</div>
      </div>
      <div>Total Mem: {totalMemInGB}GB</div>
      <div>Available Mem: {freeMemInGb}GB</div>
    </div>
  );
};
