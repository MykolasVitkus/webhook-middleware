import React, { useEffect } from 'react';
import Card from '../../../components/card';
import Container from '../../../components/container';
import style from './style.module.scss';
import { publishers } from '../../../store/publishers';
import { useRecoilState, useRecoilValue } from 'recoil';
import Divider from '../../../components/divider';
import Button from '../../../components/button';
import { FaEdit, FaEye, FaPlus, FaTrash } from 'react-icons/fa';
import { getPublishersQuery } from '../../../store/publishers/requests';
import { deletePublisherModal, loaded } from '../../../store/publishers/atom';
import { useHistory } from 'react-router';
import Routes from '../../../utils/routes';
import { publishersSelector } from '../../../store/publishers/selector';
import { toDictionary } from '../../../utils/parsers';
import { EditModal } from '../modal';

const Publishers: React.FC = () => {
    const history = useHistory();

    const changeRoute = (route: string) => {
        history.push(route);
    };

    const [publishersState, setPublishers] = useRecoilState(publishers);
    const [isLoaded, setIsLoaded] = useRecoilState(loaded);

    useEffect(() => {
        const getPublishers = async () => {
            const publishers = await getPublishersQuery();
            setPublishers({
                ...publishersState,
                ...toDictionary(publishers, 'id'),
            });
            setIsLoaded(true);
        };
        getPublishers();
    }, []);

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

    const publishersList = useRecoilValue(publishersSelector);
    return (
        <Container>
            <EditModal />
            <Card>
                <div className={style.flex}>
                    <div>
                        <h1>Publishers</h1>
                        <h2>Configure your publishers</h2>
                    </div>
                    <div>
                        <Button
                            handleClick={() =>
                                changeRoute(Routes.PublishersNew)
                            }
                        >
                            <FaPlus className={style.iconMargin}></FaPlus>
                            New
                        </Button>
                    </div>
                </div>

                <Divider />
                {!isLoaded && <div>Loading</div>}
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
                            {publishersList.map((val) => {
                                return (
                                    <tr key={val.id}>
                                        <td>{val.name}</td>
                                        <td>
                                            {window.location.protocol +
                                                '//' +
                                                window.location.host +
                                                '/api/webhooks/' +
                                                val.id}
                                        </td>
                                        <td>{val.createdAt.toDateString()}</td>
                                        <td className={style.actions}>
                                            <Button
                                                handleClick={() => {
                                                    console.log(val.id);
                                                }}
                                            >
                                                <FaEye
                                                    className={style.iconMargin}
                                                ></FaEye>
                                                View
                                            </Button>
                                            <Button
                                                handleClick={() => {
                                                    console.log(val.id);
                                                }}
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

export default Publishers;
