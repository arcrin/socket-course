import { Cpu } from "./Cpu";
import { Mem } from "./Mem";
import { Info } from "./Info";
import "./Widget.css";
import socket from "../utilities/socketConnection";
import { useEffect, useState } from "react";

export const Widget = ({ data }) => {
  const [isAlive, setIsAlive] = useState(true);
  const {
    freeMem,
    totalMem,
    usedMem,
    memUsage,
    osType,
    upTime,
    cpuType,
    numCores,
    cpuSpeed,
    cpuLoad,
  } = data;

  const cpuData = { cpuLoad };
  const memData = { totalMem, usedMem, memUsage, freeMem };
  const infoData = {
    macA: data.macA,
    osType,
    upTime,
    cpuType,
    cpuSpeed,
    numCores,
  };

  const notAliveDiv = !isAlive ? <div className="not-active">Offline</div> : <></>
  
  useEffect(() => {
    socket.on("connectedOrNot", ({ isAlive, machineMacA }) => {
      if (machineMacA === data.macA) {
        setIsAlive(isAlive);
      }
    });
  });


  return (
    <div className="widget row justify-content-evenly">
      {notAliveDiv}
      <Cpu data={cpuData} />
      <Mem data={memData} />
      <Info data={infoData} />
    </div>
  );
};
