import React from 'react';
import ImageReader from './ImageReader';

interface Props {}

const App: React.FC<Props> = () => {
  return (
    <div className='app'>
      <ImageReader />
    </div>
  )
}

export default App;
