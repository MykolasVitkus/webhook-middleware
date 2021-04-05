import React from 'react';
import style from './style.module.scss';

interface ButtonProps {
    children: React.ReactNode;
    handleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = (props) => {
    return (
        <button className={style.button} onClick={props.handleClick}>
            {props.children}
        </button>
    );
  };
  
  export default Button;