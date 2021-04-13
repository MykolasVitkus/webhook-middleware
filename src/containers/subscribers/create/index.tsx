import React, { useState } from 'react';
import Card from '../../../components/card';
import Container from '../../../components/container';
import Divider from '../../../components/divider';
import style from './style.module.scss';
import 'brace/mode/json';
import 'brace/theme/github';
import Button from '../../../components/button';
import Routes from '../../../utils/routes';
import { useHistory } from 'react-router';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import { Mapper } from '../../../store/mappers/types';
import 'brace/theme/dracula';
import 'jsoneditor-react/es/editor.min.css';
import {
    SubscribedPublisher,
    SubscriberForm,
} from '../../../store/subscribers/types';
import {
    createSubscriberForm,
    subscribers,
} from '../../../store/subscribers/atom';
import { createSubscriberQuery } from '../../../store/subscribers/requests';
import { mappersQuerySelector } from '../../../store/mappers/selector';
import { publishersQuerySelector } from '../../../store/publishers/selector';
import { Publisher } from '../../../store/publishers/types';

export const SubscribersCreate: React.FC = () => {
    const history = useHistory();

    const changeRoute = (route: string) => {
        history.push(route);
    };

    const [subscriberForm, setSubscriberForm] = useRecoilState<SubscriberForm>(
        createSubscriberForm,
    );

    const [subscriberFormErrors, setSubscriberFormErrors] = useState({
        name: '',
        webhookUrl: '',
        subscribedTo: [],
    });

    const publishersState = useRecoilValueLoadable(publishersQuerySelector);
    const mappersState = useRecoilValueLoadable(mappersQuerySelector);

    const [subscribersState, setSubscribers] = useRecoilState(subscribers);

    const submitForm = async (e) => {
        console.log(subscriberForm);
        e.preventDefault();
        const errors = validate(subscriberForm);
        if (!errors) {
            setSubscriberFormErrors({
                name: '',
                webhookUrl: '',
                subscribedTo: [],
            });
            const newSubscriber = await createSubscriberQuery(subscriberForm);
            setSubscribers({
                ...subscribersState,
                [newSubscriber.id]: newSubscriber,
            });
            setSubscriberForm({
                name: '',
                webhookUrl: '',
                subscribedTo: [],
            });
            changeRoute(Routes.Subscribers);
        }
    };

    const validate: (form: SubscriberForm) => boolean = (
        form: SubscriberForm,
    ) => {
        let errors = false;
        Object.keys(form).map((key) => {
            switch (key) {
                case 'name':
                    if (form[key].length < 1) {
                        errors = true;
                        setSubscriberFormErrors({
                            ...subscriberFormErrors,
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

    const addSubscription = (e) => {
        e.preventDefault();
        if (
            publishersState.state === 'hasValue' &&
            mappersState.state === 'hasValue'
        ) {
            setSubscriberForm({
                ...subscriberForm,
                subscribedTo: [
                    ...subscriberForm.subscribedTo,
                    {
                        publisherId:
                            publishersState.contents.length > 0
                                ? publishersState.contents[0].id
                                : '',
                        mapperId:
                            mappersState.contents.length > 0
                                ? mappersState.contents[0].id
                                : '',
                    },
                ],
            });
        }
    };

    return (
        <Container>
            <Card>
                <div>
                    <h1>New Subscriber</h1>
                    <h2>Configure your Subscriber</h2>
                    <Divider />
                    <form className={style.form}>
                        <div className={style.field}>
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                className={
                                    subscriberFormErrors.name.length > 0
                                        ? style.inputError
                                        : style.input
                                }
                                autoComplete="off"
                                value={subscriberForm.name}
                                onChange={(e) =>
                                    setSubscriberForm({
                                        ...subscriberForm,
                                        name: e.target.value,
                                    })
                                }
                            ></input>
                            <div className={style.errorMessage}>
                                {subscriberFormErrors.name}
                            </div>
                        </div>
                        <div className={style.field}>
                            <label>Webhook Url</label>
                            <input
                                type="text"
                                name="webhookurl"
                                className={
                                    subscriberFormErrors.name.length > 0
                                        ? style.inputError
                                        : style.input
                                }
                                autoComplete="off"
                                value={subscriberForm.webhookUrl}
                                onChange={(e) =>
                                    setSubscriberForm({
                                        ...subscriberForm,
                                        webhookUrl: e.target.value,
                                    })
                                }
                            ></input>
                            <div className={style.errorMessage}>
                                {subscriberFormErrors.name}
                            </div>
                        </div>
                        <div className={style.field}>
                            <div className={style.button}>
                                <Button handleClick={(e) => addSubscription(e)}>
                                    Add Subscriber
                                </Button>
                            </div>
                        </div>
                        <div className={style.subscriptions}>
                            {subscriberForm.subscribedTo.map(
                                (
                                    subscription: SubscribedPublisher,
                                    index: number,
                                ) => {
                                    return (
                                        <div
                                            className={style.selects}
                                            key={index}
                                        >
                                            <div className={style.field}>
                                                <label>Publisher</label>
                                                {publishersState.state ===
                                                    'loading' && (
                                                    <div>Loading...</div>
                                                )}
                                                {publishersState.state ===
                                                    'hasValue' && (
                                                    <select
                                                        value={
                                                            subscriberForm
                                                                .subscribedTo[
                                                                index
                                                            ].publisherId
                                                        }
                                                        onChange={(e) => {
                                                            setSubscriberForm({
                                                                ...subscriberForm,
                                                                subscribedTo: [
                                                                    ...subscriberForm.subscribedTo.slice(
                                                                        0,
                                                                        index,
                                                                    ),
                                                                    {
                                                                        ...subscriberForm
                                                                            .subscribedTo[
                                                                            index
                                                                        ],
                                                                        publisherId:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    },
                                                                    ...subscriberForm.subscribedTo.slice(
                                                                        index +
                                                                            1,
                                                                    ),
                                                                ],
                                                            });
                                                        }}
                                                    >
                                                        {publishersState.contents.map(
                                                            (
                                                                publisher: Publisher,
                                                                key: number,
                                                            ) => {
                                                                return (
                                                                    <option
                                                                        key={index
                                                                            .toString()
                                                                            .concat(
                                                                                key.toString(),
                                                                            )}
                                                                        value={
                                                                            publisher.id
                                                                        }
                                                                    >
                                                                        {
                                                                            publisher.name
                                                                        }
                                                                    </option>
                                                                );
                                                            },
                                                        )}
                                                    </select>
                                                )}
                                            </div>
                                            <div className={style.field}>
                                                <label>Mapper</label>

                                                {mappersState.state ===
                                                    'loading' && (
                                                    <div>Loading...</div>
                                                )}
                                                {mappersState.state ===
                                                    'hasValue' && (
                                                    <select
                                                        value={
                                                            subscriberForm
                                                                .subscribedTo[
                                                                index
                                                            ].mapperId
                                                        }
                                                        onChange={(e) => {
                                                            setSubscriberForm({
                                                                ...subscriberForm,
                                                                subscribedTo: [
                                                                    ...subscriberForm.subscribedTo.slice(
                                                                        0,
                                                                        index,
                                                                    ),
                                                                    {
                                                                        ...subscriberForm
                                                                            .subscribedTo[
                                                                            index
                                                                        ],
                                                                        mapperId:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    },
                                                                    ...subscriberForm.subscribedTo.slice(
                                                                        index +
                                                                            1,
                                                                    ),
                                                                ],
                                                            });
                                                        }}
                                                    >
                                                        {mappersState.contents.map(
                                                            (
                                                                mapper: Mapper,
                                                                key: number,
                                                            ) => {
                                                                return (
                                                                    <option
                                                                        key={index
                                                                            .toString()
                                                                            .concat(
                                                                                key.toString(),
                                                                            )}
                                                                        value={
                                                                            mapper.id
                                                                        }
                                                                    >
                                                                        {
                                                                            mapper.name
                                                                        }
                                                                    </option>
                                                                );
                                                            },
                                                        )}
                                                    </select>
                                                )}
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                        <div className={style.button}>
                            <Button handleClick={(e) => submitForm(e)}>
                                Submit
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </Container>
    );
};

export default SubscribersCreate;
