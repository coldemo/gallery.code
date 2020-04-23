// await loadJs('https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js')
await loadJs('https://unpkg.com/vue@2.6.11/dist/vue.min.js')

appendCss(`
.container { padding: 20px }
`)

let App = {
  render (h) {
    /** @jsx h */
    let { add, count, message } = this
    return (
      <div class="container">
        <h1>Vue Render-JSX</h1>
        <h3>Hello. {message} {count}</h3>
        <button on-click={add}>Add</button>
      </div>
    )
  },
  data() {
    return { count: 0, message: 'This is Vue App.' }
  },
  mounted() {
    this.timerId = setInterval(this.add, 1000)
  },
  beforeDestroy() {
    let { timerId } = this
    if (timerId) clearInterval(timerId)
  },
  methods: {
    add() { this.count++ }
  }
}
