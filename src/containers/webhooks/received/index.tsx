import React from 'react';
import { useHistory } from 'react-router';
import style from './style.module.scss';
import { JsonEditor as Editor } from 'jsoneditor-react';
import ace from 'brace';
import 'brace/theme/dracula';
import 'jsoneditor-react/es/editor.min.css';
import Routes from '../../../utils/routes';
import { FaRedo } from 'react-icons/fa';
import Button from '../../../components/button';
import { resendWebhookQuery } from '../../../store/webhooks/requests';
import Divider from '../../../components/divider';
import {
    Webhook,
    WebhookLoaded,
    WebhookStatus,
} from '../../../store/webhooks/types';

interface WebhookProps {
    webhook: Webhook;
}

const ReceivedWebhook: React.FC<WebhookProps> = ({ webhook }) => {
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
        resendWebhookQuery(webhook.id);
    };

    return (
        <div className={style.webhook} key={webhook.id}>
            <div className={style.webhookHeader}>
                <div className={style.flexRowFullWidth}>
                    <div>
                        <h1 className={style.flexRow}>
                            Forwarded at{' '}
                            {webhook.createdAt.toLocaleString('en-LT', {
                                hour12: false,
                            })}
                            <div
                                className={
                                    webhook.status == WebhookStatus.Success
                                        ? style.webhookStatusSuccess
                                        : style.webhookStatusError
                                }
                            >
                                {webhook.status}
                            </div>
                        </h1>

                        <h2 className={style.flexRow}>
                            To Subscriber{' '}
                            <div
                                className={style.link}
                                onClick={() =>
                                    changeRoute(
                                        Routes.SubscribersView.replace(
                                            ':id',
                                            webhook.subscriberId as string,
                                        ),
                                    )
                                }
                            >
                                #{webhook.subscriberId}
                            </div>
                        </h2>
                    </div>

                    <div className={style.flex}>
                        <Button
                            style={style.button}
                            handleClick={() => resendWebhook(webhook)}
                        >
                            <FaRedo className={style.iconMargin}></FaRedo>
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
};

export default ReceivedWebhook;
