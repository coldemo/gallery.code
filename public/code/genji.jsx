await loadJs([
  'https://unpkg.com/react-redux@7.2.0/dist/react-redux.js',
  'https://unpkg.com/genjijs-umd@0.3.0/dist/index.min.js',
])

let { Provider, useSelector, useDispatch } = ReactRedux

let numberUnit = {
  namespace: 'number',
  state: { num: 0, desc: { num: 0 } },
  actionCreators: {
    add({ type, payload }, { getState, pick, save }) {
      let num = pick('num');
      save({ num: num + payload });
    },
    async saveAsync(action, { getState, pick, save }) {
      return fetch('/mock')
        .then(response => response.json())
        .then(data => {
          save({ num: data.saveNum });
          save({ desc: { num: data.saveNum } });
        })
        .catch(e => {
          console.error('fetch error:', e);
        });
    }
  }
};
let userUnit = {
  namespace: 'user',
  state: { name: 'zhangsan', num: 0 },
  actionCreators: {
    async saveOther(action, { getState, pick, save }) {
      return fetch('/mock')
        .then(response => response.json())
        .then(data => {
          save({ num: data.saveNum + pick('num', 'number') }, 'number');
        })
        .catch(e => {
          console.error('fetch error:', e);
        });
    }
  }
};

let genji = new Genji({ injectAsyncLoading: true, autoUpdateAsyncLoading: true });
let unitTypes = {
  numberUnit: genji.model(numberUnit),
  userUnit: genji.model(userUnit),
}
genji.start();
let store = genji.getStore()

let GenjiApp = () => {
  let dispatch = useDispatch()
  let props = {
    ...useSelector(state => state),
    add: () => {
      dispatch({
        type: unitTypes['numberUnit'].add,
        payload: 1
      });
    },
    saveAsync: () => {
      dispatch({
        type: unitTypes['numberUnit'].saveAsync
      });
    },
    saveOther: () => {
      dispatch({
        type: unitTypes['userUnit'].saveOther
      });
    }
  }

  useEffect(() => {
    props.saveAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {props.number.saveAsyncLoading ? (
        <div>Loading...</div>
      ) : (
        <div onClick={props.saveAsync}>init num from mock (click me)</div>
      )}
      <div onClick={props.add}>action test (click me)</div>
      {props.user.saveOtherLoading ? (
        <div>Loading...</div>
      ) : (
        <div onClick={props.saveOther}>save num from other model (click me)</div>
      )}
      <div>current number is: {props.number.num}</div>
    </div>
  )
}

let App = () => {
  return (
    <div style={{ padding: 20 }}>
      <div>
        <h1>Genji</h1>
        <a target="_blank" href="https://github.com/kelekexiao123/genjijs">
          https://github.com/kelekexiao123/genjijs
        </a>
      </div>
      <br />
      <Provider store={store}>
        <GenjiApp />
      </Provider>
    </div>
  )
}

let sleep = (ms) => new Promise(r => setTimeout(r, ms))
let fetch = async () => {
  await sleep(1000)
  return { json: () => ({ "message": "ojbk", "saveNum": 100 }) }
}
