import React from 'react';
import { useHistory } from 'react-router';
import { useRecoilState } from 'recoil';
import Button from '../../../components/button';
import Divider from '../../../components/divider';
import Modal from '../../../components/modal';
import {
    deletePublisherModal,
    publishers,
} from '../../../store/publishers/atom';
import { deletePublisherQuery } from '../../../store/publishers/requests';
import { fromDictionary, toDictionary } from '../../../utils/parsers';
import Routes from '../../../utils/routes';
import style from './style.module.scss';

export const DeleteModal: React.FC = () => {
    const history = useHistory();

    const changeRoute = (route: string) => {
        history.push(route);
    };

    const [deletePublisherModalState, setDeletePublisherModalState] =
        useRecoilState(deletePublisherModal);

    const [publishersState, setPublishers] = useRecoilState(publishers);

    const deletePublisher = (id) => {
        deletePublisherQuery(id);
        setPublishers(
            toDictionary(
                fromDictionary(publishersState).filter((val) => val.id !== id),
                'id',
            ),
        );
        closeModal();
        changeRoute(Routes.Publishers);
    };

    const closeModal = () => {
        setDeletePublisherModalState({
            publisherId: '',
            open: false,
        });
    };

    return (
        <div>
            {deletePublisherModalState.open && (
                <Modal>
                    <div className={style.modalContent}>
                        <h1>Delete Publisher</h1>
                        <h2>This action is permanent</h2>
                        <Divider />
                        <p>Are you sure you want to delete this publisher?</p>
                        <div className={style.actions}>
                            <Button
                                handleClick={() =>
                                    deletePublisher(
                                        deletePublisherModalState.publisherId,
                                    )
                                }
                            >
                                Confirm
                            </Button>
                            <Button handleClick={() => closeModal()}>
                                Deny
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};
