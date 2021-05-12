import React from 'react';
import { Webhook } from '../../../store/webhooks/types';
import style from './style.module.scss';
import { Publisher } from '../../../store/publishers/types';
import PublishedWebhook from '../published';

interface PublisherWebhooksListProps {
    data: Webhook[];
    publisher: Publisher;
}

export const PublisherWebhooksList: React.FC<PublisherWebhooksListProps> = (
    props,
) => {
    const webhooks = props.data;

    return (
        <div className={style.webhookList}>
            {webhooks.map((webhook) => {
                return <PublishedWebhook webhook={webhook} />;
            })}
        </div>
    );
};
