import React, { useState } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import Card from '../../components/card';
import Container from '../../components/container';
import Divider from '../../components/divider';
import {
    webhooksFilteredCountSelector,
    webhooksFilteredSelector,
} from '../../store/webhooks/selector';
import { Filters, Webhook, WebhookStatus } from '../../store/webhooks/types';
import PublishedWebhook from '../webhooks/published';
import ReceivedWebhook from '../webhooks/received';
import style from './style.module.scss';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import SmallLoader from '../../components/small-loader';
import ReactDropdown from 'react-dropdown';
import {
    FaAngleDoubleLeft,
    FaAngleDoubleRight,
    FaAngleLeft,
    FaAngleRight,
    FaArrowLeft,
    FaArrowRight,
    FaCaretDown,
    FaCaretUp,
} from 'react-icons/fa';
import Button from '../../components/button';

const History: React.FC = () => {
    const [filters, setFilters] = useState<Filters>({
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
    });
    const webhooks = useRecoilValueLoadable(webhooksFilteredSelector(filters));
    const webhooksCount = useRecoilValueLoadable(
        webhooksFilteredCountSelector(filters),
    );

    const [page, setPage] = useState<number>(1);

    const types = {
        received_message: {
            value: 'received_message',
            label: 'Published',
        },
        sent_message: {
            value: 'sent_message',
            label: 'Forwarded',
        },
    };

    const typeOptions = [
        {
            value: '',
            label: 'All',
        },
        ...Object.values(types),
    ];

    const statuses = {
        success: {
            value: 'success',
            label: 'Success',
        },
        error: {
            value: 'error',
            label: 'Error',
        },
    };

    const statusOptions = [
        {
            value: '',
            label: 'All',
        },
        ...Object.values(statuses),
    ];

    const setPageAndFilter = (page) => {
        setPage(page);
        setFilters({
            ...filters,
            offset: (page * parseInt(filters.limit)).toString(),
        });
    };

    return (
        <Container>
            <Card>
                <div>
                    <h1>History</h1>
                    <h2>Review previous webhooks</h2>
                </div>
                <Divider />
                <div className={style.filters}>
                    <div className={style.filter}>
                        <label className={style.label}>Search</label>
                        <input
                            className={style.inputText}
                            value={filters.searchQuery || ''}
                            onChange={(e) => {
                                setFilters({
                                    ...filters,
                                    offset: '0',
                                    searchQuery: e.target.value,
                                });
                            }}
                        />
                    </div>
                    <div className={style.filter}>
                        <label className={style.label}>Date From</label>
                        <DayPickerInput
                            value={filters.dateFrom}
                            onDayChange={(day) => {
                                setFilters({
                                    ...filters,
                                    offset: '0',
                                    dateFrom: day,
                                });
                            }}
                            inputProps={{
                                className: style.inputText,
                            }}
                            placeholder=""
                            classNames={{
                                container: style.container,
                                overlay: style.overlay,
                                overlayWrapper: style.overlayWrapper,
                            }}
                        />
                    </div>
                    <div className={style.filter}>
                        <label className={style.label}>Date To</label>
                        <DayPickerInput
                            value={filters.dateTo}
                            onDayChange={(day) => {
                                setFilters({
                                    ...filters,
                                    offset: '0',
                                    dateTo: day,
                                });
                                setPage(1);
                            }}
                            inputProps={{ className: style.inputText }}
                            placeholder=""
                            classNames={{
                                container: style.container,
                                overlay: style.overlay,
                                overlayWrapper: style.overlayWrapper,
                            }}
                        />
                    </div>
                    <div className={style.filter}>
                        <label className={style.label}>Message Type</label>
                        <ReactDropdown
                            className={style.dropDownField}
                            controlClassName={style.dropDown}
                            menuClassName={style.dropDownMenu}
                            arrowClosed={<FaCaretDown />}
                            arrowOpen={<FaCaretUp />}
                            arrowClassName={style.dropDownArrow}
                            value={
                                filters.type
                                    ? types[filters.type]
                                    : typeOptions[0]
                            }
                            options={typeOptions}
                            onChange={(val) => {
                                setFilters({
                                    ...filters,
                                    offset: '0',
                                    type: val.value,
                                });
                                setPage(1);
                            }}
                        />
                    </div>
                    <div className={style.filter}>
                        <label className={style.label}>Status</label>
                        <ReactDropdown
                            className={style.dropDownField}
                            controlClassName={style.dropDown}
                            menuClassName={style.dropDownMenu}
                            arrowClosed={<FaCaretDown />}
                            arrowOpen={<FaCaretUp />}
                            arrowClassName={style.dropDownArrow}
                            value={
                                filters.status
                                    ? statuses[filters.status]
                                    : statusOptions[0]
                            }
                            options={statusOptions}
                            onChange={(val) => {
                                setFilters({
                                    ...filters,
                                    offset: '0',
                                    status: val.value as WebhookStatus,
                                });
                                setPage(1);
                            }}
                        />
                    </div>
                </div>
                <Divider />
                <div className={style.webhookList}>
                    {webhooks.state === 'loading' && <SmallLoader />}
                    {webhooks.state === 'hasValue' &&
                        webhooks.contents.map((webhook: Webhook) => {
                            return webhook.type === 'received_message' ? (
                                <PublishedWebhook webhook={webhook} />
                            ) : (
                                <ReceivedWebhook webhook={webhook} />
                            );
                        })}
                </div>
                {webhooksCount.state === 'hasValue' && (
                    <div className={style.pagination}>
                        <Button
                            handleClick={() => {
                                setPageAndFilter(1);
                            }}
                            disabled={page === 1}
                        >
                            <FaAngleDoubleLeft />
                        </Button>
                        <Button
                            handleClick={() => setPageAndFilter(page - 1)}
                            disabled={page === 1}
                        >
                            <FaAngleLeft />
                        </Button>
                        <div className={style.paginationText}>
                            {page} of{' '}
                            {webhooksCount.contents < parseInt(filters.limit)
                                ? 1
                                : Math.floor(
                                      webhooksCount.contents /
                                          parseInt(filters.limit),
                                  )}
                        </div>
                        <Button
                            handleClick={() => {
                                setPageAndFilter(page + 1);
                            }}
                            disabled={
                                (page + 1) * parseInt(filters.limit) >
                                webhooksCount.contents
                            }
                        >
                            <FaAngleRight />
                        </Button>
                        <Button
                            handleClick={() => {
                                setPageAndFilter(
                                    Math.floor(
                                        webhooksCount.contents /
                                            parseInt(filters.limit),
                                    ),
                                );
                            }}
                            disabled={
                                page === 1 ||
                                page ===
                                    Math.floor(
                                        webhooksCount.contents /
                                            parseInt(filters.limit),
                                    )
                            }
                        >
                            <FaAngleDoubleRight />
                        </Button>
                    </div>
                )}
            </Card>
        </Container>
    );
};

export default History;
