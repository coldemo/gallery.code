await loadJs('https://unpkg.com/react-editor')
await loadJs('https://unpkg.com/react-drag-sizing')

let { Editor } = ReactEditor
let { DragSizing } = ReactDragSizing

let MyCard = styled.div`
  margin-top: 20px;
`
let MyEditor = styled(Editor)`
  border: solid 1px gray; padding: 4px 10px; overflow: auto;
`

let App = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>react-editor-sizing</h1>
      <a target="_blank" href="https://github.com/fritx/react-drag-sizing">
        https://github.com/fritx/react-drag-sizing
      </a>

      <MyCard>
        <DragSizing border="bottom" style={{ minHeight: 32, height: 100 }}>
          <MyEditor placeholder="Try to drag on the bottom border ✋⤵️"  />
        </DragSizing>
      </MyCard>

      <MyCard>
        <div style={{ height: 100 }}>
          <MyEditor placeholder="Type something..."  />
        </div>
      </MyCard>
    </div>
  )
}
