import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducers from '@/reducers';
import rootSaga from '@/sagas';

const remote = window.require('electron').remote;
const zerorpc = remote.require('zerorpc');

const client = new zerorpc.Client();
client.connect('tcp://127.0.0.1:4242');

const initialState = {
  rpc: { folderList: [], zerorpc: client },
  route: { current: 'Home' }
};

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducers,
  initialState,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

// const unsubscribe = store.subscribe(() => console.log(store.getState()));

export default store;
