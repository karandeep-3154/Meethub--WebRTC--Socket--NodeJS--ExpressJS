const express = require("express");
const { v4: uuidv4 } = require("uuid");
//Create an Instance of Express Class
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");

app.set("view engine", "ejs");
app.use(express.static("public"));

const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use("/peerjs", peerServer);

app.get("/", (req, res) => {
  //   res.status(200).send("Welcome");

  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);
  });
});
/* The selected code is an event listener for the "join-room" event. When a client emits a "join-room" event, the event listener will execute the code inside the curly braces.*/

server.listen(3030);
//Port at which Backend Server will listen is 3030
