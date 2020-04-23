let App = () => {
  let numArr: number[] = []
  let strArr: string[] = []

  let h = React.createElement
  return h('div', {
    style: { padding: 20 }
  }, [
    h('h1', { key: 1 }, 'Hello world'),
    h('div', {
      key: 2,
      style: { marginTop: 20 }
    }, 'Here is some content...')
  ])
}
