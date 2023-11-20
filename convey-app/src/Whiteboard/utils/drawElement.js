import { toolTypes } from "../../constants";

export const drawElement = ({roughCanvas, context, element}) => {
    switch(element.type){
        case toolTypes.LINE:
        case toolTypes.RECTANGLE:
            return roughCanvas.draw(element.roughElement);
        default:
            throw new Error("something went wrong when drawing element");
    }
};