import React, { useEffect } from 'react';
import Card from '../../../components/card';
import Container from '../../../components/container';
import style from './style.module.scss';
import { publishers } from '../../../store/publishers';
import { useRecoilState, useRecoilValue } from 'recoil';
import Divider from '../../../components/divider';
import Button from '../../../components/button';
import { FaCopy, FaEdit, FaEye, FaPlus, FaTrash } from 'react-icons/fa';
import { getPublishersQuery } from '../../../store/publishers/requests';
import {
    deletePublisherModal,
    loadedPublishersList,
} from '../../../store/publishers/atom';
import { useHistory } from 'react-router';
import Routes from '../../../utils/routes';
import { publishersSelector } from '../../../store/publishers/selector';
import { toDictionary } from '../../../utils/parsers';
import { DeleteModal } from '../modal';
import Clipboard from 'react-clipboard.js';
import Loader from '../../../components/loader';

const Publishers: React.FC = () => {
    const history = useHistory();

    const changeRoute = (route: string) => {
        history.push(route);
    };

    const [publishersState, setPublishers] = useRecoilState(publishers);
    const [isLoaded, setIsLoaded] = useRecoilState(loadedPublishersList);
    const publishersList = useRecoilValue(publishersSelector);

    useEffect(() => {
        const getPublishers = async () => {
            const publishers = await getPublishersQuery();
            setPublishers({
                ...publishersState,
                ...toDictionary(publishers, 'id'),
            });
            setIsLoaded(true);
        };
        if (!isLoaded) {
            getPublishers();
        }
    }, [isLoaded]);

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
            <DeleteModal />
            <Card>
                <div className={style.flex}>
                    <div>
                        <h1 data-test="publishersTitle">Publishers</h1>
                        <h2>Configure your publishers</h2>
                    </div>
                    <div>
                        <Button
                            handleClick={() =>
                                changeRoute(Routes.PublishersNew)
                            }
                            data-test="publishersNew"
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
                                    Webhook Link
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
                            {publishersList.map((val, index) => {
                                return (
                                    <>
                                        <tr key={val.id}>
                                            <td
                                                data-test={
                                                    index ===
                                                    publishersList.length - 1
                                                        ? 'lastPublisherName'
                                                        : undefined
                                                }
                                            >
                                                {val.name}
                                            </td>
                                            <td className={style.row}>
                                                <Clipboard
                                                    className={
                                                        style.clipboardButton
                                                    }
                                                    data-clipboard-text={
                                                        window.location
                                                            .protocol +
                                                        '//' +
                                                        window.location.host +
                                                        '/api/webhooks/' +
                                                        val.id
                                                    }
                                                >
                                                    <FaCopy />
                                                </Clipboard>
                                                <div
                                                    className={style.urlTd}
                                                    data-test={
                                                        index ===
                                                        publishersList.length -
                                                            1
                                                            ? 'lastPublisherUrl'
                                                            : undefined
                                                    }
                                                >
                                                    {window.location.protocol +
                                                        '//' +
                                                        window.location.host +
                                                        '/api/webhooks/' +
                                                        val.id}
                                                </div>
                                            </td>
                                            <td>
                                                {val.createdAt.toDateString()}
                                            </td>
                                            <td className={style.actions}>
                                                <Button
                                                    handleClick={() =>
                                                        changeRoute(
                                                            Routes.PublishersView.replace(
                                                                ':id',
                                                                val.id,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    <FaEye
                                                        className={
                                                            style.iconMargin
                                                        }
                                                    ></FaEye>
                                                    View
                                                </Button>
                                                <Button
                                                    handleClick={() =>
                                                        changeRoute(
                                                            Routes.PublishersEdit.replace(
                                                                ':id',
                                                                val.id,
                                                            ),
                                                        )
                                                    }
                                                    data-test={
                                                        index ===
                                                        publishersList.length -
                                                            1
                                                            ? 'lastPublisherEdit'
                                                            : undefined
                                                    }
                                                >
                                                    <FaEdit
                                                        className={
                                                            style.iconMargin
                                                        }
                                                    ></FaEdit>
                                                    Edit
                                                </Button>
                                                <Button
                                                    handleClick={() =>
                                                        openDeleteModal(val.id)
                                                    }
                                                    data-test={
                                                        index ===
                                                        publishersList.length -
                                                            1
                                                            ? 'lastPublisherDelete'
                                                            : undefined
                                                    }
                                                >
                                                    <FaTrash
                                                        className={
                                                            style.iconMargin
                                                        }
                                                    ></FaTrash>
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    </>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </Card>
        </Container>
    );
};

export default Publishers;
