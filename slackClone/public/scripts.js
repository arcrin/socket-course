// const userName = prompt("What is your user name?");
// const passWord = prompt("What is your password?");
const userName = "test";
const passWord = "test";

// always join the main namespace, that's where the client gets the other namespaces
const socket = io("http://localhost:9000");
// const socket2 = io("http://localhost:9000/wiki");
// const socket3 = io("http://localhost:9000/mozilla");
// const socket4 = io("http://localhost:9000/linux");

// sockets will be put into this array, in the index of their ns.id
const nameSpaceSockets = [];

socket.on("connect", () => {
  console.log("Connected!");
  socket.emit("clientConnect");
});

socket.on("welcome", (data) => {
  console.log(data);
});

// listen to nsList event from the server
socket.on("nsList", (nsData) => {
  const lastNs = localStorage.getItem("lastNs");
  console.log(nsData);
  const nameSpaceDiv = document.querySelector(".namespaces");
  nameSpaceDiv.innerHTML = "";
  nsData.forEach((ns) => {
    // update the HTML with each ns
    nameSpaceDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.image}" /></div>`;
    // join this namespace with io()
    const thisNs = io(`http://localhost:9000${ns.endpoint}`);
    thisNs.on("nsChange", (data) => {
      console.log("Namespace change!");
      console.log(data);
    });
  });

  Array.from(document.getElementsByClassName("namespace")).forEach(
    (element) => {
      console.log(element);
      element.addEventListener("click", (e) => {
        joinNs(element, nsData);
      });
    }
  );
  joinNs(document.getElementsByClassName("namespace")[0], nsData);
});
