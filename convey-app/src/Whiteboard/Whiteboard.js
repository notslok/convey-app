import React, {useRef, useLayoutEffect, useState} from 'react';
import { UseSelector, useSelector } from 'react-redux/es/hooks/useSelector';
import Menu from './Menu';
import rough from 'roughjs';
import { toolTypes, actions, cursorPositions } from '../constants';
import { createElement, 
         updateElement, 
         drawElement, 
         adjustmentRequired, 
         adjustElementCoordinates, 
         getElementAtPosition,
         getCursorForPosition, 
         getResizedCoordinates } from './utils';
import {v4 as uuid} from 'uuid';
import { useDispatch } from 'react-redux';
import { updateElement as updateElementInStore } from './WhiteboardSlice';



// let selectedElement;
// const setSelectedElement = (el) => {
//   selectedElement = el;
// }


const Whiteboard = () => {
  
  const canvasRef = useRef();
  const textAreaRef = useRef();

  const toolType = useSelector(state => state.whiteboard.tool);
  const elements = useSelector(state => state.whiteboard.elements);
  const [action, setAction] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    const roughCanvas = rough.canvas(canvas);
    
    elements.forEach(element => {
      drawElement({roughCanvas, context: ctx, element})
    });

  }, [elements]);
  
  const handleMouseDown = (event) => {
    const {clientX, clientY} = event;
    // console.log(toolType);

    if(selectedElement && action === actions.WRITING) {
      return;
    }

    switch(toolType){

      case toolTypes.RECTANGLE:
      case toolTypes.LINE:
      case toolTypes.PENCIL:{
  
          const element = createElement({
          x1: clientX,
          y1: clientY,
          x2: clientX,
          y2: clientY,
          toolType,
          id: uuid(), 
        });
        setAction(actions.DRAWING);
        setSelectedElement(element);
        dispatch(updateElementInStore(element));
        break;

      }
      
      case toolTypes.TEXT:{

          const element = createElement({
          x1: clientX,
          y1: clientY,
          x2: clientX,
          y2: clientY,
          toolType,
          id: uuid(), 
        });
        setAction(actions.WRITING);
        setSelectedElement(element);
        dispatch(updateElementInStore(element));
        break;

      }

      case toolTypes.SELECTION:{

          const element = getElementAtPosition(clientX, clientY, elements);

          if(element && element.type === toolTypes.RECTANGLE){
            setAction(
              
              element.position === cursorPositions.INTSIDE 
                                  ? actions.MOVING 
                                  : actions.RESIZING
            );

            const offsetX = clientX - element.x1;
            const offsetY = clientY - element.y1;

            setSelectedElement({...element, offsetX, offsetY});
          }
          break;

      }
    }

  };

  const handleMouseUp = () => {

    const selectedElementIndex = elements.findIndex(el => el.id === selectedElement?.id);

    if(selectedElementIndex !== -1){

      if(action === actions.DRAWING || action === actions.RESIZING){
        
        if(adjustmentRequired(elements[selectedElementIndex].type)){
            const {x1,y1,x2,y2} = adjustElementCoordinates(elements[selectedElementIndex]);

            updateElement({
              id: selectedElement.id,
              index: selectedElementIndex,
              x1,
              x2,
              y1,
              y2,
              type: elements[selectedElementIndex].type,
            }, 
            elements);
        }
      }
    }

    setAction(null);
    setSelectedElement(null);
  }

  const handleMouseMove = (event) => {
    const {clientX, clientY} = event;
    
    if(action === actions.DRAWING){
        // find index of selected element
        const index = elements.findIndex(e => e.id === selectedElement.id)

        if(index !== -1){
          updateElement({
            index,
            id: elements[index].id,
            x1: elements[index].x1,
            y1: elements[index].y1,
            x2: clientX,
            y2: clientY,
            type: elements[index].type,
          }, elements)
        }
    }

    if(toolType === toolTypes.SELECTION){
      const element = getElementAtPosition(clientX, clientY, elements);
      
      
      event.target.style.cursor = element ? getCursorForPosition(element.position) : "default";
      
    }

    if(toolType === toolTypes.SELECTION && action === actions.MOVING && selectedElement){
      const {id, x1, x2, y1, y2, type, offsetX, offsetY} = selectedElement;

      const width = x2-x1;
      const height = y2-y1;
      
      const newX1 = clientX - offsetX;
      const newY1 = clientY - offsetY;
      
      const index = elements.findIndex((el) => el.id === selectedElement.id);

      if(index != -1){
        updateElement({
          id,
          x1: newX1,
          y1: newY1,
          x2: newX1 + width,
          y2: newY1 + height,
          type,
          index,
        }, elements);
      }
    }

    if(toolType === toolTypes.SELECTION && action === actions.RESIZING && selectedElement){
      const {id, type, position, ...coordinates} = selectedElement;
      const {x1,y1,x2,y2} = getResizedCoordinates(
        clientX,
        clientY,
        position,
        coordinates,
      );

      const selectedElementIndex = elements.findIndex(el => el.id === selectedElement.id);

      if(selectedElementIndex !== -1){
        updateElement({
          x1,
          y1,
          x2,
          y2,
          type: selectedElement.type,
          id: selectedElement.id,
          index: selectedElementIndex,
        }, elements);
      }
    }

  }

  const handleTextAreaBlur = (event) => {
    const {id, x1, y1, type} = selectedElement;
    const index = elements.findIndex(el => el.id === selectedElement.id);

    if(index !== -1){
      updateElement({id, x1, y1, type, text:event.target.value, index}, elements);
      setAction(null);
      setSelectedElement(null);
    }
  };

  return (
    <>
      <Menu/>
      {action === actions.WRITING ? <textarea
        ref={textAreaRef}
        onBlur={handleTextAreaBlur}
        style={{
          position: 'absolute',
          top: selectedElement.y1 - 3,
          left: selectedElement.x1,
          font: '24px sans-serif',
          margin: 0,
          padding: 0,
          border: 0,
          outline: 0, 
          resize: "auto",
          overflow: "hidden",
          whiteSpace: "pre",
          background: "transparent",
          id: "canvas",
        }}
      />
      : null
    }
      <canvas
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        id='canvas'
      />
    </>
  );
};

export default Whiteboard;