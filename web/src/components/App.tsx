import React from 'react';
//import ImageReader from './ImageReader';
import ImageBrowser from './ImageBrowser';
import TextView from './TextView';
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
          component={TextView}
        />
      </Switch>
    </div>
  )
}

export default App;
