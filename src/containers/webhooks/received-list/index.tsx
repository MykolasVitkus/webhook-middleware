import React from 'react';
import Divider from '../../../components/divider';
import { Webhook, WebhookStatus } from '../../../store/webhooks/types';
import style from './style.module.scss';
import { JsonEditor as Editor } from 'jsoneditor-react';
import ace from 'brace';
import 'brace/theme/dracula';
import 'jsoneditor-react/es/editor.min.css';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import { useHistory } from 'react-router';
import Routes from '../../../utils/routes';
import { Subscriber } from '../../../store/subscribers/types';
import { publishersByIdSelector } from '../../../store/publishers/selector';
import { FaRedo } from 'react-icons/fa';
import Button from '../../../components/button';
import { webhooks as webhooksState } from '../../../store/webhooks/atom';
import { resendWebhookQuery } from '../../../store/webhooks/requests';

interface SubscriberWebhooksListProps {
    data: Webhook[];
    subscriber: Subscriber;
}

export const SubscriberWebhooksList: React.FC<SubscriberWebhooksListProps> = (
    props,
) => {
    const webhooks = props.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const subscriber = props.subscriber;

    const history = useHistory();

    const changeRoute = (route: string) => {
        history.push(route);
    };

    const [allWebhooks, setAllWebhooks] = useRecoilState(webhooksState);

    const readOnlyAceFactory = {
        edit: (domElement) => {
            const editor = ace.edit(domElement);
            setTimeout(() => {
                editor.setReadOnly(true);
                editor.setHighlightActiveLine(false);
                editor.setOption('highlightGutterLine', false);
            });
            return editor;
        },
    };

    const getPublisherName = (webhook) => {
        const publisher = useRecoilValueLoadable(
            publishersByIdSelector(webhook.publisherId as string),
        );
        switch (publisher.state) {
            case 'loading':
                return 'Loading...';
            case 'hasValue':
                return publisher.contents.name;
        }
    };

    const resendWebhook = (webhook: Webhook) => {
        const getNewWebhook = async () => {
            const newWebhook = await resendWebhookQuery(webhook.id);
            setAllWebhooks({
                ...allWebhooks,
                [newWebhook.id]: newWebhook,
            });
        };
        getNewWebhook();
    };

    return (
        <div className={style.webhookList}>
            {webhooks.map((webhook) => {
                return (
                    <div className={style.webhook} key={webhook.id}>
                        <div className={style.webhookHeader}>
                            <div className={style.flexRowFullWidth}>
                                <div>
                                    <h1 className={style.flexRow}>
                                        Received at{' '}
                                        {webhook.createdAt.toLocaleString(
                                            'en-LT',
                                            {
                                                hour12: false,
                                            },
                                        )}
                                        <div
                                            className={
                                                webhook.status ==
                                                WebhookStatus.Success
                                                    ? style.webhookStatusSuccess
                                                    : style.webhookStatusError
                                            }
                                        >
                                            {webhook.status}
                                        </div>
                                    </h1>

                                    <h2 className={style.flexRow}>
                                        From{' '}
                                        <div
                                            className={style.link}
                                            onClick={() =>
                                                changeRoute(
                                                    Routes.PublishersView.replace(
                                                        ':id',
                                                        webhook.publisherId as string,
                                                    ),
                                                )
                                            }
                                        >
                                            {getPublisherName(webhook)}
                                        </div>
                                    </h2>
                                </div>

                                <div className={style.flex}>
                                    <Button
                                        style={style.button}
                                        handleClick={() =>
                                            resendWebhook(webhook)
                                        }
                                    >
                                        <FaRedo
                                            className={style.iconMargin}
                                        ></FaRedo>
                                        Resend
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <Divider />
                        <div className={style.payload}>
                            <div className={style.editors}>
                                <div className={style.editor}>
                                    <h2>Payload sent to Subscriber</h2>
                                    <Editor
                                        value={webhook.payload ?? {}}
                                        navigationBar={false}
                                        mainMenuBar={false}
                                        statusBar={false}
                                        mode={'code'}
                                        theme={'ace/theme/dracula'}
                                        indentation={4}
                                        ace={readOnlyAceFactory}
                                    />
                                </div>
                                <div className={style.editor}>
                                    <h2>Response from Subscriber</h2>
                                    <Editor
                                        value={webhook.metadata ?? {}}
                                        navigationBar={false}
                                        mainMenuBar={false}
                                        statusBar={false}
                                        mode={'code'}
                                        theme={'ace/theme/dracula'}
                                        indentation={4}
                                        ace={readOnlyAceFactory}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
