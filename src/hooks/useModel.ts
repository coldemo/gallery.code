import _ from 'lodash';
import { Reducer, useMemo, useReducer } from 'react';

interface ActionArgMap<A> {
  [type: string]: (...args: any[]) => Omit<A, 'type'> | null;
}
interface ActionMap<A> {
  [type: string]: (...args: any[]) => A;
}

export let useModel = <S, A extends { type: string }>(
  reducer: Reducer<S, A>,
  initialState: S,
  _actions: ActionArgMap<A>
) => {
  let [state, dispatch] = useReducer<Reducer<S, A>>(reducer, initialState);

  let actions = useMemo<ActionMap<A>>(() => {
    return _.reduce(
      _actions,
      (acc, func, k) => {
        acc[k] = (...args: any[]) => {
          let patch = func(...args);
          let action = { type: k, ...patch } as A;
          return dispatch(action);
        };
        return acc;
      },
      Object.create(null)
    );
  }, [_actions, dispatch]);

  return [state, actions];
};
