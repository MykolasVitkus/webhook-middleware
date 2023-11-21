import React, { useState } from 'react';
import Card from '../../../components/card';
import Container from '../../../components/container';
import style from './style.module.scss';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import Divider from '../../../components/divider';
import Button from '../../../components/button';
import {
    FaAngleDoubleLeft,
    FaAngleDoubleRight,
    FaAngleLeft,
    FaAngleRight,
    FaCopy,
    FaEdit,
    FaEye,
    FaPlus,
    FaTrash,
} from 'react-icons/fa';
import { useHistory } from 'react-router';
import Routes from '../../../utils/routes';
import { DeleteModal } from '../modal';
import { deleteSubscriberModal } from '../../../store/subscribers/atom';
import {
    subscribersCountSelector,
    subscribersSelector,
} from '../../../store/subscribers/selector';
import Clipboard from 'react-clipboard.js';
import Loader from '../../../components/loader';
import { Pagination } from '../../../utils/types';

const Subscribers: React.FC = () => {
    const history = useHistory();

    const changeRoute = (route: string) => {
        history.push(route);
    };

    const paginationLimit = 20;

    const [pagination, setPagination] = useState<Pagination>({
        offset: 0,
        limit: paginationLimit,
        page: 1,
    });

    const setPage = (page: number, pagination: Pagination) => {
        setPagination({
            ...pagination,
            offset: (page - 1) * pagination.limit,
            page: page,
        });
    };

    const subscribersList = useRecoilValueLoadable(
        subscribersSelector(pagination),
    );
    const subscribersCount = useRecoilValueLoadable(subscribersCountSelector);

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
                {subscribersList.state === 'loading' && <Loader />}
                {subscribersList.state === 'hasValue' && (
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
                            {subscribersList.contents.map((val) => {
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
                <Divider />
                {subscribersCount.state === 'hasValue' && (
                    <div className={style.pagination}>
                        <Button
                            handleClick={() => {
                                setPage(1, pagination);
                            }}
                            disabled={pagination.page === 1}
                        >
                            <FaAngleDoubleLeft />
                        </Button>
                        <Button
                            handleClick={() =>
                                setPage(pagination.page - 1, pagination)
                            }
                            disabled={pagination.page === 1}
                        >
                            <FaAngleLeft />
                        </Button>
                        <div className={style.paginationText}>
                            {pagination.page} of{' '}
                            {subscribersCount.contents < paginationLimit
                                ? 1
                                : Math.floor(
                                      subscribersCount.contents /
                                          paginationLimit,
                                  ) + 1}
                        </div>
                        <Button
                            handleClick={() => {
                                setPage(pagination.page + 1, pagination);
                            }}
                            disabled={
                                pagination.page * paginationLimit >
                                subscribersCount.contents
                            }
                        >
                            <FaAngleRight />
                        </Button>
                        <Button
                            handleClick={() => {
                                setPage(
                                    Math.floor(
                                        subscribersCount.contents /
                                            paginationLimit,
                                    ) + 1,
                                    pagination,
                                );
                            }}
                            disabled={
                                subscribersCount.contents <= paginationLimit ||
                                pagination.page ===
                                    Math.floor(
                                        subscribersCount.contents /
                                            paginationLimit,
                                    ) +
                                        1
                            }
                        >
                            <FaAngleDoubleRight />
                        </Button>
                    </div>
                )}
            </Card>
        </Container>
    );
};

export default Subscribers;
