// await loadJs('https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js')
await loadJs('https://unpkg.com/vue@2.6.11/dist/vue.min.js')

await loadCss('https://unpkg.com/element-ui@2.13.1/lib/theme-chalk/index.css')
await loadJs('https://unpkg.com/element-ui@2.13.1/lib/index.js')

await loadJs('https://unpkg.com/textarea-caret@3.1.0/index.js')
// await loadJs('https://unpkg.com/vue-at')
await loadJsForceUmd({
  url: 'https://unpkg.com/vue-at@2.5.0-beta.2/dist/vue-at-textarea.js',
  name: 'VueAtTextarea',
  deps: { 'textarea-caret': 'getCaretCoordinates' }
})

appendCss(`
.container { padding: 20px }
.editor { margin-top:20px }
`)

// Demo for issue #112 - "Does not work with el-input text"
// https://github.com/fritx/vue-at/issues/112
let App = {
  components: { At: VueAtTextarea },
  template: `
    <div class="container">
      <h1>Vue-at with Element-ui 2.x</h1>
      <div v-for="link in links">
        <a target="_blank" :href="link">{{link}}</a>
      </div>
      <at :members="members" v-model="input1">
        <el-input type="textarea" class="editor" placeholder="This is not working.. v-model on <at>"></el-input>
      </at>
      <at :members="members">
        <el-input type="textarea" class="editor" v-model="input2"></el-input>
      </at>
      <at :members="members">
        <el-input type="textarea" :rows="1" resize="none" class="editor" v-model="input3"></el-input>
      </at>
    </div>
  `,
  data() {
    return {
      links: [
        'https://github.com/fritx/vue-at',
        'https://github.com/fritx/vue-at/issues/96',
        'https://github.com/fritx/vue-at/issues/112',
      ],
      members: [
        'fritx', 'linguokang', 'huangruichang'
      ],
      input1: '@fritx @huangruichang , v-model on <at> ',
      input2: '@fritx @huangruichang , v-model on <el-input> ',
      input3: '@fritx @huangruichang , one-line input-box ',
    }
  }
}
