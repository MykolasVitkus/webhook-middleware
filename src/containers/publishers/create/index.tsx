import React, { useState } from 'react';

import Card from '../../../components/card';
import Container from '../../../components/container';
import Divider from '../../../components/divider';
import Button from '../../../components/button';
import style from './style.module.scss';
import { useRecoilState } from 'recoil';
import { publishers } from '../../../store/publishers';
import { createPublisherQuery } from '../../../store/publishers/requests';
import { useHistory } from 'react-router';
import Routes from '../../../utils/routes';
import { PublisherForm } from '../../../store/publishers/types';

export const PublishersNew: React.FC = () => {
    const history = useHistory();

    const changeRoute = (route: string) => {
        history.push(route);
    };

    const [publishersForm, setPublishersForm] = useState<PublisherForm>({
        name: '',
    });

    const [
        publishersFormErrors,
        setPublishersFormErrors,
    ] = useState<PublisherForm>({
        name: '',
    });

    const [publishersState, setPublishers] = useRecoilState(publishers);

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
            const newPublisher = await createPublisherQuery(publishersForm);
            setPublishers({
                ...publishersState,
                [newPublisher.id]: newPublisher,
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
                <h1>Add Publisher</h1>
                <h2>Add a new publisher</h2>
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
            </Card>
        </Container>
    );
};
