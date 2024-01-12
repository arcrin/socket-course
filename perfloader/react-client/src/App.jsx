import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
// the connection from this module is only established once, regardless how many times ths module is imported
import socket from "./utilities/socketConnection";
import { Widget } from "./perfDataComponents/Widget";

function App() {
  const [performanceData, setPerformanceData] = useState({});
  useEffect(() => {
    socket.on("perfData", (data) => {
      // console.log(data);
      const copyPerfData = { ...performanceData };
      copyPerfData[data.macA] = data;
      setPerformanceData(copyPerfData);
    });
  }, []);

  const widgets = Object.values(performanceData).map((data) => <Widget data={data} key={data.macA} />);

  return (
    <div className="container">
      {widgets}
    </div>
  );
}

export default App;
