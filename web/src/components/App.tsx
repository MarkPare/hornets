import React from 'react';
import ImageReader from './ImageReader';
import ImageBrowser from './ImageBrowser';
import {Route, Switch} from 'react-router';

interface Props {}

const App: React.FC<Props> = () => {
  return (
    <div className='app'>
      <Switch>
        <Route
          path='/browser'
          component={ImageBrowser}
        />
        <Route
          path='/'
          component={ImageReader}
        />
      </Switch>
    </div>
  )
}

export default App;
