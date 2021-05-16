import React from 'react';
import style from './style.module.scss';

interface ButtonProps {
    children: React.ReactNode;
    handleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    style?;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = (props) => {
    return (
        <button
            className={props.style ? props.style : style.button}
            onClick={props.handleClick}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    );
};

export default Button;
