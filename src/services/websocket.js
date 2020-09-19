import socketio from "socket.io-client";

// Importing backend api
import api from "./api";

const socket = socketio("http://localhost:4000", {
	autoConnect: false,
});

function subscribeToNewUsers(subcribeFunction) {
	socket.on("new-user", subcribeFunction);
}

function subscribeToUpdateUsers(subcribeFunction) {
	socket.on("update-user", subcribeFunction);
}

function subscribeToDeleteUsers(subcribeFunction) {
	socket.on("delete-user", subcribeFunction);
}

function subscribeToNewOrders(subcribeFunction) {
	socket.on("new-order", subcribeFunction);
}

function subscribeToDeleteOrders(subcribeFunction) {
	socket.on("delete-order", subcribeFunction);
}

function subscribeToUpdateOrders(subcribeFunction) {
	socket.on("update-order", subcribeFunction);
}

function connect() {
	socket.connect();
}

async function disconnect() {
  if (socket.connected) {  
    socket.disconnect();
  }
}

export {
	connect,
	disconnect,
  subscribeToNewUsers,
  subscribeToNewOrders,
  subscribeToDeleteUsers,
  subscribeToDeleteOrders,
  subscribeToUpdateUsers,
  subscribeToUpdateOrders,
};