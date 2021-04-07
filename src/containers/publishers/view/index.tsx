import React from 'react';
import { useParams } from 'react-router';
import { useRecoilValueLoadable } from 'recoil';
import Card from '../../../components/card';
import Container from '../../../components/container';
import { publishersByIdSelector } from '../../../store/publishers/selector';
// import style from './style.module.scss';

export const PublisherView: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { id } = useParams<any>();
    const publisher = useRecoilValueLoadable(publishersByIdSelector(id));

    return (
        <Container>
            <Card>
                {publisher.state === 'loading' && <div>Loading</div>}
                {publisher.state === 'hasValue' && (
                    <div>
                        <h1>{publisher.contents.name}</h1>
                        <h2>
                            Created at{' '}
                            {publisher.contents.createdAt.toDateString()}
                        </h2>
                    </div>
                )}
            </Card>
        </Container>
    );
};
