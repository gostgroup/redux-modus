import { Reducer, ReduceFunction, FSA } from './types';
import { reduceBatchedActions, BatchedPayload } from './batchActions';

export default function createReducer<S>(
  initialState: S,
  initialReducersMap: Record<string, ReduceFunction<S>> = {},
): Reducer<S> {
  const rootReducer: Reducer<S> = Object.assign(reduce, {
    on,
  });

  const reducersMap = new Map<string, ReduceFunction<S>>(Object.entries(initialReducersMap));

  function reduce(state: S = initialState, action: FSA<any>) {
    const reducer = reducersMap.get(action.type);

    if (reducer !== undefined) {
      return reducer(state, action.payload, action.meta);
    }

    if (action.meta && action.meta.batched) {
      const { actions } = action.payload as BatchedPayload;
      return reduceBatchedActions(reducersMap, state, actions);
    }

    return state;
  }

  function on(actionCreator: any, reduceFunction: any) {
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
