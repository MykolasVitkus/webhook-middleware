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
import Loader from '../../../components/loader';
import ReactDropdown from 'react-dropdown';
import { FaCaretDown, FaCaretUp, FaMinus, FaPlus } from 'react-icons/fa';

export const SubscribersCreate: React.FC = () => {
    const history = useHistory();

    const changeRoute = (route: string) => {
        history.push(route);
    };

    const [subscriberForm, setSubscriberForm] =
        useRecoilState<SubscriberForm>(createSubscriberForm);

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
                                    <FaPlus
                                        className={style.iconMargin}
                                    ></FaPlus>
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
                                            <div
                                                className={
                                                    style.subscriptionField
                                                }
                                            >
                                                {publishersState.state ===
                                                    'loading' && <Loader />}
                                                {publishersState.state ===
                                                    'hasValue' && (
                                                    <div
                                                        className={style.select}
                                                    >
                                                        <label
                                                            className={
                                                                style.label
                                                            }
                                                        >
                                                            Publisher
                                                        </label>
                                                        <ReactDropdown
                                                            className={
                                                                style.dropDownField
                                                            }
                                                            controlClassName={
                                                                style.dropDown
                                                            }
                                                            menuClassName={
                                                                style.dropDownMenu
                                                            }
                                                            arrowClosed={
                                                                <FaCaretDown />
                                                            }
                                                            arrowOpen={
                                                                <FaCaretUp />
                                                            }
                                                            arrowClassName={
                                                                style.dropDownArrow
                                                            }
                                                            value={
                                                                subscriberForm
                                                                    .subscribedTo[
                                                                    index
                                                                ].publisherId
                                                            }
                                                            options={publishersState.contents.map(
                                                                (
                                                                    pub: Publisher,
                                                                ) => {
                                                                    return {
                                                                        label: pub.name,
                                                                        value: pub.id,
                                                                    };
                                                                },
                                                            )}
                                                            onChange={(e) => {
                                                                setSubscriberForm(
                                                                    {
                                                                        ...subscriberForm,
                                                                        subscribedTo:
                                                                            [
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
                                                                                        e.value,
                                                                                },
                                                                                ...subscriberForm.subscribedTo.slice(
                                                                                    index +
                                                                                        1,
                                                                                ),
                                                                            ],
                                                                    },
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div className={style.field}>
                                                {mappersState.state ===
                                                    'loading' && <Loader />}
                                                {mappersState.state ===
                                                    'hasValue' && (
                                                    <div
                                                        className={style.select}
                                                    >
                                                        <label
                                                            className={
                                                                style.label
                                                            }
                                                        >
                                                            Mapper
                                                        </label>
                                                        <ReactDropdown
                                                            className={
                                                                style.dropDownField
                                                            }
                                                            controlClassName={
                                                                style.dropDown
                                                            }
                                                            menuClassName={
                                                                style.dropDownMenu
                                                            }
                                                            arrowClosed={
                                                                <FaCaretDown />
                                                            }
                                                            arrowOpen={
                                                                <FaCaretUp />
                                                            }
                                                            arrowClassName={
                                                                style.dropDownArrow
                                                            }
                                                            value={
                                                                subscriberForm
                                                                    .subscribedTo[
                                                                    index
                                                                ].mapperId
                                                            }
                                                            options={mappersState.contents.map(
                                                                (
                                                                    pub: Publisher,
                                                                ) => {
                                                                    return {
                                                                        label: pub.name,
                                                                        value: pub.id,
                                                                    };
                                                                },
                                                            )}
                                                            onChange={(e) => {
                                                                setSubscriberForm(
                                                                    {
                                                                        ...subscriberForm,
                                                                        subscribedTo:
                                                                            [
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
                                                                                        e.value,
                                                                                },
                                                                                ...subscriberForm.subscribedTo.slice(
                                                                                    index +
                                                                                        1,
                                                                                ),
                                                                            ],
                                                                    },
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                handleClick={(e) => {
                                                    e.preventDefault();
                                                    setSubscriberForm({
                                                        ...subscriberForm,
                                                        subscribedTo:
                                                            subscriberForm.subscribedTo.filter(
                                                                (val, i) =>
                                                                    i !== index,
                                                            ),
                                                    });
                                                }}
                                            >
                                                <div className={style.remove}>
                                                    <FaMinus
                                                        className={
                                                            style.iconMargin
                                                        }
                                                    ></FaMinus>
                                                    Remove Subscription
                                                </div>
                                            </Button>
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
