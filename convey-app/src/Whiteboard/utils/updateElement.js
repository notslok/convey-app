import { createElement } from "./createElement";
import { toolTypes } from "../../constants";
import {store} from "../../store/store";
import { setElements } from "../WhiteboardSlice";
import { emitElementUpdate } from "../../socketConnector/socketConnector";

export const updateElement = ({id, x1, x2, y1, y2, type, index}, elements) => {
    const elementsCopy = [...elements];

    switch(type){
        case toolTypes.RECTANGLE:
            const updatedElement = createElement({
                id,
                x1,
                y1,
                x2,
                y2,
                toolType: type,
            });

            elementsCopy[index] = updatedElement;

            store.dispatch(setElements(elementsCopy));

            // share element update with other users
            emitElementUpdate(updatedElement);
            break;
            
        default:
            throw new Error('Something went wrong when updating element');
    }   
}