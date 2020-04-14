// await loadJs('https://unpkg.com/vue') // sometimes broken
await loadJs('https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js')

let initVue = () => {
  new Vue({
    el: '#vueApp',
    template: `
      <div>
        <h1>Vue String Template</h1>
        <h3>Hello. {{message}} {{count}}</h3>
        <button @click="add()">Add</button>
      </div>
    `,
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
  })
}

let App = () => {
  useEffect(() => {
    initVue()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <div id="vueApp" />
    </div>
  )
}
