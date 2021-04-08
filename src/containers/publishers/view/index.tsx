import React from 'react';
import { FaEdit } from 'react-icons/fa';
import { useHistory, useParams } from 'react-router';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import Button from '../../../components/button';
import Card from '../../../components/card';
import Container from '../../../components/container';
import Divider from '../../../components/divider';
import { deletePublisherModal } from '../../../store/publishers/atom';
import { publishersByIdSelector } from '../../../store/publishers/selector';
import { publishedWebhooksSelector } from '../../../store/webhooks/selector';
import Routes from '../../../utils/routes';
import { PublisherWebhooksList } from '../../webhooks/list';
import { DeleteModal } from '../modal';
import style from './style.module.scss';

export const PublisherView: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { id } = useParams<any>();
    const publisher = useRecoilValueLoadable(publishersByIdSelector(id));
    const publishedWebhooks = useRecoilValueLoadable(
        publishedWebhooksSelector(id),
    );

    const history = useHistory();

    const changeRoute = (route: string) => {
        history.push(route);
    };

    const [
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        deletePublisherModalState,
        setDeletePublisherModalState,
    ] = useRecoilState(deletePublisherModal);

    const openDeleteModal = (id) => {
        setDeletePublisherModalState({
            publisherId: id,
            open: true,
        });
    };

    return (
        <Container>
            <Card>
                <DeleteModal />

                {publisher.state === 'loading' && <div>Loading</div>}
                {publisher.state === 'hasValue' && (
                    <div>
                        <div className={style.flex}>
                            <div>
                                <h1>{publisher.contents.name}</h1>
                                <h2>
                                    Created at{' '}
                                    {publisher.contents.createdAt.toDateString()}
                                </h2>
                            </div>

                            <div className={style.flex}>
                                <Button
                                    handleClick={() =>
                                        changeRoute(
                                            Routes.PublishersEdit.replace(
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
                                        openDeleteModal(publisher.contents.id)
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
                        {publishedWebhooks.state === 'loading' && (
                            <div>Loading</div>
                        )}
                        {publishedWebhooks.state === 'hasValue' && (
                            <PublisherWebhooksList
                                data={publishedWebhooks.contents}
                                publisher={publisher.contents}
                            />
                        )}
                    </div>
                )}
            </Card>
        </Container>
    );
};
