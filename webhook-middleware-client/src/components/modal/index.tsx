import React from 'react';
import style from './style.module.scss';

const Modal: React.FC = (props) => {
    return <div className={style.modal}>{props.children}</div>;
};

export default Modal;
