import { createElement } from "./createElement";
import { toolTypes } from "../../constants";
import {store} from "../../store/store";
import { setElements } from "../WhiteboardSlice";
import { emitElementUpdate } from "../../socketConnector/socketConnector";

export const updateElement = ({id, x1, x2, y1, y2, type, index, text}, elements) => {
    const elementsCopy = [...elements];

    switch(type){
        case toolTypes.LINE:
        
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

        case toolTypes.PENCIL:
            elementsCopy[index] = {
                ...elementsCopy[index],
                points: [
                    ...elementsCopy[index].points,
                    {
                        x: x2,
                        y: y2,
                    }
                ]
            }

            const updatedPencilElement = elementsCopy[index];

            store.dispatch(setElements(elementsCopy));

            emitElementUpdate(updatedPencilElement);
            break;

        case toolTypes.TEXT:
            const textWidth = document.getElementById('canvas').getContext("2d").measureText(text).width;
            const textHeight = 24;

            elementsCopy[index] = {
                ...createElement({
                    id,
                    x1,
                    y1,
                    x2: x1 + textWidth,
                    y2: y1 + textHeight,
                    toolType: type,
                    text,
                }),
            };
            const updatedTextElement = elementsCopy[index];
            store.dispatch(setElements(elementsCopy));
            emitElementUpdate(updatedTextElement);
            break;

        default:
            throw new Error('Something went wrong when updating element');
    }   
}