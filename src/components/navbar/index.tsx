import { useHistory, useLocation } from 'react-router-dom';
import style from './style.module.scss';
import logo from '../../webhooks.svg';
import {
    FaChartBar,
    FaInbox,
    FaSatelliteDish,
    FaCode,
    FaHistory,
    FaSignOutAlt,
} from 'react-icons/fa';
import Routes from '../../utils/routes';
import { unsetToken } from '../../store/auth/service';

const Navbar: React.FC = () => {
    const history = useHistory();
    const location = useLocation();

    const changeRoute = (route: string) => {
        history.push(route);
    };

    const logout = () => {
        unsetToken();
        changeRoute(Routes.Login);
    };

    return (
        <div className={style.navigation}>
            <div className={style.navSection}>
                <div className={style.logo}>
                    <img src={logo} className={style.logoImage} alt="logo" />
                </div>
                <div
                    className={
                        location.pathname === Routes.Dashboard
                            ? style.navItemActive
                            : style.navItem
                    }
                    onClick={() => changeRoute(Routes.Dashboard)}
                >
                    <FaChartBar className={style.navItem_icon} />
                    Dashboard
                </div>
                <div
                    className={
                        location.pathname === Routes.Publishers
                            ? style.navItemActive
                            : style.navItem
                    }
                    onClick={() => changeRoute(Routes.Publishers)}
                    data-test="navPublishers"
                >
                    <FaInbox className={style.navItem_icon} />
                    Publishers
                </div>
                <div
                    className={
                        location.pathname === Routes.Subscribers
                            ? style.navItemActive
                            : style.navItem
                    }
                    onClick={() => changeRoute(Routes.Subscribers)}
                >
                    <FaSatelliteDish className={style.navItem_icon} />
                    Subscribers
                </div>
                <div
                    className={
                        location.pathname === Routes.Mappers
                            ? style.navItemActive
                            : style.navItem
                    }
                    onClick={() => changeRoute(Routes.Mappers)}
                >
                    <FaCode className={style.navItem_icon} />
                    Mappers
                </div>
                <div
                    className={
                        location.pathname === Routes.History
                            ? style.navItemActive
                            : style.navItem
                    }
                    onClick={() => changeRoute(Routes.History)}
                >
                    <FaHistory className={style.navItem_icon} />
                    History
                </div>
            </div>
            <div className={style.navSection}>
                <div className={style.navItem} onClick={() => logout()}>
                    <FaSignOutAlt className={style.navItem_icon} />
                    Logout
                </div>
            </div>
        </div>
    );
};

export default Navbar;
