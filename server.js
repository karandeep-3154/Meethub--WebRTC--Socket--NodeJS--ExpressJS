const express = require("express");
const {v4: uuidv4} = require('uuid')
//Create an Instance of Express Class
const app = express();
const server = require("http").Server(app);

app.set('view engine', 'ejs');
app.get("/", (req, res) => {
//   res.status(200).send("Welcome");

res.redirect(`/${uuidv4()}`);
});

app.get('/:room', (req, res)=> {
    res.render('room', {roomId: req.params.room});
})

server.listen(3030);
//Port at which Backend Server will listen is 3030
