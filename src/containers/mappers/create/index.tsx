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
import { mappers } from '../../../store/mappers/atom';
import { createMapperQuery } from '../../../store/mappers/requests';
import { MapperForm } from '../../../store/mappers/types';
import jsonpathObjectTransform from '../../../lib/jsonpath-object-transform';

export const MappersCreate: React.FC = () => {
    const history = useHistory();

    const changeRoute = (route: string) => {
        history.push(route);
    };

    const json = {
        name: 'test webhook',
        type: 1,
        chansnel_id: '199737254929760256',
        token:
            '3d89bb7572e0fb30d8128367b3b1b44fecd1726de135cbe28a41f8b2f777c372ba2939e72279b94526ff5d1bd4358d65cf11',
        message: 'Hello Guys',
    };

    const [transformedFormat, setTransformedFormat] = useState({});

    const [mappersForm, setMappersForm] = useState<MapperForm>({
        name: '',
        format: {},
    });

    const [mapperFormErrors, setMapperFormErrors] = useState<MapperForm>({
        name: '',
        format: '',
    });

    const [mappersState, setMappers] = useRecoilState(mappers);

    const submitForm = async (e) => {
        e.preventDefault();
        const errors = validate(mappersForm);
        if (!errors) {
            setMapperFormErrors({
                name: '',
                format: '',
            });
            const newMapper = await createMapperQuery(mappersForm);
            setMappers({
                ...mappersState,
                [newMapper.id]: newMapper,
            });
            changeRoute(Routes.Mappers);
        }
    };

    const onMapperFormatChange = (data) => {
        setMappersForm({
            ...mappersForm,
            format: data,
        });
        const newFormat = jsonpathObjectTransform(json, data);
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
                case 'format':
                    if (form[key].length < 1) {
                        errors = true;
                        setMapperFormErrors({
                            ...mapperFormErrors,
                            format: 'This value cannot be empty.',
                        });
                    }
                    break;
                default:
                    break;
            }
        });
        return errors;
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
                                className={style.input}
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
                                {/* {publishersFormErrors.name} */}
                            </div>
                        </div>
                        <div className={style.editors}>
                            <div className={style.editor}>
                                From
                                <Editor
                                    value={json}
                                    mode={'code'}
                                    ace={ace}
                                    indentation={4}
                                    mainMenuBar={false}
                                    statusBar={false}
                                />
                            </div>
                            <div className={style.editor}>
                                To
                                <Editor
                                    onChange={(content) =>
                                        onMapperFormatChange(content)
                                    }
                                    value={mappersForm.format}
                                    navigationBar={false}
                                    mainMenuBar={false}
                                    statusBar={false}
                                    mode={'code'}
                                    indentation={4}
                                    // onError={() => 'Invalid JSON'}
                                    ace={ace}
                                />
                            </div>
                            <div className={style.editor}>
                                Result
                                <Editor
                                    key={JSON.stringify(transformedFormat)}
                                    value={transformedFormat}
                                    mode={'code'}
                                    mainMenuBar={false}
                                    indentation={4}
                                    disabled={true}
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
