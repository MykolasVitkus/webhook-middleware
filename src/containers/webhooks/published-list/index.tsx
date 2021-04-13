import React from 'react';
import Divider from '../../../components/divider';
import { Webhook } from '../../../store/webhooks/types';
import style from './style.module.scss';
import { JsonEditor as Editor } from 'jsoneditor-react';
import ace from 'brace';
import 'brace/theme/dracula';
import 'jsoneditor-react/es/editor.min.css';
import Button from '../../../components/button';
import { FaPlus } from 'react-icons/fa';
import { Publisher } from '../../../store/publishers/types';
import { useRecoilState } from 'recoil';
import { createMapperFormat } from '../../../store/mappers/atom';
import { useHistory } from 'react-router';
import Routes from '../../../utils/routes';

interface PublisherWebhooksListProps {
    data: Webhook[];
    publisher: Publisher;
}

export const PublisherWebhooksList: React.FC<PublisherWebhooksListProps> = (
    props,
) => {
    const webhooks = props.data;
    const publisher = props.publisher;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [fromFormat, setFromFormat] = useRecoilState(createMapperFormat);

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

    return (
        <div className={style.webhookList}>
            {webhooks.map((webhook) => {
                return (
                    <div className={style.webhook} key={webhook.id}>
                        <div className={style.webhookHeader}>
                            <div className={style.flex}>
                                <h1 className={style.flexRow}>
                                    Published at{' '}
                                    {webhook.createdAt.toLocaleString('en-LT', {
                                        hour12: false,
                                    })}
                                    <div className={style.webhookStatusSuccess}>
                                        {webhook.status}
                                    </div>
                                </h1>

                                <h2>By {publisher.name}</h2>
                            </div>

                            <div className={style.flex}>
                                <Button
                                    style={style.button}
                                    handleClick={() => {
                                        setFromFormat(webhook.payload);
                                        changeRoute(Routes.MappersNew);
                                    }}
                                >
                                    <FaPlus
                                        className={style.iconMargin}
                                    ></FaPlus>
                                    Create Mapper
                                </Button>
                            </div>
                        </div>

                        <Divider />
                        <div className={style.payload}>
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
                    </div>
                );
            })}
        </div>
    );
};
