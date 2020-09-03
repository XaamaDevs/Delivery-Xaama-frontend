import socketio from "socket.io-client";

const socket = socketio("http://localhost:4000", {
  autoConnect: false,
});

function subscribeToNewUsers(subcribeFunction) {
  socket.on("new-user", subcribeFunction);
}

function connect() {
  socket.connect();

  socket.on("message", text => {
    console.log(text);
  })
}

function disconnect() {
  if (socket.connected) {
    socket.disconnect();
  }
}

export {
  connect,
  disconnect,
  subscribeToNewUsers,
};