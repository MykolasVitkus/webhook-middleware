import React from 'react';
import { FaEye } from 'react-icons/fa';
import { useHistory } from 'react-router';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ComposedChart,
    ReferenceLine,
    ResponsiveContainer,
    Scatter,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { useRecoilValueLoadable } from 'recoil';
import Button from '../../components/button';
import Card from '../../components/card';
import Container from '../../components/container';
import Divider from '../../components/divider';
import Loader from '../../components/loader';
import { statisticsSelector } from '../../store/dashboard/selector';
import { webhooksFilteredSelector } from '../../store/webhooks/selector';
import { Webhook } from '../../store/webhooks/types';
import Routes from '../../utils/routes';
import PublishedWebhook from '../webhooks/published';
import ReceivedWebhook from '../webhooks/received';
import style from './style.module.scss';

export const Dashboard: React.FC = () => {
    const statistics = useRecoilValueLoadable(statisticsSelector);
    const webhooks = useRecoilValueLoadable(
        webhooksFilteredSelector({
            offset: '0',
            limit: '5',
            type: undefined,
            searchQuery: undefined,
            searchProperty: undefined,
            orderDirection: undefined,
            orderField: undefined,
            status: undefined,
            dateFrom: undefined,
            dateTo: undefined,
        }),
    );

    const history = useHistory();

    const changeRoute = (route: string) => {
        history.push(route);
    };

    return (
        <Container>
            <Card>
                <div>
                    <h1>Dashboard</h1>
                    <h2>Monitor your performance</h2>
                </div>
                <Divider />
                <div>
                    <h2>Last Week</h2>
                </div>
                {statistics.state === 'loading' && <Loader />}
                {statistics.state === 'hasValue' && (
                    <div>
                        <div className={style.statistics}>
                            <div className={style.statistic}>
                                <div className={style.statisticValue}>
                                    {statistics.contents.received}
                                </div>
                                <div className={style.statisticTitle}>
                                    Received Webhooks
                                </div>
                            </div>
                            <div className={style.statistic}>
                                <div className={style.statisticValue}>
                                    {statistics.contents.sent}
                                </div>
                                <div className={style.statisticTitle}>
                                    Sent Webhooks
                                </div>
                            </div>
                            <div className={style.statistic}>
                                <div className={style.statisticValue}>
                                    {statistics.contents.averageTime.toFixed(2)}{' '}
                                    ms
                                </div>
                                <div className={style.statisticTitle}>
                                    Average time
                                </div>
                            </div>
                        </div>

                        <div className={style.statistics}>
                            <div className={style.statisticGraph}>
                                <ResponsiveContainer
                                    width="100%"
                                    aspect={4.0 / 3.0}
                                    min-height="300px"
                                >
                                    <AreaChart
                                        data={statistics.contents.receivedDays}
                                        margin={{
                                            top: 10,
                                            right: 30,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <defs>
                                            <linearGradient
                                                id="colorReceived"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#8884d8"
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#8884d8"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#323743"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#8884d8"
                                            fillOpacity={1}
                                            fill="url(#colorReceived)"
                                        />
                                        <Tooltip />
                                        <XAxis dataKey="day" />
                                        <YAxis allowDecimals={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className={style.statisticGraph}>
                                <ResponsiveContainer
                                    width="100%"
                                    aspect={4.0 / 3.0}
                                    min-height="300px"
                                >
                                    <AreaChart
                                        data={statistics.contents.sentDays}
                                        margin={{
                                            top: 10,
                                            right: 30,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <defs>
                                            <linearGradient
                                                id="colorSent"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#82ca9d"
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#82ca9d"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#323743"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#82ca9d"
                                            fillOpacity={1}
                                            fill="url(#colorSent)"
                                        />
                                        <Tooltip />
                                        <XAxis dataKey="day" />
                                        <YAxis allowDecimals={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className={style.statisticGraph}>
                                <ResponsiveContainer
                                    width="100%"
                                    aspect={4.0 / 3.0}
                                    min-height="300px"
                                >
                                    <ComposedChart
                                        width={500}
                                        height={400}
                                        data={statistics.contents.executionTimes.map(
                                            (_value, _index) => ({
                                                index: _index,
                                                value: _value,
                                            }),
                                        )}
                                        margin={{
                                            top: 10,
                                            right: 30,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#323743"
                                        />
                                        <Tooltip />

                                        <XAxis dataKey="index" type="number" />
                                        <YAxis unit="ms" type="number" />
                                        <Scatter
                                            name="execution time"
                                            dataKey="value"
                                            fill="#82ca9d"
                                        />
                                        <ReferenceLine
                                            y={statistics.contents.averageTime}
                                            stroke="#ef767a"
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
            <Card>
                <div className={style.flex}>
                    <div>
                        <h1>Recent Webhooks</h1>
                        <h2>Currently displaying latest 5 webhooks</h2>
                    </div>
                    <div>
                        <Button handleClick={() => changeRoute(Routes.History)}>
                            <FaEye className={style.iconMargin} />
                            View More
                        </Button>
                    </div>
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
