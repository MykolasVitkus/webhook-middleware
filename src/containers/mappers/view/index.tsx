import React from 'react';
import Card from '../../../components/card';
import Container from '../../../components/container';
import Divider from '../../../components/divider';
import style from './style.module.scss';
import { JsonEditor as Editor } from 'jsoneditor-react';
import ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/github';
import { useHistory, useParams } from 'react-router';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import 'brace/theme/dracula';
import 'jsoneditor-react/es/editor.min.css';
import { mappersByIdSelector } from '../../../store/mappers/selector';
import jsonpathObjectTransform from '../../../lib/jsonpath-object-transform';
import Button from '../../../components/button';
import Routes from '../../../utils/routes';
import { FaEdit } from 'react-icons/fa';
import { deleteMapperModal } from '../../../store/mappers/atom';
import { DeleteModal } from '../modal';

export const MappersView: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { id } = useParams<any>();

    const history = useHistory();

    const changeRoute = (route: string) => {
        history.push(route);
    };

    const mapper = useRecoilValueLoadable(mappersByIdSelector(id));

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

    const [
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        deleteMapperModalState,
        setDeleteMapperModalState,
    ] = useRecoilState(deleteMapperModal);

    const openDeleteModal = (id) => {
        setDeleteMapperModalState({
            mapperId: id,
            open: true,
        });
    };

    return (
        <Container>
            <Card>
                <DeleteModal />
                {mapper.state === 'loading' && <div>Loading...</div>}
                {mapper.state === 'hasValue' && (
                    <div>
                        <div className={style.flex}>
                            <div>
                                <h1>{mapper.contents.name}</h1>
                                <h2>
                                    Created at{' '}
                                    {mapper.contents.createdAt.toDateString()}
                                </h2>
                            </div>

                            <div className={style.flex}>
                                <Button
                                    handleClick={() =>
                                        changeRoute(
                                            Routes.MappersEdit.replace(
                                                ':id',
                                                id,
                                            ),
                                        )
                                    }
                                >
                                    <FaEdit
                                        className={style.iconMargin}
                                    ></FaEdit>
                                    Edit
                                </Button>
                                <Button
                                    handleClick={() =>
                                        openDeleteModal(mapper.contents.id)
                                    }
                                >
                                    <FaEdit
                                        className={style.iconMargin}
                                    ></FaEdit>
                                    Delete
                                </Button>
                            </div>
                        </div>
                        <Divider />
                        <div className={style.form}>
                            <div className={style.editors}>
                                <div className={style.editor}>
                                    <div className={style.label}>From</div>
                                    <Editor
                                        value={mapper.contents.sample ?? {}}
                                        mode={'code'}
                                        ace={readOnlyAceFactory}
                                        theme={'ace/theme/dracula'}
                                        indentation={4}
                                        mainMenuBar={false}
                                        statusBar={false}
                                    />
                                </div>
                                <div className={style.editor}>
                                    <div className={style.label}>To</div>
                                    <Editor
                                        value={mapper.contents.format ?? {}}
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
                                    <div className={style.label}>Result</div>
                                    <Editor
                                        value={
                                            jsonpathObjectTransform(
                                                mapper.contents.sample,
                                                mapper.contents.format,
                                            ) ?? {}
                                        }
                                        ace={readOnlyAceFactory}
                                        mode={'code'}
                                        theme={'ace/theme/dracula'}
                                        mainMenuBar={false}
                                        indentation={4}
                                        statusBar={false}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </Container>
    );
};

export default MappersView;
