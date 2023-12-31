const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');

const {Server} = require('socket.io');
// const { cursorSlice } = require('../convey-app/src/CursorOverlay/cursorSlice');
const server = http.createServer(app);

app.use(cors());

let elements = [];

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// events 
io.on('connection', (socket) => {
    console.log('user connected');
    io.to(socket.id).emit('whiteboard-state', elements);

    socket.on('element-update', (elementData) => {
        updateElementInElements(elementData);

        socket.broadcast.emit('element-update', elementData);
    })

    socket.on('whiteboard-clear', () => {
        // emptying the serverside storage of elements(in our case wlwmwnts array)
        elements = [];
        
        socket.broadcast.emit('whiteboard-clear');
    })

    socket.on('cursor-position', (cursorData) => {
        socket.broadcast.emit("cursor-position", {
            ...cursorData,
            userId: socket.id,
        });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', socket.id);
    });
});

app.get('/', (req, res) => {
    res.send("server is working");
});

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
    console.log("server is running on port", PORT);
})

const updateElementInElements = (elementData) => {
    const index = elements.findIndex(element => element.id === elementData.id);
    
    if(index === -1) return elements.push(elementData);

    elements[index] = elementData;
}