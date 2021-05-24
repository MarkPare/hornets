import React from 'react';
import '../scss/TextView.scss';
import Editor from './Editor';

const TextView: React.FC<Props> = (props) => {
  return (
    <div className='text-view'>
      <Editor />
    </div>
  );
}

interface Props {}

export default TextView;
