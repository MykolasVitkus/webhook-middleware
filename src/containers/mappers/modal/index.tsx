import React from 'react';
import { useRecoilState } from 'recoil';
import Button from '../../../components/button';
import Divider from '../../../components/divider';
import Modal from '../../../components/modal';
import { deleteMapperModal, mappers } from '../../../store/mappers/atom';
import { deleteMapperQuery } from '../../../store/mappers/requests';
import { fromDictionary, toDictionary } from '../../../utils/parsers';
import style from './style.module.scss';

export const DeleteModal: React.FC = () => {
    const [deleteMapperModalState, setDeleteMapperModalState] = useRecoilState(
        deleteMapperModal,
    );

    const [mappersState, setMappers] = useRecoilState(mappers);

    const deleteMapper = (id) => {
        deleteMapperQuery(id);
        setMappers(
            toDictionary(
                fromDictionary(mappersState).filter((val) => val.id !== id),
                'id',
            ),
        );
        closeModal();
    };

    const closeModal = () => {
        setDeleteMapperModalState({
            mapperId: '',
            open: false,
        });
    };

    return (
        <div>
            {deleteMapperModalState.open && (
                <Modal>
                    <div className={style.modalContent}>
                        <h1>Delete Mapper</h1>
                        <h2>This action is permanent</h2>
                        <Divider />
                        <p>Are you sure you want to delete this mapper?</p>
                        <div className={style.actions}>
                            <Button
                                handleClick={() =>
                                    deleteMapper(
                                        deleteMapperModalState.mapperId,
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
