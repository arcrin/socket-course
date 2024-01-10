const os = require("os");
const io = require("socket.io-client");
const socket = io.connect("http://localhost:3000");

socket.on("connect", () => {
  console.log("connected to server");
})

const getCpuLoad = () => new Promise((resolve, reject) => {
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


const performanceLoadData = () => new Promise(async (resolve, reject) =>{
  const osType = os.type(); 

  const upTime = os.uptime();

  const freeMeme = os.freemem();

  const totalMem = os.totalmem();

  const usedMem = totalMem - freeMeme;
  const memUsage = Math.floor((usedMem / totalMem) * 100) / 100;

  const cpus = os.cpus(); // all cpus in an array
  const cpuType = cpus[0].model;
  const numCores = cpus.length;
  const cpuSpeed = cpus[0].speed;

  const cpuLoad = await getCpuLoad();
  resolve({
    freeMeme,
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