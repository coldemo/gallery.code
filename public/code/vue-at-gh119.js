// await loadJs('https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js')
await loadJs('https://unpkg.com/vue@2.6.11/dist/vue.min.js')

// await loadJs('https://unpkg.com/vue-at')
await loadJsForceUmd({
  url: 'https://unpkg.com/vue-at@2.5.0-beta.2/dist/vue-at.js',
  name: 'VueAt',
})

appendCss(`
.container { padding: 20px }
.editor { margin-top:20px; padding:4px 8px; height:120px; border:solid 1px gray; white-space:pre-wrap }
.atwho-remove { cursor: pointer }
`)

window.atwhoRemoveItem = target => {
  let tag = target.parentNode.parentNode
  tag.parentNode.removeChild(tag)
}

let App = {
  components: { At: VueAt },
  template: `
    <div class="container">
      <h1>Demo for vue-at#119</h1>
      <div v-for="link in links">
        <a target="_blank" :href="link">{{link}}</a>
      </div>
      <at :members="members" v-model="input">
        <template v-slot:embeddedItem="s">
          <span><span class="tag">[ @{{ s.current }} <span class="atwho-remove" onclick="atwhoRemoveItem(this)">×</span> ]</span></span>
        </template>
        <div class="editor" contenteditable></div>
      </at>
    </div>
  `,
  data() {
    return {
      links: [
        'https://github.com/fritx/vue-at',
        'https://github.com/fritx/vue-at/issues/119',
      ],
      members: [
        'fritx', 'linguokang', 'huangruichang'
      ],
      input: '<span data-at-embedded="" contenteditable="false"> <span class="tag">[ @fritx <span onclick="atwhoRemoveItem(this)" class="atwho-remove">×</span> ]</span> </span> <span data-at-embedded="" contenteditable="false"> <span class="tag">[ @huangruichang <span onclick="atwhoRemoveItem(this)" class="atwho-remove">×</span> ]</span> </span> '
    }
  }
}
