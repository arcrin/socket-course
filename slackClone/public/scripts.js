// const userName = prompt("What is your user name?");
// const passWord = prompt("What is your password?");
const userName = "ARC";
const passWord = "test";

// always join the main namespace, that's where the client gets the other namespaces
const socket = io("http://localhost:9000");
// const socket2 = io("http://localhost:9000/wiki");
// const socket3 = io("http://localhost:9000/mozilla");
// const socket4 = io("http://localhost:9000/linux");

// sockets will be put into this array, in the index of their ns.id
const nameSpaceSockets = [];
const listeners = {
  nsChange: [],
  messageToRoom: [],
};

// a global variable we can update when user clicks on a namespace
// we will use it to broadcast across the app (redux would be a better solution if we use React)
let selectedId = 0;

// add a submit handler for our form
document.querySelector("#message-form").addEventListener("submit", (event) => {
  // keep the browser from submitting
  event.preventDefault();
  // grab the value from the input box
  const newMessage = document.querySelector("#user-message").value;
  console.log(newMessage, selectedId);
  nameSpaceSockets[selectedId].emit("newMessageToRoom", {
    newMessage,
    date: Date.now(),
    avatar: "https://via.placeholder.com/30",
    userName,
    selectedNsId: selectedId
  });
  document.querySelector("#user-message").value = "";
});

// addListener's job is to manage all listeners added to all namespaces.
// this prevents listeners being added multiple times
const addListener = (nsId) => {
  if (!listeners.nsChange[nsId]) {
    nameSpaceSockets[nsId].on("nsChange", (data) => {
      console.log("Namespace change!");
      console.log(data);
    });
    listeners.nsChange[nsId] = true;
  }
  if (!listeners.messageToRoom[nsId]) {
    // add the nsId listener to this namespace!
    nameSpaceSockets[nsId].on("messageToRoom", (messageObj) => {
      console.log(messageObj);
      document.querySelector("#messages").innerHTML +=
        buildMessageHtml(messageObj);
    });
    listeners.messageToRoom[nsId] = true;
  }
};

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

    // initialize thisNs as its index in nameSpaceSockets
    // If the connection is nwe, this will be null
    // If the connection has already been established, it will reconnect and remain in its spot
    // let thisNs = nameSpaceSockets[ns.id];

    if (!nameSpaceSockets[ns.id]) {
      // There is no socket at this nsId. So, make a new connection!
      //  join this namespace with io()
      nameSpaceSockets[ns.id] = io(`http://localhost:9000${ns.endpoint}`);
    }
    addListener(ns.id);
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


