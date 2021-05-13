import React, { useState } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import Card from '../../components/card';
import Container from '../../components/container';
import Divider from '../../components/divider';
import Loader from '../../components/loader';
import { webhooksFilteredSelector } from '../../store/webhooks/selector';
import { Filters, Webhook } from '../../store/webhooks/types';
import PublishedWebhook from '../webhooks/published';
import ReceivedWebhook from '../webhooks/received';
import style from './style.module.scss';

const History: React.FC = () => {
    const [filters, setFilters] = useState<Filters>({
        offset: '0',
        limit: '10',
        type: null,
        searchQuery: null,
        searchProperty: null,
        orderDirection: null,
        orderField: null,
        status: null,
    });
    const webhooks = useRecoilValueLoadable(webhooksFilteredSelector(filters));
    return (
        <Container>
            <Card>
                <div>
                    <h1>History</h1>
                    <h2>Review previous webhooks</h2>
                </div>
                <Divider />
                <div className={style.filters}>
                    <input
                        className={style.inputText}
                        placeholder="Search"
                        value={filters.searchQuery || ''}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                searchQuery: e.target.value,
                            })
                        }
                    />
                </div>
                <Divider />
                <div className={style.webhookList}>
                    {webhooks.state === 'loading' && <Loader />}
                    {webhooks.state === 'hasValue' &&
                        webhooks.contents.map((webhook: Webhook) => {
                            return webhook.type === 'received_message' ? (
                                <PublishedWebhook webhook={webhook} />
                            ) : (
                                <ReceivedWebhook webhook={webhook} />
                            );
                        })}
                </div>
            </Card>
        </Container>
    );
};

export default History;
