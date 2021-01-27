import socketio from "socket.io-client";

const socket = socketio(process.env.REACT_APP_API_URL, {
	autoConnect: false,
});


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
	subscribeToNewOrders,
	subscribeToDeleteOrders,
	subscribeToUpdateOrders,
};