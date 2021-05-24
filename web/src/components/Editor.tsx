// tslint-disable 
import React, { useState } from 'react';
import '../scss/Editor.scss';
import { handlePaste } from '../utils';

const Editor: React.FC<Props> = (props) => {

  const [value, setValue] = useState('');

  const onInput = (event: any) => {
    console.log('onInput', event.target.innerHTML)
    event.preventDefault()
  }

  const onKeyDown = (event: any) => {
    console.log('onKeyDown', event.target)
  }

  const onDrop = (event: any) => {
    console.log('onDrop', event)
  }

  const onPaste = (event: any) => {
    console.log('onPaste', event)
    handlePaste(event)
  }

  return (
    <div
      className='editor'
      contentEditable="true"
      onInput={onInput}
      onKeyDown={onKeyDown}
      onDrop={onDrop}
      onPaste={onPaste}
    >
    </div>
  );
}

interface Props {}

export default Editor;
