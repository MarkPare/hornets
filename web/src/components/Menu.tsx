import React, { useState } from 'react';
import '../scss/Menu.scss';
import { getClassData, getName } from '../utils';
import store from '../store';

const classNames = getClassData().map(data => data.name)

const Menu: React.FC<Props> = () => {
  const [expanded, setExpanded] = useState(true);

  const handleSave = () => {
    store.saveImageData();
  }

  const handleClear = () => {
    const msg = 'Clear data from local storage?';
    const result = window.confirm(msg);
    if (result) {
      store.clearData();
    }
  }

  const cls = expanded ? 'menu expanded' : 'menu';

  return (
    <div className={cls}>
      <div className='expand-container' onClick={() => setExpanded(!expanded)}>
        <div className='expand-icon'>^</div>
      </div>
      <div className='menu-content'>
        <div className='options-title'>Classes</div>
        <div className='dir-select'>
          {classNames.map(c => (
            <a className='class' href={`/browser?dirName=${c}`} key={c}>{getName(c)}</a>
          ))}
        </div>
        <div className='buttons-container'>
          <button onClick={handleSave} className='button'>Save</button>
          <button onClick={handleClear} className='clear-button'>Clear</button>
        </div>
      </div>
    </div>
  )
}

interface Props {}

export default Menu;
