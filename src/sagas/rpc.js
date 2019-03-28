import {
  put,
  delay,
  takeLatest,
  take,
  call,
  cps,
  fork,
  select
} from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';
import { message } from 'antd';

function _invokeOne(zerorpc, task, algo, file, key) {
  return eventChannel(function(emitter) {
    // zerorpc.invoke(task, algo, file, key, (err, res, more) => {
    zerorpc.invoke(task, algo, file, key, (err, res, more) => {
      if (err) {
        emitter(new Error(err));
        return;
      }
      if (!more) {
        emitter(END);
        // !more on stream wont give res
        return;
      }
      emitter(res);
    });

    return () => {};
  });
}

function* invokeOne(zerorpc, task, algo, file, key) {
  const chan = yield call(_invokeOne, zerorpc, task, algo, file, key);
  let errorOccurred = false;
  let res;

  yield put({ type: 'rpc/addRunning' });
  try {
    while (true) {
      res = yield take(chan);
      console.log(res);
      // future: Loading percentage
    }
  } catch (err) {
    console.log(err);
    message.error('Error occured when calling RPC');
    errorOccurred = true;
  } finally {
    yield put({ type: 'rpc/removeRunning' });
    if (!errorOccurred) {
      const msg = res.split(':');
      message.success(msg[0] + ' ' + msg[1]);
    }
  }
}

function* invoke({ payload }) {
  const { rpc } = yield select();
  const { zerorpc } = rpc;
  const { algo, fileList, key, task } = payload;

  let processed = 0;
  const effects = fileList.map(file => {
    return fork(invokeOne, zerorpc, task, algo, file, key);
  });

  // call on queue, so that it wont make rpc call unable to handle heartbeat
  while (processed !== fileList.length) {
    const {
      rpc: { running }
    } = yield select();
    if (running < 5) {
      // 5 is our pool_size
      yield effects[processed];
      processed += 1;
    }
    // wait store update running
    yield delay(1000);
  }
}

function* createKey({ payload }) {
  const { rpc } = yield select();
  const { zerorpc } = rpc;
  const { algo, key: passphrase } = payload;
  let key = [];

  console.log('RPC call create key');
  try {
    key = yield cps(zerorpc.invoke, 'generate_key', algo, passphrase);
    console.log(key);
    message.success('Create new key success');
  } catch (err) {
    console.log(err);
    message.error('Error create new key');
  }
  yield put({
    type: 'rpc/newKey',
    payload: {
      key: key,
      success: key.length > 0
    }
  });
}

function* actionWatcher() {
  yield takeLatest('rpc/invoke', invoke);
  yield takeLatest('rpc/createKey', createKey);
}

export default actionWatcher;
