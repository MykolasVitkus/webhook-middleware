import { JsonEditor as Editor } from 'jsoneditor-react';
import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { useHistory } from 'react-router';
import { useRecoilState } from 'recoil';
import Button from '../../../components/button';
import Divider from '../../../components/divider';
import { createMapperForm } from '../../../store/mappers/atom';
import { Webhook } from '../../../store/webhooks/types';
import Routes from '../../../utils/routes';
import style from './style.module.scss';
import ace from 'brace';
import 'brace/theme/dracula';
import 'jsoneditor-react/es/editor.min.css';

interface WebhookProps {
    webhook: Webhook;
}

const PublishedWebhook: React.FC<WebhookProps> = ({ webhook }) => {
    const [mapperForm, setMapperForm] = useRecoilState(createMapperForm);

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

                    <h2>Published by {webhook.publisherId}</h2>
                </div>

                <div className={style.flex}>
                    <Button
                        style={style.button}
                        handleClick={() => {
                            setMapperForm({
                                ...mapperForm,
                                sample: webhook.payload,
                            });
                            changeRoute(Routes.MappersNew);
                        }}
                    >
                        <FaPlus className={style.iconMargin}></FaPlus>
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
};

export default PublishedWebhook;
