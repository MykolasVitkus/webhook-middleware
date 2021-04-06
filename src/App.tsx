import React from 'react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Publishers from './containers/publishers/list';
import Routes from './utils/routes';
import styles from './App.module.scss';
import PublishersNew from './containers/publishers/form';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function App() {
    return (
        <RecoilRoot>
            <Router>
                <div className={styles.App}>
                    <Navbar />

                    <Switch>
                        <Route exact path={Routes.Publishers}>
                            <Publishers />
                        </Route>
                        <Route exact path={Routes.PublishersNew}>
                            <PublishersNew />
                        </Route>
                    </Switch>
                </div>
            </Router>
        </RecoilRoot>
    );
}

export default App;
