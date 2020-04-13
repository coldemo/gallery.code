await loadJs('https://unpkg.com/react-editor')

let { Editor } = ReactEditor

let MyCard = styled.div`
  margin-top: 20px;
`

let MyEditor = styled(Editor)`
  border: solid 1px gray; padding: 4px 10px; overflow: auto;
`

let App = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>react-editor</h1>

      <MyCard>
        <div style={{ height: 100 }}>
          <MyEditor placeholder="Type something..."  />
        </div>
      </MyCard>

      <MyCard>
        <div style={{ height: 100 }}>
          <MyEditor placeholder="Type something..."  />
        </div>
      </MyCard>
    </div>
  )
}
