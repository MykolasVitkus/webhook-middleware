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
    FaEdit,
    FaEye,
    FaPlus,
    FaTrash,
} from 'react-icons/fa';
import { deleteMapperModal } from '../../../store/mappers/atom';
import { useHistory } from 'react-router';
import Routes from '../../../utils/routes';
import { DeleteModal } from '../modal';
import {
    mappersCountSelector,
    mappersSelector,
} from '../../../store/mappers/selector';
import Loader from '../../../components/loader';
import { Pagination } from '../../../utils/types';

const Mappers: React.FC = () => {
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

    const mappersList = useRecoilValueLoadable(mappersSelector(pagination));
    const mappersCount = useRecoilValueLoadable(mappersCountSelector);

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
                {mappersList.state === 'loading' && <Loader />}
                {mappersList.state === 'hasValue' && (
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
                            {mappersList.contents.map((val) => {
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
                <Divider />
                {mappersCount.state === 'hasValue' && (
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
                            {mappersCount.contents < paginationLimit
                                ? 1
                                : Math.floor(
                                      mappersCount.contents / paginationLimit,
                                  ) + 1}
                        </div>
                        <Button
                            handleClick={() => {
                                setPage(pagination.page + 1, pagination);
                            }}
                            disabled={
                                pagination.page * paginationLimit >
                                mappersCount.contents
                            }
                        >
                            <FaAngleRight />
                        </Button>
                        <Button
                            handleClick={() => {
                                setPage(
                                    Math.floor(
                                        mappersCount.contents / paginationLimit,
                                    ) + 1,
                                    pagination,
                                );
                            }}
                            disabled={
                                mappersCount.contents <= paginationLimit ||
                                pagination.page ===
                                    Math.floor(
                                        mappersCount.contents / paginationLimit,
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

export default Mappers;
