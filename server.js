require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);
// Peer

const { ExpressPeerServer } = require("peer");

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/peerjs", peerServer);

app.get("/meeting", (req, rsp) => {
  rsp.redirect(`/${uuidv4()}`);
});

app.get("/waiting-room", (req, rsp) => {
  rsp.render("waitingroom");
  
});


app.get("/", (req, rsp) => {
  rsp.render("homerandom");
});


app.get("/:room", (req, res) => {
  
   res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
    console.log(userId)

    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });
  });
});

const port=process.env.PORT || 3000;
server.listen(port,()=>{
  console.log("server connected");
});
// "devstart": "nodemon server.js"