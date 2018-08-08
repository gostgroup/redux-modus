/**
 * Action batching module
 */

import { FSA, ReduceFunction } from './types';

export type BatchedMeta = {
  batched: true;
};
export type BatchedPayload = {
  actions: FSA[];
};

const batchActions = (actions: FSA[]): FSA<BatchedPayload, BatchedMeta> => ({
  meta: {
    batched: true,
  },
  payload: {
    actions,
  },
  type: `batched-actions: see payload 'actions' field for more info`,
});

/**
 * NOTE Promise payload type will be ignored and will be merged to store without resolving
 */
export const reduceBatchedActions = <S extends Record<string, any>>(
  reducersMap: Map<string, ReduceFunction<S>>,
  state: S,
  actions: FSA[],
): S => {
  let newState: S = state;

  actions.forEach((act) => {
    const reducer = reducersMap.get(act.type);

    if (reducer) {
      newState = Object.assign({}, newState, reducer(newState, act.payload, act.meta));
    }
  });

  return newState;
};

export default batchActions;
