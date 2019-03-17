import { put, takeLatest, all } from "redux-saga/effects";

import actionWatcher from "@/sagas/rpc";

export default function* rootSaga() {
  yield all([actionWatcher()]);
}
