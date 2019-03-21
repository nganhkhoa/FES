import { combineReducers } from 'redux';
import rpcReducer from '@/reducers/rpc';
import routeReducer from '@/reducers/route';

export default combineReducers({ rpc: rpcReducer, route: routeReducer });
