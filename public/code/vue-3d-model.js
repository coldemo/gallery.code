await loadJs('https://unpkg.com/vue@2.6.11/dist/vue.min.js')
await loadJs('https://unpkg.com/vue-3d-model@1.2.2/dist/vue-3d-model.umd.js')

await loadCss('https://hujiulong.github.io/vue-3d-model/css/app.1b66e6c0.css')

appendCss(`
.demo-block-preview { height: 100% }
.model-box { height: 100% }
`)

// background - vue-3d-model
// https://hujiulong.github.io/vue-3d-model/#/demo-background
let App = {
  template: `
    <div class="demo-block-preview">
      <p class="background-text">
        Vue<br>3D<br>Model<br>Background
      </p>
      <div class="background-buttons">
        <p>Color</p>
        <button @click="bgColor = '#ff0'">#ff0</button>
        <button @click="bgColor = '#f00'">#f00</button>
        <button @click="bgColor = '#13ce66'">#13ce66</button>
        <p>Alpha</p>
        <button @click="bgAlpha = 0.5">0.5</button>
        <button @click="bgAlpha = 1">1</button>
        <button @click="bgAlpha = 0">0</button>
      </div>
      <div class="model-box">
        <model-obj
          :background-alpha="bgAlpha"
          :background-color="bgColor"
          src="https://hujiulong.github.io/vue-3d-model/static/models/obj/tree.obj"></model-obj>
      </div>
    </div>
  `,
  data() {
    return { bgColor: '#ff0', bgAlpha: 0.5 }
  },
  mounted() {
    mountNode.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    mountNode.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize: _.debounce(triggerPreview, 2000)
  }
}
