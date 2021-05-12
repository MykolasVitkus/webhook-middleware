import React, { useEffect, useState } from 'react';
import { Webhook } from '../../../store/webhooks/types';
import style from './style.module.scss';
import { Subscriber } from '../../../store/subscribers/types';
import { getReceivedWebhooksBySubscriberIdQuery } from '../../../store/webhooks/requests';
import ReceivedWebhook from '../received';
import Loader from '../../../components/loader';

interface SubscriberWebhooksListProps {
    data: Webhook[];
    subscriber: Subscriber;
}

export const SubscriberWebhooksList: React.FC<SubscriberWebhooksListProps> = (
    props,
) => {
    const subscriber = props.subscriber;
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

    return (
        <div className={style.webhookList}>
            {!isLoaded && <Loader />}
            {isLoaded &&
                webhooks.map((webhook) => {
                    return (
                        <ReceivedWebhook webhook={webhook} key={webhook.id} />
                    );
                })}
        </div>
    );
};
