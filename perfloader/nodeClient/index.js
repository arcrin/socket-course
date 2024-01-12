const os = require("os");
const io = require("socket.io-client");
const options = {
  auth: {
    token: "asklfjdhuijnvzcxvkjwaueiorouiojkl"
  },
}
const socket = io.connect("http://localhost:3000", options);

socket.on("connect", () => { 
  // console.log("connected to server");
  const nI = os.networkInterfaces(); // a list of all network interfaces
  let macA; // mac address
  for (let key in nI) {
    const isInternetFacing = !nI[key][0].internal;
    if (isInternetFacing) {
      macA = nI[key][0].mac;
      break;
    }
  }
  console.log(macA); 
  const perDataInterval = setInterval(async () => {
    const perfData = await performanceLoadData();
    perfData.macA = macA;
    socket.emit("perfData", perfData);
  }, 1000);
  socket.on("disconnect", () => {
    // if we disconnect for any reason, stop the interval. This includes reconnect
    clearInterval(perDataInterval);
  });
});

const getCpuLoad = () =>
  new Promise((resolve, reject) => {
    const start = cpuAverage();
    setTimeout(() => {
      const end = cpuAverage();
      const idleDiff = end.idle - start.idle;
      const totalDiff = end.total - start.total;
      // console.log(idleDiff, totalDiff);
      const percentageCpu = 100 - Math.floor((100 * idleDiff) / totalDiff);
      resolve(percentageCpu);
    }, 100);
  });

const performanceLoadData = () =>
  new Promise(async (resolve, reject) => {
    const osType = os.type();

    const upTime = os.uptime();

    const freeMem = os.freemem();

    const totalMem = os.totalmem();

    const usedMem = totalMem - freeMem;
    const memUsage = Math.floor((usedMem / totalMem) * 100) / 100;

    const cpus = os.cpus(); // all cpus in an array
    const cpuType = cpus[0].model;
    const numCores = cpus.length;
    const cpuSpeed = cpus[0].speed;

    const cpuLoad = await getCpuLoad();
    resolve({
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
    });
  });

function cpuAverage() {
  const cpus = os.cpus();
  let idleMs = 0; // idle milliseconds
  let totalMs = 0; // total milliseconds

  cpus.forEach((aCore) => {
    for (mode in aCore.times) {
      totalMs += aCore.times[mode];
    }
    idleMs += aCore.times.idle;
  });
  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length,
  };
}

// const run = async () => {
//   const data = await performanceLoadData();
//   console.log(data);
// }
// run();
