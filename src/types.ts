import { Action as ReduxAction } from 'redux';

/**
 * Unpackes some types:
 * - promise resolve type
 */
export type Unpacked<T> =
  T extends Promise<infer U> ? U :
  T;

/**
 * When you want to unpack action payload type.
 * For example in a middleware, where action may be any type and you want to cast to action type with unpacked payload field.
 * @example UnpackActionPayloadType<typeof someAction>
 */
export type UnpackActionPayloadType<ModusActionType extends (...args: any[]) => any> = {
  [T in keyof ReturnType<ModusActionType>]: T extends 'payload'
    ? Unpacked<ReturnType<ModusActionType>[T]>
    : ReturnType<ModusActionType>[T];
};

/**
 * FSA-compatible action type
 */
export interface FSA<P = any, M = any> extends ReduxAction<string> {
  payload?: P;
  error?: boolean;
  meta?: M;
}

export type ReduceFunction<S, P = any, M = any> = (state: S, payload: Unpacked<P>, meta: M) => S;
