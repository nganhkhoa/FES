import { createStore } from 'redux';
import reducers from './reducers';

const remote = window.require('electron').remote;
const zerorpc = remote.require('zerorpc');

const client = new zerorpc.Client();
client.connect('tcp://127.0.0.1:4242');

const initialState = {
  rpc: { folderList: [], zerorpc: client },
  route: { current: 'Home' }
};

const store = createStore(reducers, initialState);

// const unsubscribe = store.subscribe(() => console.log(store.getState()));

export default store;
