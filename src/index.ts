import { ActionFactory, FSA, CreateAction, Reducer } from './types';

import createAction from './createAction';
import createReducer from './createReducer';
import batchActions from './batchActions';

export {
  createAction,
  createReducer,
  batchActions,

  FSA,
  CreateAction,
  ActionFactory,
  Reducer,
};

export const actionFactory = (
  (namespace: string, separator: string = '/') => (
    actionName: any,
    payloadReducer?: any,
    metaReducer?: any,
  ) => createAction(`${namespace}${separator}${actionName}`, payloadReducer, metaReducer)
) as any as ActionFactory;

/**
 * Если мы хотим дополнить имя типа экшена, то можно воспользоваться этой функцией,
 * например так:
 * ```
 *  withNameDecorator(action, action => `${action}_IS_LOADING`)
 * ```
 */
export const withNameDecorator = <A>(
  action: A,
  nameDecorator = (action: string): string => action,
) => nameDecorator(String(action)) as any as A;

/**
 * Примеры.
 * Специализировать типы через <> не обязательно
 * если вы указываете в колбэках типы аргументов и возвращаемое значение выводимо.
 */
// const createAction = actionFactory('session');

// export const optArgAction = createAction<{id: string}>('optArgAction');

// export const noArgAction = createAction<number>('noArgAction', () => 1);
// export const noArgMetaAction = createAction<number, number>('noArgMetaAction', () => 1, () => 1);

// export const arg1Action = createAction<number, number>('arg1Action', a => 1);
// export const arg1MetaAction = createAction<string, number, number>(
//   'arg1MetaAction',
//   a => 1,
//   () => 1,
// );

// export const arg2Action = createAction<number, number, number>('arg2Action', (a, b) => 1);
// export const arg2MetaAction = createAction<string, number, number, number>(
//   'arg2MetaAction1',
//   (a, b) => 1,
//   () => 1,
// );

// export const actd = () => (dispatch) => {
//   dispatch(optArgAction({ id: 'asdasdasd' }));
// };

// const initialState: {} = { user: {}, permissions: [] };

// const reducer = createReducer(initialState, {
//   [String(arg2MetaAction)]: (state, p) => ({
//     ...state,
//   }),
// });

// reducer
//   .on(optArgAction, (state, p) => ({
//     ...state,
//     user: p,
//   }))
//   .on(noArgAction, (state, p) => ({
//     ...state,
//   }))
//   .on(noArgMetaAction, (state, p, m) => ({
//     ...state,
//   }))
//   .on(arg1Action, (state, p) => ({
//     ...state,
//   }))
//   .on(arg1MetaAction, (state, p, m) => ({
//     ...state,
//   }))
//   .on(arg2Action, (state, p) => ({
//     ...state,
//   }))
//   .on(arg2MetaAction, (state, p, m) => ({
//     ...state,
//   }))
// ;
