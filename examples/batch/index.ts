import { createStore, applyMiddleware, combineReducers } from 'redux';
import reduxLogger from 'redux-logger';

import { batchActions } from './../../src';
import * as store1 from './store1';
import * as store2 from './store2';

type RootStore = {
  store1: store1.Store1,
  store2: store2.Store2,
};

const reducer = combineReducers<RootStore>({
  store1: store1.reducer,
  store2: store2.reducer,
});

const store = createStore(reducer, applyMiddleware(reduxLogger));

store.subscribe(() => {
  console.warn('Whole store has been changed');
});

console.log('single call actions');
store.dispatch(store1.incP1());
store.dispatch(store1.incP2());
store.dispatch(store1.incP3());
store.dispatch(store2.incP2());
store.dispatch(store2.incP3());

store.dispatch(store1.initState());
store.dispatch(store2.initState());

console.log('batched actions');
store.dispatch(batchActions([
  store1.incP1(),
  store1.incP2(),
  store1.incP3(),
  store2.incP2(),
  store2.incP3(),
]));
