import { createReducer, actionFactory } from './../../src';

export type Store1 = Record<string, number>;

const initialState: Store1 = {
  p1: 0,
  p2: 0,
  p3: 0,
};

export const reducer = createReducer(initialState);

const createAction = actionFactory('store1');

export const incP1 = createAction('incP1', (a: string, b: number, c: boolean) => Promise.resolve(1), (a, b) => 2);
export const incP2 = createAction<string>('incP2');
export const incP3 = createAction('incP3');
export const initState = createAction('initState');

reducer
  .on(incP1, (s, p, m) => ({
    ...s,
    p1: s.p1 + 1,
  }))
  .on(incP2, (s, p) => ({
    ...s,
    p2: s.p2 + 1,
  }))
  .on(incP3, s => ({
    ...s,
    p3: s.p3 + 1,
  }))
  .on(initState, () => ({
    ...initialState,
  }))
;
