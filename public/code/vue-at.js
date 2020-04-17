// await loadJs('https://unpkg.com/vue') // sometimes broken
await loadJs('https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js')

// await loadJs('https://unpkg.com/vue-at')
let { data: code } = await axios('https://unpkg.com/vue-at@2.5.0-beta.2/dist/vue-at.js')
code = `
(() => {
let module = { exports: {} }
let require = k => {
  if (k === 'vue') return window.Vue
  throw new Error(\`module '\${k}' not found\`)
}
;;${code};;
window.VueAt = module.exports
})()
`
appendJs(code)

appendCss(`
.container { padding: 20px }
.editor { height:120px; border:solid 1px gray; white-space: pre-wrap }
`)

let App = {
  components: { At: VueAt },
  template: `
    <div class="container">
      <h1>Vue At</h1>
      <div style="margin-top:20px">
        <at :members="members" v-model="input">
          <div class="editor" contenteditable></div>
        </at>
      </div>
    </div>
  `,
  data() {
    return {
      members: [
        'fritx', 'linguokang', 'huangruichang'
      ],
      input: '@fritx @huangruichang '
    }
  }
}
