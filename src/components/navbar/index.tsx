import { useHistory, useLocation } from 'react-router-dom';
import style from './style.module.scss';
import logo from '../../webhooks.svg';
import { FaChartBar, FaInbox, FaSatelliteDish, FaCode } from "react-icons/fa";
import Routes from '../../utils/routes';

const Navbar: React.FC = () => {
    const history = useHistory();
    const location = useLocation();
  
    const changeRoute = (route: string) => {
      history.push(route);
    };

    return (
        <div className={style.navigation}>
            <div className={style.logo}>
                <img src={logo} className={style.logoImage} alt="logo"/>
            </div>
            <div className={
                location.pathname === Routes.Dashboard ?
                style.navItemActive :
                style.navItem}
                onClick={() => changeRoute(Routes.Dashboard)
                }>
                <FaChartBar className={style.navItem_icon}/>Dashboard
            </div>
            <div className={
                location.pathname === Routes.Publishers ?
                style.navItemActive :
                style.navItem}
                onClick={() => changeRoute(Routes.Publishers)
                }>
                <FaInbox className={style.navItem_icon}/>Publishers
            </div>
            <div className={
                location.pathname === Routes.Subscribers ?
                style.navItemActive :
                style.navItem}
                onClick={() => changeRoute(Routes.Subscribers)
                }>
                <FaSatelliteDish className={style.navItem_icon}/>Subscribers
            </div>
            <div className={
                location.pathname === Routes.Mappers ?
                style.navItemActive :
                style.navItem}
                onClick={() => changeRoute(Routes.Mappers)
                }>
                <FaCode className={style.navItem_icon}/>Mappers
            </div>
        </div>
    );
  };
  
  export default Navbar;