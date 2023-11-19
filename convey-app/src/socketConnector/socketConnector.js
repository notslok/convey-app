import {io} from 'socket.io-client';
import { store } from '../store/store';
import { setElements, updateElement } from '../Whiteboard/WhiteboardSlice';

let socket;
export const connectWithSocketServer = () => {
    socket = io("http://localhost:3003");

    socket.on("connect", () => {
        console.log("connected to websocket server");
    });

    socket.on('whiteboard-state', elements => {
        store.dispatch(setElements(elements));
    });

    socket.on('element-update', (elementData) => {
        store.dispatch(updateElement(elementData));
    })
}

export const emitElementUpdate = (elementData) => {
    socket.emit("element-update", elementData);
}