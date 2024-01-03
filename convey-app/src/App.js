import React, {useEffect} from 'react';
import Whiteboard from './Whiteboard/Whiteboard';
import { connectWithSocketServer } from './socketConnector/socketConnector';
import CursorOverlay from './CursorOverlay/CursorOverlay';

function App() {

  useEffect(() => {
    connectWithSocketServer();
  },[]);

  return (
    <div className="App">
      <Whiteboard/>
      <CursorOverlay/>
    </div>
  );
}

export default App;
