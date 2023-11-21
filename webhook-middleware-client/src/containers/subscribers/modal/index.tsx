import React from 'react';
import { useHistory } from 'react-router';
import { useRecoilState } from 'recoil';
import Button from '../../../components/button';
import Divider from '../../../components/divider';
import Modal from '../../../components/modal';
import {
    deleteSubscriberModal,
    subscribers,
} from '../../../store/subscribers/atom';
import { deleteSubscriberQuery } from '../../../store/subscribers/requests';
import { fromDictionary, toDictionary } from '../../../utils/parsers';
import Routes from '../../../utils/routes';
import style from './style.module.scss';

export const DeleteModal: React.FC = () => {
    const history = useHistory();

    const changeRoute = (route: string) => {
        history.push(route);
    };
    const [
        deleteSubscriberModalState,
        setDeleteSubscriberModalState,
    ] = useRecoilState(deleteSubscriberModal);

    const [subscribersState, setSubscribers] = useRecoilState(subscribers);

    const deleteSubscriber = (id: string) => {
        deleteSubscriberQuery(id);
        setSubscribers(
            toDictionary(
                fromDictionary(subscribersState).filter((val) => val.id !== id),
                'id',
            ),
        );
        closeModal();
        changeRoute(Routes.Subscribers);
    };

    const closeModal = () => {
        setDeleteSubscriberModalState({
            subscriberId: '',
            open: false,
        });
    };

    return (
        <div>
            {deleteSubscriberModalState.open && (
                <Modal>
                    <div className={style.modalContent}>
                        <h1>Delete Subscriber</h1>
                        <h2>This action is permanent</h2>
                        <Divider />
                        <p>Are you sure you want to delete this subscriber?</p>
                        <div className={style.actions}>
                            <Button
                                handleClick={() =>
                                    deleteSubscriber(
                                        deleteSubscriberModalState.subscriberId,
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
