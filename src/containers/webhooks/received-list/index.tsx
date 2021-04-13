import React, { useEffect, useState } from 'react';
import Divider from '../../../components/divider';
import {
    Webhook,
    WebhookLoaded,
    WebhookStatus,
} from '../../../store/webhooks/types';
import style from './style.module.scss';
import { JsonEditor as Editor } from 'jsoneditor-react';
import ace from 'brace';
import 'brace/theme/dracula';
import 'jsoneditor-react/es/editor.min.css';
import { useHistory } from 'react-router';
import Routes from '../../../utils/routes';
import { Subscriber } from '../../../store/subscribers/types';
import { FaRedo } from 'react-icons/fa';
import Button from '../../../components/button';
import {
    getReceivedWebhooksBySubscriberIdQuery,
    resendWebhookQuery,
} from '../../../store/webhooks/requests';

interface SubscriberWebhooksListProps {
    data: Webhook[];
    subscriber: Subscriber;
}

export const SubscriberWebhooksList: React.FC<SubscriberWebhooksListProps> = (
    props,
) => {
    const subscriber = props.subscriber;

    // const [webhooks, setWebhooks] = useRecoilStateLoadable(
    //     receivedWebhooksSelector(subscriber.id),
    // );

    const [webhooks, setWebhooks] = useState<Webhook[]>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        const getSubscriberWebhooks = async (id) => {
            setWebhooks(await getReceivedWebhooksBySubscriberIdQuery(id));
            setIsLoaded(true);
        };
        if (!isLoaded) {
            getSubscriberWebhooks(subscriber.id);
        }
    }, [isLoaded]);

    // eslint-disable-next-line @typescript-eslint/no-empty-function

    const history = useHistory();

    const changeRoute = (route: string) => {
        history.push(route);
    };

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

    const resendWebhook = (webhook: WebhookLoaded | Webhook) => {
        const getNewWebhook = async (id) => {
            await resendWebhookQuery(webhook.id).then(async () => {
                getReceivedWebhooksBySubscriberIdQuery(id).then((refreshed) => {
                    setWebhooks(refreshed);
                });
            });
        };
        getNewWebhook(subscriber.id);
    };

    return (
        <div className={style.webhookList}>
            {isLoaded &&
                webhooks.map((webhook) => {
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
                                            From Publisher{' '}
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
                                                {webhook.publisherId}
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
