import { toolTypes } from "../../constants";

export const adjustElementCoordinates = (element) => {
    const {type, x1, y1, x2, y2} = element;

    switch(type){
        case toolTypes.RECTANGLE:
            const minX = Math.min(x1, x2);
            const maxX = Math.max(x1, x2);
            const minY = Math.min(y1, y2);
            const maxY = Math.max(y1, y2);
    
            return {x1:minX, y1:minY, x2:maxX, y2:maxY};
            break;

        case toolTypes.LINE:
            if(x1<x2 || (x1===x2 && y1<y2)){ // if drawing from left to right
                return {
                        x1, 
                        y1, 
                        x2, 
                        y2
                    };
            }
            else{
                return { // drawing in bottom-up fashion
                        x1: x2, 
                        y1: y2, 
                        x2: x1, 
                        y2: y1
                    };
            }

        
    }
};
