import React from 'react';
import '../scss/Button.scss';

const Button: React.FC<Props> = (props) => {
  const {label, className, onClick} = props;
  const cls = `button ${className || ''}`
  return (
    <button className={cls} onClick={onClick}>
      {label}
    </button>
  );
}

interface Props {
  label: string
  className?: string
  onClick: () => void
}

export default Button;
