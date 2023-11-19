import React, {useEffect} from 'react';
import Whiteboard from './Whiteboard/Whiteboard';
import { connectWithSocketServer } from './socketConnector/socketConnector';

function App() {

  useEffect(() => {
    connectWithSocketServer();
  },[]);

  return (
    <div className="App">
      <Whiteboard/>
    </div>
  );
}

export default App;
