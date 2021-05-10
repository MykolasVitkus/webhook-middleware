import React from 'react';
import { FaEdit } from 'react-icons/fa';
import { useHistory, useParams } from 'react-router';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import Button from '../../../components/button';
import Card from '../../../components/card';
import Container from '../../../components/container';
import Divider from '../../../components/divider';
import Loader from '../../../components/loader';
import { deleteSubscriberModal } from '../../../store/subscribers/atom';
import { subscribersByIdSelector } from '../../../store/subscribers/selector';
import { receivedWebhooksSelector } from '../../../store/webhooks/selector';
import Routes from '../../../utils/routes';
import { SubscriberWebhooksList } from '../../webhooks/received-list';
import { DeleteModal } from '../modal';
import style from './style.module.scss';

export const SubscribersView: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { id } = useParams<any>();
    const subscriber = useRecoilValueLoadable(subscribersByIdSelector(id));
    const receivedWebhooks = useRecoilValueLoadable(
        receivedWebhooksSelector(id),
    );

    const history = useHistory();

    const changeRoute = (route: string) => {
        history.push(route);
    };

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
            <Card>
                <DeleteModal />

                {subscriber.state === 'loading' && <Loader />}
                {subscriber.state === 'hasValue' && (
                    <div>
                        <div className={style.flex}>
                            <div>
                                <h1>{subscriber.contents.name}</h1>
                                <h2>
                                    Created at{' '}
                                    {subscriber.contents.createdAt.toDateString()}
                                </h2>
                            </div>

                            <div className={style.flex}>
                                <Button
                                    handleClick={() =>
                                        changeRoute(
                                            Routes.SubscribersEdit.replace(
                                                ':id',
                                                id,
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
                                        openDeleteModal(subscriber.contents.id)
                                    }
                                >
                                    <FaEdit
                                        className={style.iconMargin}
                                    ></FaEdit>
                                    Delete
                                </Button>
                            </div>
                        </div>

                        <Divider />
                        {receivedWebhooks.state === 'loading' && <Loader />}
                        {receivedWebhooks.state === 'hasValue' && (
                            <SubscriberWebhooksList
                                data={receivedWebhooks.contents}
                                subscriber={subscriber.contents}
                            />
                        )}
                    </div>
                )}
            </Card>
        </Container>
    );
};
