const joinRoom = async (roomTitle, namespaceId) => {
  console.log(roomTitle, namespaceId);
  ackResp = await nameSpaceSockets[namespaceId].emitWithAck("joinRoom", {
    roomTitle,
    namespaceId,
  });
  document.querySelector(
    ".curr-room-num-users"
  ).innerHTML = `${ackResp.numUsers}<span class="fa-solid fa-user"></span>`;
  document.querySelector(".curr-room-text").innerHTML = roomTitle;

  document.querySelector("#messages").innerHTML = "";

  ackResp.thisRoomHistory.forEach((messageObj) => {
    document.querySelector("#messages").innerHTML +=
      buildMessageHtml(messageObj);
  });

  // nameSpaceSockets[namespaceId].emit("joinRoom", roomTitle, (ackResp) => {
  //   console.log(ackResp);

  //   document.querySelector(".curr-room-num-users").innerHTML = `${ackResp.numUsers}<span class="fa-solid fa-user"></span>`
  //   document.querySelector(".curr-room-text").innerHTML = roomTitle;
  // });
};
