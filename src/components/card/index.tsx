import React from 'react';
import style from './style.module.scss';

const Card: React.FC = (props) => {

    return (
        <div className={style.card}>
            {props.children}
        </div>
    );
  };
  
  export default Card;
  