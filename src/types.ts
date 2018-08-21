import { Action as ReduxAction, Reducer as ReduxReducer } from 'redux';

/**
 * Unpacks some types:
 * - promise resolve type
 */
export type Unpacked<T> =
  T extends Promise<infer U> ? U :
  T;

/**
 * When you want to unpack action payload type.
 * For example in a middleware, where action may be any type and you want to cast to action type with unpacked payload field.
 * @example UnpackActionPayload<typeof someAction>
 */
export type ActionPayloadType<Action extends (...args: any[]) => FSA<any, any>> = Required<ReturnType<Action>>['payload'];

/**
 * In addition to resolving payload type it unpacks payload type via `Unpacked` utility type
 */
export type UnpackedActionPayloadType<Action extends (...args: any[]) => FSA<any, any>> = Unpacked<ActionPayloadType<Action>>;

/**
 * FSA-compatible action type
 */
export interface FSA<P = any, M = any> extends ReduxAction<string> {
  payload?: P;
  error?: boolean;
  meta?: M;
}

export type ReduceFunction<S, P = any, M = any> = (state: S, payload: Unpacked<P>, meta: M) => S;

export type Reducer<S, A extends FSA<any>> = {
  on<Payload, PayloadArgs extends any[], Meta>(
    actionCreator: (...args: PayloadArgs) => FSA<Payload, Meta>,
    reduceFunction: ReduceFunction<S, Payload, Meta>,
  ): Reducer<S, A>;
} & ReduxReducer<S, A>;
