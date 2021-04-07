import React, { useEffect, useState } from 'react';

import Card from '../../../components/card';
import Container from '../../../components/container';
import Divider from '../../../components/divider';
import Button from '../../../components/button';
import style from './style.module.scss';
import { useRecoilState } from 'recoil';
import {
    editPublisherQuery,
    getPublisherByIdQuery,
} from '../../../store/publishers/requests';
import { useHistory, useParams } from 'react-router-dom';
import Routes from '../../../utils/routes';
import { PublisherForm } from '../../../store/publishers/types';
import { publishers } from '../../../store/publishers/atom';

export const PublishersEdit: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { id } = useParams<any>();
    const history = useHistory();

    const [isLoaded, setIsLoaded] = useState(false);
    const [publishersForm, setPublishersForm] = useState<PublisherForm>({
        name: '',
    });
    const [publishersState, setPublishers] = useRecoilState(publishers);

    useEffect(() => {
        const getPublisher = async () => {
            let publisher = publishersState[id];
            if (!publisher) {
                publisher = await getPublisherByIdQuery(id);
            }
            setPublishersForm({
                name: publisher.name,
            });
            setIsLoaded(true);
        };
        getPublisher();
    }, []);

    const changeRoute = (route: string) => {
        history.push(route);
    };

    const [
        publishersFormErrors,
        setPublishersFormErrors,
    ] = useState<PublisherForm>({
        name: '',
    });

    const onChangeName = (e) => {
        setPublishersForm({ ...publishersForm, name: e.target.value });
    };

    const submitForm = async (e) => {
        e.preventDefault();
        const errors = validate(publishersForm);
        if (!errors) {
            setPublishersFormErrors({
                name: '',
            });
            const updatedPublisher = await editPublisherQuery(
                publishersForm,
                id,
            );
            console.log(updatedPublisher);
            setPublishers({
                ...publishersState,
                [updatedPublisher.id]: updatedPublisher,
            });
            changeRoute(Routes.Publishers);
        }
    };

    const validate: (form: PublisherForm) => boolean = (
        form: PublisherForm,
    ) => {
        let errors = false;
        Object.keys(form).map((key) => {
            switch (key) {
                case 'name':
                    if (form[key].length < 1) {
                        errors = true;
                        setPublishersFormErrors({
                            ...publishersFormErrors,
                            name: 'This value cannot be empty.',
                        });
                    }
                    break;
                default:
                    break;
            }
        });
        return errors;
    };

    return (
        <Container>
            <Card>
                {isLoaded && (
                    <div>
                        <h1>Edit Publisher</h1>
                        <h2>Change the parameters of this publisher</h2>
                        <Divider />
                        <form className={style.form}>
                            <div className={style.field}>
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className={
                                        publishersFormErrors.name.length > 0
                                            ? style.inputError
                                            : style.input
                                    }
                                    autoComplete="off"
                                    value={publishersForm.name}
                                    onChange={(e) => onChangeName(e)}
                                ></input>
                                <div className={style.errorMessage}>
                                    {publishersFormErrors.name}
                                </div>
                            </div>
                            <div className={style.button}>
                                <Button handleClick={(e) => submitForm(e)}>
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </Card>
        </Container>
    );
};
