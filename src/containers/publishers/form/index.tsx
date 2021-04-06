import React, { useState } from 'react';


import Card from '../../../components/card';
import Container from '../../../components/container';
import Divider from '../../../components/divider';
import Button from '../../../components/button';
import style from './style.module.scss';
import { useRecoilState } from 'recoil';
import { publishers } from "../../../store/publishers";


const PublishersNew: React.FC = () => {    
    // const [publishersList, setPublishersList] = useRecoilState(publishers);

    const [name, setName] = useState("");

    const onChangeName = (e) => {
        setName(e.target.value);
      };

    const submitForm = (e) => {
        e.preventDefault();
    }

    return (
        <Container>
          <Card>
            <h1>Add Publisher</h1>
            <h2>Add a new publisher</h2>
            <Divider/>
            <form className={style.form}>
                <div className={style.field}>
                    <label>Name</label>
                    <input type="text" name="name" className={style.input} autoComplete="false" value={name} onChange={(e) => onChangeName(e)}></input>
                </div>
                <div className={style.button}>
                    <Button handleClick={(e) => submitForm(e)}>Submit</Button>
                </div>
            </form>

          </Card>
      </Container>
    );
}

export default PublishersNew;