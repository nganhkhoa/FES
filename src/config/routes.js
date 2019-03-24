import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

import BasicLayout from '@/layouts/basic';

import Home from '@/components/Home';
import FileIndex from '@/components/FileIndex';
import KeyManager from '@/components/KeyManager';
import Settings from '@/components/Settings';
import MainForm from '@/components/MainForm';
import DirectForm from '@/components/DirectForm';
import KeyForm from '@/components/KeyForm';

class Routes extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route
            path="/"
            render={props => (
              <BasicLayout
                {...props}
                children={
                  <div>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/form" component={MainForm} />
                    <Route exact path="/directform" component={DirectForm} />
                    <Route exact path="/keyform" component={KeyForm} />
                    <Route path="/index" component={FileIndex} />
                    <Route path="/keys" component={KeyManager} />
                    <Route path="/settings" component={Settings} />
                  </div>
                }
              />
            )}
          />
          <Route
            path="*"
            render={() => (
              <p>
                <Link to="/">404</Link>
              </p>
            )}
            status={404}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Routes;
