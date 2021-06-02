import React, { useState } from 'react';
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
import { useHistory } from 'react-router';
import { useRecoilState } from 'recoil';
import { createMapperForm, mappers } from '../../../store/mappers/atom';
import { createMapperQuery } from '../../../store/mappers/requests';
import { MapperForm } from '../../../store/mappers/types';
import jsonpathObjectTransform from '../../../lib/jsonpath-object-transform';
import 'brace/theme/dracula';
import 'jsoneditor-react/es/editor.min.css';
import { ControlledJsonEditor } from '../../../components/editor';

export const MappersCreate: React.FC = () => {
    const history = useHistory();

    const changeRoute = (route: string) => {
        history.push(route);
    };

    const [transformedFormat, setTransformedFormat] = useState({});

    const [mappersForm, setMappersForm] = useRecoilState<MapperForm>(
        createMapperForm,
    );

    const [mapperFormErrors, setMapperFormErrors] = useState({
        name: '',
        format: '',
        sample: '',
    });

    const [mappersState, setMappers] = useRecoilState(mappers);

    const submitForm = async (e) => {
        e.preventDefault();
        const errors = validate(mappersForm);
        if (!errors) {
            setMapperFormErrors({
                name: '',
                format: '',
                sample: '',
            });
            const newMapper = await createMapperQuery(mappersForm);
            setMappers({
                ...mappersState,
                [newMapper.id]: newMapper,
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
                editor.setStyle(style.ace);
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
                editor.setStyle(style.ace);
                editor.setHighlightActiveLine(false);
                editor.setOption('highlightGutterLine', false);
            });
            return editor;
        },
    };

    return (
        <Container>
            <Card>
                <div>
                    <h1>New Mapper</h1>
                    <h2>Configure your mapper</h2>
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
                                value={mappersForm.name}
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
                                <ControlledJsonEditor
                                    value={mappersForm.sample}
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
                                    value={mappersForm.format}
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
                                                format: 'Invalid JSON provided',
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
            </Card>
        </Container>
    );
};

export default MappersCreate;
