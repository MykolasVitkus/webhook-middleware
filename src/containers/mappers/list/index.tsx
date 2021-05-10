import React, { useEffect } from 'react';
import Card from '../../../components/card';
import Container from '../../../components/container';
import style from './style.module.scss';
import { useRecoilState, useRecoilValue } from 'recoil';
import Divider from '../../../components/divider';
import Button from '../../../components/button';
import { FaEdit, FaEye, FaPlus, FaTrash } from 'react-icons/fa';
import {
    deleteMapperModal,
    loadedMappersList,
} from '../../../store/mappers/atom';
import { useHistory } from 'react-router';
import Routes from '../../../utils/routes';
import { toDictionary } from '../../../utils/parsers';
import { DeleteModal } from '../modal';
import { getMappersQuery } from '../../../store/mappers/requests';
import { mappers } from '../../../store/mappers/atom';
import { mappersSelector } from '../../../store/mappers/selector';
import Loader from '../../../components/loader';

const Mappers: React.FC = () => {
    const history = useHistory();

    const changeRoute = (route: string) => {
        history.push(route);
    };

    const [mappersState, setMappers] = useRecoilState(mappers);
    const [isLoaded, setIsLoaded] = useRecoilState(loadedMappersList);
    const mappersList = useRecoilValue(mappersSelector);

    useEffect(() => {
        const getMappers = async () => {
            const mappers = await getMappersQuery();
            setMappers({
                ...mappersState,
                ...toDictionary(mappers, 'id'),
            });
            setIsLoaded(true);
        };
        if (!isLoaded) {
            getMappers();
        }
    }, [isLoaded]);

    const [
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        deleteMapperModalState,
        setDeleteMapperModalState,
    ] = useRecoilState(deleteMapperModal);

    const openDeleteModal = (id) => {
        setDeleteMapperModalState({
            mapperId: id,
            open: true,
        });
    };

    return (
        <Container>
            <DeleteModal />
            <Card>
                <div className={style.flex}>
                    <div>
                        <h1>Mappers</h1>
                        <h2>Configure your mappers</h2>
                    </div>
                    <div>
                        <Button
                            handleClick={() => changeRoute(Routes.MappersNew)}
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
                                    Created At
                                </th>
                                <th className={style.thRightAligned}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {mappersList.map((val) => {
                                return (
                                    <tr key={val.id}>
                                        <td>{val.name}</td>
                                        <td>{val.createdAt.toDateString()}</td>
                                        <td className={style.actions}>
                                            <Button
                                                handleClick={() =>
                                                    changeRoute(
                                                        Routes.MappersView.replace(
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
                                                        Routes.MappersEdit.replace(
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

export default Mappers;
