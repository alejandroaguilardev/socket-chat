const { userConnected, userDisconnected, getUsers, saveMessage } = require("../controllers/socket");
const { validateSocketJWT } = require("../helpers/jwt");

class Sockets {
	constructor(io) {
		this.io = io;

		this.socketEvents();
	}

	socketEvents() {
		// On connection
		this.io.on("connection", async (socket) => {
			const [isValid, uid] = validateSocketJWT(socket.handshake.query["x-token"]);

			if (!isValid) {
				console.log("socket no autorizado");
				return socket.disconnect();
			}

			const user = await userConnected(uid);
			
			//Create Sala
			socket.join(uid);

			socket.on("message-person", async(payload)=> {
				const message = await saveMessage(payload);
				this.io.to(payload.to).emit('message-person', message);
				this.io.to(payload.from).emit('message-person', message);
			});
			
			//TODO emitir todos los usuarios conectados
			//TODO Escuchar cuando el cliente manda u nmensaje
			//TODO Disconnect
			//TODO emitir todos los usuarios conectados
			
			
			this.io.emit("list-user", await getUsers());

			socket.on("disconnect", async () => {
				await userDisconnected(uid);
				setTimeout(async () => {
					this.io.emit("list-user", await getUsers());
				}, 500);
			});
		});
	}
}

module.exports = Sockets;
