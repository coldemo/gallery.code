// await loadJs('https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js')
await loadJs('https://unpkg.com/vue@2.6.11/dist/vue.min.js')

// await loadJs('https://unpkg.com/vue-at')
await loadJsForceUmd({
  url: 'https://unpkg.com/vue-at@2.5.0-beta.2/dist/vue-at.js',
  name: 'VueAt',
  deps: { vue: Vue },
})

appendCss(`
.container { padding: 20px }
.editor { margin-top:20px; padding:4px 8px; height:120px; border:solid 1px gray; white-space:pre-wrap }
`)

let App = {
  components: { At: VueAt },
  template: `
    <div class="container">
      <h1>Vue At</h1>
      <at :members="members" v-model="input">
        <div class="editor" contenteditable></div>
      </at>
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
