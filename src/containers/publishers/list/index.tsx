import React, { useEffect } from 'react';
import Card from '../../../components/card';
import Container from '../../../components/container';
import style from './style.module.scss';
import { publishers } from "../../../store/publishers";
import { useRecoilState } from 'recoil';
import Divider from '../../../components/divider';
import Button from '../../../components/button';
import { FaEdit } from 'react-icons/fa';
import { getPublishersQuery } from '../../../store/publishers/requests';
import { loaded } from '../../../store/publishers/atom';

const Publishers: React.FC = () => {
    
    const [publishersList, setPublishers] = useRecoilState(publishers);
    const [isLoaded, setIsLoaded] = useRecoilState(loaded);

    useEffect(() => {
      const getPublishers = async () => {
        // setTimeout(() => {
        //   setIsLoaded(true);
        // }, 3000);
          const publishers = await getPublishersQuery();
          setPublishers(publishers);
          setIsLoaded(true);
      };
      getPublishers();
    }, [setPublishers, setIsLoaded]);


    return (
      <Container>
          <Card>
            <h1>Publishers</h1>
            <h2>Configure your publishers</h2>
            <Divider/>
            { !isLoaded &&
              <div>
                Loading
              </div> 
            }
            {
              isLoaded && 
              <table className={style.table}>
              <thead>
                <tr>
                  <th className={style.thLeftAligned}>Name</th>
                  <th className={style.thLeftAligned}>Webhook Link</th>
                  <th className={style.thLeftAligned}>Created At</th>
                  <th className={style.thRightAligned}>Actions</th>
                </tr>
              </thead>
              <tbody>
                  {(publishersList.map((val) => {
                    return (
                      <tr key={val.id}>
                        <td>{val.name}</td>
                        <td>localhost:3001/</td>
                        <td>{val.createdAt.toDateString()}</td>
                        <td className={style.thRightAligned}>
                          <Button handleClick={() => {console.log(val.id)}}>
                            <FaEdit className={style.iconMargin}></FaEdit>
                            Edit
                          </Button>
                          </td>
                      </tr>
                    );
                  }))}
            
              </tbody>
            </table>
            }
            
          </Card>
      </Container>
    );
  };
  
  export default Publishers;
  