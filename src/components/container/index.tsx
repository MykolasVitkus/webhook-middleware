import style from './style.module.scss';

const Container: React.FC = (props) => {
    return <div className={style.container}>{props.children}</div>;
};

export default Container;
