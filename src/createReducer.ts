import { Reducer as ReduxReducer } from 'redux';

import { ReduceFunction, FSA, Reducer } from './types';
import { reduceBatchedActions } from './batchActions';

/**
 * Create type safe reducers handler
 */
export default function createReducer<S, A extends FSA>(
  initialState: S,
  initialReducersMap: Record<string, ReduceFunction<S>> = {},
): Reducer<S, A> {
  const rootReducer = Object.assign(reduce as ReduxReducer, {
    on,
  });

  const reducersMap = new Map<string, ReduceFunction<S>>(Object.entries(initialReducersMap));

  function reduce(state: S = initialState, action: FSA) {
    const reducer = reducersMap.get(action.type);

    if (reducer !== undefined) {
      return reducer(state, action.payload, action.meta);
    }

    if (action.meta && action.meta.batched) {
      const { actions } = action.payload;
      return reduceBatchedActions(reducersMap, state, actions);
    }

    return state;
  }

  function on<Payload, PayloadArgs extends any[], Meta>(
    actionCreator: (...args: PayloadArgs) => FSA<Payload, Meta>,
    reduceFunction: ReduceFunction<S, Payload, Meta>,
  ) {
    const actionName = String(actionCreator);

    if (reducersMap.has(actionName)) {
      console.error(`[redaction] action name '${actionName}' conflict: Action creator name must be unique.`);
      return rootReducer;
    }

    reducersMap.set(actionName, reduceFunction);

    return rootReducer;
  }

  return rootReducer;
}
