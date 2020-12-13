const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = 4021;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

const recipes = [{
  name: 'Salat',
  imageUrl: 'https://cdn.pixabay.com/photo/2019/08/26/16/17/salad-4432168__340.jpg',
  ingredients: ['Gurken', 'Tomaten', 'Eier', 'Feta Käse', 'Olivenöl'],
  steps: [
    'Gurke in Scheiben schneiden',
    'Tomaten in Scheiben schneiden',
    'Eier hinzufügen',
    'In einer Schüssel mischen',
    'Olivenöl hinzufügen und genießen!'
  ]
}, {
  name: 'Spaghetti',
  imageUrl: 'https://cdn.pixabay.com/photo/2019/10/13/14/23/spaghetti-bolognese-4546233__340.jpg',
  ingredients: ['Die Pasta', 'Tomatensauce', 'Der Käse'],
  steps: [
    'Die Nudeln 10 Minuten kochen lassen',
    'Tomatensauce hinzufügen',
    'Käse hinzufügen und genießen!',
  ]
}];




io.on("connection", (socket) => {
  console.log('new connection!');
  socket.emit('recipes', recipes);
  socket.on('select', (data) => {
    if (data && data.value) {
      socket.broadcast.emit('selected', data.value);
    }
  });

  socket.on('select-step', (data) => {
    if (data && data.value != null) {
      socket.broadcast.emit('selected-step', data.value);
    }
  });

});

server.listen(port, () => console.log(`Listening on port ${port}`));