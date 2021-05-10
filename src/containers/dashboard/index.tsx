import React from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { useRecoilValueLoadable } from 'recoil';
import Card from '../../components/card';
import Container from '../../components/container';
import Divider from '../../components/divider';
import Loader from '../../components/loader';
import { statisticsSelector } from '../../store/dashboard/selector';
import style from './style.module.scss';

export const Dashboard: React.FC = () => {
    const statistics = useRecoilValueLoadable(statisticsSelector);

    const data2 = [
        {
            name: '05-07',
            received: 3,
        },
        {
            name: '05-08',
            received: 1,
        },
        {
            name: '05-09',
            received: 2,
        },
        {
            name: '05-10',
            received: 6,
        },
        {
            name: '05-11',
            received: 1,
        },
        {
            name: '05-12',
            received: 12,
        },
        {
            name: '05-13',
            received: 3,
        },
    ];

    const data1 = [
        {
            name: '05-07',
            sent: 3,
        },
        {
            name: '05-08',
            sent: 1,
        },
        {
            name: '05-09',
            sent: 2,
        },
        {
            name: '05-10',
            sent: 6,
        },
        {
            name: '05-11',
            sent: 1,
        },
        {
            name: '05-12',
            sent: 4,
        },
        {
            name: '05-13',
            sent: 3,
        },
    ];

    return (
        <Container>
            <Card>
                <div>
                    <h1>Dashboard</h1>
                    <h2>Monitor your performance</h2>
                </div>
                <Divider />
                <div>
                    <h1>Last Week</h1>
                </div>
                {statistics.state === 'loading' && <Loader />}
                {statistics.state === 'hasValue' && (
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
                                {statistics.contents.averageTime} ms
                            </div>
                            <div className={style.statisticTitle}>
                                Average time
                            </div>
                        </div>
                    </div>
                )}
                <div className={style.statistics}>
                    <div className={style.statisticGraph}>
                        <ResponsiveContainer
                            width="100%"
                            aspect={4.0 / 3.0}
                            min-height="300px"
                        >
                            <AreaChart
                                data={data2}
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
                                    dataKey="received"
                                    stroke="#8884d8"
                                    fillOpacity={1}
                                    fill="url(#colorReceived)"
                                />
                                <Tooltip />
                                <XAxis dataKey="name" />
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
                                data={data1}
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
                                    dataKey="sent"
                                    stroke="#82ca9d"
                                    fillOpacity={1}
                                    fill="url(#colorSent)"
                                />
                                <Tooltip />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={style.statistic}>Other</div>
                </div>
            </Card>
        </Container>
    );
};
