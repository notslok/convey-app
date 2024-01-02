import React from 'react'
import rectangleIcon from "../resources/icons/rectangle.svg";
import lineIcon from "../resources/icons/line.svg";
import rubberIcon from '../resources/icons/rubber.svg';
import pencilIcon from '../resources/icons/pencil.svg';
import textIcon from '../resources/icons/text.svg';
import { toolTypes } from '../constants';
import { useDispatch, useSelector } from "react-redux";
import { setElements, setToolType } from './WhiteboardSlice';
import { emitWhiteboardClear } from '../socketConnector/socketConnector';

const IconButton = ({ src, type, isRubber }) => {

    const dispatch = useDispatch();
    
    const selectedToolType = useSelector(state => state.whiteboard.tool);
    const handleToolChange = () => {
        dispatch(setToolType(type));
    }

    const handleClearCanvas = () => {
        // dispatching action to clear elemets in the redux store
        dispatch(setElements([]));
        
        emitWhiteboardClear();
    }

    return(
            <button onClick={isRubber ? handleClearCanvas : handleToolChange} className={selectedToolType === type ? "menu_button_active" : "menu_button"}>
                <img width='80%' height='80%' src={src}/>
            </button>
        );
}

const Menu = () => {
  return (
    <div className='menu_container'>
        <IconButton src={rectangleIcon} type={toolTypes.RECTANGLE}/>
        <IconButton src={lineIcon} type={toolTypes.LINE}/>
        <IconButton src={pencilIcon} type={toolTypes.PENCIL}/>
        <IconButton src={textIcon} type={toolTypes.TEXT}/>
        <IconButton src={rubberIcon} isRubber/>
    </div>
  )
}

export default Menu

