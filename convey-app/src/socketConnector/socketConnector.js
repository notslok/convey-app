import {io} from 'socket.io-client';
import { store } from '../store/store';
import { setElements, updateElement } from '../Whiteboard/WhiteboardSlice';
import { cursorPositions } from '../constants';
import { updateCursorPosition, removeCursorPosition } from '../CursorOverlay/cursorSlice';

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

    socket.on('whiteboard-clear', () => {
        // dispatching the action of clearing element state from redux store on frontend side
        store.dispatch(setElements([]));
    })

    socket.on("cursor-position", (cursorPositions) => {
        store.dispatch(updateCursorPosition(cursorPositions));
    })

    socket.on("user-disconnected", (disconnectedUserId) => {
        store.dispatch(removeCursorPosition(disconnectedUserId));
    })
    
}

export const emitElementUpdate = (elementData) => {
    socket.emit("element-update", elementData);
}

export const emitWhiteboardClear = () => {
    socket.emit("whiteboard-clear");
}

export const emitCursorPosition = (cursorData) => {
    socket.emit("cursor-position", cursorData);
}