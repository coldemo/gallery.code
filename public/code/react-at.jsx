//// hack for current version of react-at
await loadJs('https://unpkg.com/prop-types@15.6.2/prop-types.min.js')
React.PropTypes = PropTypes

// await loadJs('https://unpkg.com/react-at')
await loadJsForceUmd({
  url: 'https://unpkg.com/react-at@0.1.0/dist/index.js',
  name: 'ReactAt',
  deps: { react: 'React' },
})
////

let { default: At } = ReactAt

appendCss(`
.editor { margin-top:20px; padding:4px 8px; height:120px; border:solid 1px gray; white-space:pre-wrap }
`)

let members = ['fritx', 'linguokang', 'huangruichang']

let App = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>react-at</h1>
      <a target="_blank" href="https://github.com/fritx/react-at">
        https://github.com/fritx/react-at
      </a>
      <At members={members}>
        <div style={{ height: 100 }}>
          <div class="editor" contentEditable>@fritx @huangruichang&nbsp;</div>
        </div>
      </At>
    </div>
  )
}
