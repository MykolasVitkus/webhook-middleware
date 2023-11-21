import React from 'react';
import style from './styles.module.scss';
import logo from '../../webhooks.svg';

const SmallLoader: React.FC = () => {
    return (
        <div className={style.loader}>
            <img className={style.logo} src={logo} alt="logo" width="100px" />
        </div>
    );
};

export default SmallLoader;
