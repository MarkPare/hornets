import React from 'react';
import ImageReader from './ImageReader';



interface Props {}

const App: React.FC<Props> = () => {
  return (
    <div className='app'>
      {/* <div className='center-content'>
        <div className='copy'>
          <h1 className='title'>{title}</h1>
          <div className='subtitle'>{subtitle}</div>
        </div>
      </div> */}
      <ImageReader />
    </div>
  )
}

export default App;
