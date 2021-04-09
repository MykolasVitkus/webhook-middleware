import React, { useEffect, useState } from 'react';
import Card from '../../../components/card';
import Container from '../../../components/container';
import Divider from '../../../components/divider';
import style from './style.module.scss';
import { JsonEditor as Editor } from 'jsoneditor-react';
import ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/github';
import Button from '../../../components/button';
import Routes from '../../../utils/routes';
import { useHistory, useParams } from 'react-router';
import { useRecoilState } from 'recoil';
import { mappers } from '../../../store/mappers/atom';
import {
    editMapperQuery,
    getMapperByIdQuery,
} from '../../../store/mappers/requests';
import { MapperForm } from '../../../store/mappers/types';
import jsonpathObjectTransform from '../../../lib/jsonpath-object-transform';
import 'brace/theme/dracula';
import 'jsoneditor-react/es/editor.min.css';

export const MappersEdit: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { id } = useParams<any>();

    const history = useHistory();

    const changeRoute = (route: string) => {
        history.push(route);
    };

    const [transformedFormat, setTransformedFormat] = useState({});

    const [mappersForm, setMappersForm] = useState<MapperForm>({
        name: '',
        format: {},
        sample: {},
    });

    const [mapperFormErrors, setMapperFormErrors] = useState({
        name: '',
        format: '',
        sample: '',
    });
    const [isLoaded, setIsLoaded] = useState(false);
    const [mappersState, setMappers] = useRecoilState(mappers);

    useEffect(() => {
        const getMapper = async () => {
            let mapper = mappersState[id];
            if (!mapper) {
                mapper = await getMapperByIdQuery(id);
            }
            setMappersForm({
                name: mapper.name,
                format: mapper.format,
                sample: mapper.sample,
            });
            const newFormat = jsonpathObjectTransform(
                mapper.sample,
                mapper.format,
            );
            setTransformedFormat(newFormat);
            setIsLoaded(true);
        };
        getMapper();
    }, []);

    const submitForm = async (e) => {
        e.preventDefault();
        const errors = validate(mappersForm);
        if (!errors) {
            setMapperFormErrors({
                name: '',
                format: '',
                sample: '',
            });
            const updatedMapper = await editMapperQuery(mappersForm, id);
            setMappers({
                ...mappersState,
                [updatedMapper.id]: updatedMapper,
            });
            setMappersForm({
                name: '',
                format: {},
                sample: {},
            });
            changeRoute(Routes.Mappers);
        }
    };

    const onBaseFormatChange = (data) => {
        setMappersForm({
            ...mappersForm,
            sample: data,
        });
        const newFormat = jsonpathObjectTransform(data, mappersForm.format);
        setTransformedFormat(newFormat);
    };

    const onMapperFormatChange = (data) => {
        setMappersForm({
            ...mappersForm,
            format: data,
        });
        const newFormat = jsonpathObjectTransform(mappersForm.sample, data);
        setTransformedFormat(newFormat);
    };

    const validate: (form: MapperForm) => boolean = (form: MapperForm) => {
        let errors = false;
        Object.keys(form).map((key) => {
            switch (key) {
                case 'name':
                    if (form[key].length < 1) {
                        errors = true;
                        setMapperFormErrors({
                            ...mapperFormErrors,
                            name: 'This value cannot be empty.',
                        });
                    }
                    break;
                default:
                    break;
            }
        });
        return errors;
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

    const aceEditor = {
        edit: (domElement) => {
            const editor = ace.edit(domElement);
            setTimeout(() => {
                editor.setHighlightActiveLine(false);
                editor.setOption('highlightGutterLine', false);
            });
            return editor;
        },
    };

    return (
        <Container>
            <Card>
                {!isLoaded && <div>Loading...</div>}
                {isLoaded && (
                    <div>
                        <h1>Edit Mapper</h1>
                        <h2>Edit your mapper</h2>
                        <Divider />
                        <form className={style.form}>
                            <div className={style.field}>
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className={
                                        mapperFormErrors.name.length > 0
                                            ? style.inputError
                                            : style.input
                                    }
                                    autoComplete="off"
                                    value={mappersForm.name ?? ''}
                                    onChange={(e) =>
                                        setMappersForm({
                                            ...mappersForm,
                                            name: e.target.value,
                                        })
                                    }
                                ></input>
                                <div className={style.errorMessage}>
                                    {mapperFormErrors.name}
                                </div>
                            </div>
                            <div className={style.editors}>
                                <div className={style.editor}>
                                    <div className={style.label}>From</div>
                                    <Editor
                                        value={mappersForm.sample ?? {}}
                                        onChange={(content) =>
                                            onBaseFormatChange(content)
                                        }
                                        mode={'code'}
                                        ace={aceEditor}
                                        theme={'ace/theme/dracula'}
                                        indentation={4}
                                        mainMenuBar={false}
                                        statusBar={false}
                                    />
                                </div>
                                <div
                                    className={
                                        mapperFormErrors.format.length > 0
                                            ? style.editorError
                                            : style.editor
                                    }
                                >
                                    <div className={style.label}>To</div>
                                    <Editor
                                        onChange={(content) =>
                                            onMapperFormatChange(content)
                                        }
                                        value={mappersForm.format ?? {}}
                                        navigationBar={false}
                                        mainMenuBar={false}
                                        statusBar={false}
                                        mode={'code'}
                                        theme={'ace/theme/dracula'}
                                        indentation={4}
                                        onValidationError={(error) => {
                                            if (error.length < 1) {
                                                setMapperFormErrors({
                                                    ...mapperFormErrors,
                                                    format: '',
                                                });
                                            } else {
                                                setMapperFormErrors({
                                                    ...mapperFormErrors,
                                                    format:
                                                        'Invalid JSON provided',
                                                });
                                            }
                                        }}
                                        ace={aceEditor}
                                    />
                                    <div className={style.errorMessage}>
                                        {mapperFormErrors.format}
                                    </div>
                                </div>
                                <div className={style.editor}>
                                    <div className={style.label}>Result</div>
                                    <Editor
                                        key={JSON.stringify(transformedFormat)}
                                        value={transformedFormat}
                                        ace={readOnlyAceFactory}
                                        mode={'code'}
                                        theme={'ace/theme/dracula'}
                                        mainMenuBar={false}
                                        indentation={4}
                                        statusBar={false}
                                    />
                                </div>
                            </div>
                            <div className={style.button}>
                                <Button handleClick={(e) => submitForm(e)}>
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </Card>
        </Container>
    );
};

export default MappersEdit;
