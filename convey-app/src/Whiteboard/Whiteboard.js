import React, {useRef, useLayoutEffect, useState} from 'react';
import { UseSelector, useSelector } from 'react-redux/es/hooks/useSelector';
import Menu from './Menu';
import rough from 'roughjs';
import { toolTypes, actions } from '../constants';
import { createElement, updateElement, drawElement, adjustmentRequired, adjustElementCoordinates } from './utils';
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

    const element = createElement({
      x1: clientX,
      y1: clientY,
      x2: clientX,
      y2: clientY,
      toolType,
      id: uuid(), 
    });

    switch(toolType){
      case toolTypes.RECTANGLE:
      case toolTypes.LINE:
      case toolTypes.PENCIL:
        setAction(actions.DRAWING);
        break;
      
      case toolTypes.TEXT:
        setAction(actions.WRITING);
        break;
    }

    setSelectedElement(element);
    dispatch(updateElementInStore(element));


  };

  const handleMouseUp = () => {

    const selectedElementIndex = elements.findIndex(el => el.id === selectedElement?.id);

    if(selectedElementIndex !== -1){

      if(action === actions.DRAWING){
        
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
  }

  const handleTextAreaBlur = (event) => {
    const {id, x1, y1, type} = selectedElement;
    const index = elements.findIndex(el => el.id ===selectedElement.id);

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