await loadJs([
  'https://unpkg.com/immer@6.0.3/dist/immer.umd.production.min.js',
  'https://unpkg.com/react-editor@2.0.0-alpha.5/dist/index.js',
])

let { produce } = immer
let { Button } = Antd
let { Editor } = ReactEditor

let App = () => {
  let [state, actions] = useModel(produce((draft, action) => {
    if (action.type === 'increase') draft.count += 1
  }), { count: 0 }, {
    increase: () => null
  })

  useInterval(() => {
    actions.increase()
  }, 1000)

  return (
    <div style={{ padding: 20 }}>
      <h1>{state.count}</h1>
      <Button type="primary" onClick={actions.increase}>Add</Button>
      <Editor defaultValue={state.count} placeholder="Type something..." style={{ border: 'solid 1px gray', marginTop: 20, padding: '4px 10px', height: 200, overflow: 'auto' }} />
    </div>
  )
}

/**
 * useModel.ts
```ts
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
```
 */
