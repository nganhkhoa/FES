import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import BasicLayout from '@/layouts/basic';
import App from '@/App';

class Routes extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/"
            render={props => (
              <BasicLayout
                {...props}
                children={
                  <div>
                    <Route path="/" component={App} />
                    <Route path="/encrypt" component={() => <p>Encrypt</p>} />
                    <Route path="/decrypt" component={() => <p>Decrypt</p>} />
                  </div>
                }
              />
            )}
          />
          <Route path="*" component={<p>404</p>} status={404} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Routes;
