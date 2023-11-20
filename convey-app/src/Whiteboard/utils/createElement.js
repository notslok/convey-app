import rough from 'roughjs';
import { toolTypes } from '../../constants';


const generator = rough.generator();

const generateRectangle = ({x1, y1, x2, y2}) => {
    let width = x2-x1;
    let height = y2-y1;

    return generator.rectangle(x1, y1, width, height);
};

const generateLine = ({x1, y1, x2, y2}) => {
    return generator.line(x1, y1, x2, y2);
};

export const createElement = ({x1, y1, x2, y2, toolType, id}) => {
    let roughElement;

    switch(toolType) {
        case toolTypes.RECTANGLE:
            roughElement = generateRectangle({x1, y1, x2, y2});
            return{
                id: id,
                roughElement,
                type: toolType,
                x1,
                y1,
                x2,
                y2,
            };
        case toolTypes.LINE:
            roughElement = generateLine({x1, y1, x2, y2});
            return{
                id: id,
                roughElement,
                type: toolType,
                x1,
                y1,
                x2,
                y2,
            };
        default:
            throw new Error("Something went wrong while creating element")
    }
}