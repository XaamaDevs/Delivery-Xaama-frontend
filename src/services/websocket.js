import socketio from "socket.io-client";

const socket = socketio("http://localhost:4000", {
	autoConnect: false,
});

function subscribeToNewUsers(subcribeFunction) {
	socket.on("new-user", subcribeFunction);
}

function subscribeToDeleteUsers(subcribeFunction) {
	socket.on("delete-user", subcribeFunction);
}

function subscribeToNewOrders(subcribeFunction) {
	socket.on("new-order", subcribeFunction);
}

function connect() {
	socket.connect();
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
  subscribeToNewOrders,
  subscribeToDeleteUsers,
};