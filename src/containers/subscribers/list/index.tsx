import React, { useEffect } from 'react';
import Card from '../../../components/card';
import Container from '../../../components/container';
import style from './style.module.scss';
import { useRecoilState, useRecoilValue } from 'recoil';
import Divider from '../../../components/divider';
import Button from '../../../components/button';
import { FaCopy, FaEdit, FaEye, FaPlus, FaTrash } from 'react-icons/fa';
import { useHistory } from 'react-router';
import Routes from '../../../utils/routes';
import { toDictionary } from '../../../utils/parsers';
import { DeleteModal } from '../modal';
import {
    deleteSubscriberModal,
    loadedSubscribersList,
    subscribers,
} from '../../../store/subscribers/atom';
import { getSubscribersQuery } from '../../../store/subscribers/requests';
import { subscribersSelector } from '../../../store/subscribers/selector';
import Clipboard from 'react-clipboard.js';
import Loader from '../../../components/loader';

const Subscribers: React.FC = () => {
    const history = useHistory();

    const changeRoute = (route: string) => {
        history.push(route);
    };

    const [subscribersState, setSubscribers] = useRecoilState(subscribers);
    const [isLoaded, setIsLoaded] = useRecoilState(loadedSubscribersList);
    const subscribersList = useRecoilValue(subscribersSelector);

    useEffect(() => {
        const getSubscribers = async () => {
            const subscribers = await getSubscribersQuery();
            setSubscribers({
                ...subscribersState,
                ...toDictionary(subscribers, 'id'),
            });
            setIsLoaded(true);
        };
        if (!isLoaded) {
            getSubscribers();
        }
    }, [isLoaded]);

    const [
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        deleteSubscriberModalState,
        setDeleteSubscriberModalState,
    ] = useRecoilState(deleteSubscriberModal);

    const openDeleteModal = (id) => {
        setDeleteSubscriberModalState({
            subscriberId: id,
            open: true,
        });
    };

    return (
        <Container>
            <DeleteModal />
            <Card>
                <div className={style.flex}>
                    <div>
                        <h1>Subscribers</h1>
                        <h2>Configure your subscribers</h2>
                    </div>
                    <div>
                        <Button
                            handleClick={() =>
                                changeRoute(Routes.SubscribersNew)
                            }
                        >
                            <FaPlus className={style.iconMargin}></FaPlus>
                            New
                        </Button>
                    </div>
                </div>

                <Divider />
                {!isLoaded && <Loader />}
                {isLoaded && (
                    <table className={style.table}>
                        <thead>
                            <tr>
                                <th className={style.thLeftAligned}>Name</th>
                                <th className={style.thLeftAligned}>
                                    Webhook URL
                                </th>
                                <th className={style.thLeftAligned}>
                                    Created At
                                </th>
                                <th className={style.thRightAligned}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribersList.map((val) => {
                                return (
                                    <tr key={val.id}>
                                        <td>{val.name}</td>
                                        <td className={style.row}>
                                            <Clipboard
                                                className={
                                                    style.clipboardButton
                                                }
                                                data-clipboard-text={
                                                    val.webhookUrl
                                                }
                                            >
                                                <FaCopy />
                                            </Clipboard>
                                            <div className={style.urlTd}>
                                                {val.webhookUrl}
                                            </div>
                                        </td>
                                        <td>{val.createdAt.toDateString()}</td>
                                        <td className={style.actions}>
                                            <Button
                                                handleClick={() =>
                                                    changeRoute(
                                                        Routes.SubscribersView.replace(
                                                            ':id',
                                                            val.id,
                                                        ),
                                                    )
                                                }
                                            >
                                                <FaEye
                                                    className={style.iconMargin}
                                                ></FaEye>
                                                View
                                            </Button>
                                            <Button
                                                handleClick={() =>
                                                    changeRoute(
                                                        Routes.SubscribersEdit.replace(
                                                            ':id',
                                                            val.id,
                                                        ),
                                                    )
                                                }
                                            >
                                                <FaEdit
                                                    className={style.iconMargin}
                                                ></FaEdit>
                                                Edit
                                            </Button>
                                            <Button
                                                handleClick={() =>
                                                    openDeleteModal(val.id)
                                                }
                                            >
                                                <FaTrash
                                                    className={style.iconMargin}
                                                ></FaTrash>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </Card>
        </Container>
    );
};

export default Subscribers;
