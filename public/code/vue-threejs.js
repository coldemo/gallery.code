await loadJs([
  'https://unpkg.com/vue@2.6.11/dist/vue.min.js',
  // 'https://unpkg.com/three@0.81.2/build/three.min.js',
  'https://unpkg.com/three@0.115.0/build/three.min.js',
])

// await loadJs('https://unpkg.com/vue-threejs@0.2.0-alpha.1/lib/VueThreejs.umd.min.js')
await loadJs('https://unpkg.com/vue-threejs@0.2.0-alpha.1/lib/VueThreejs.umd.js')

appendCss(`
#mountNode { overflow:hidden; background-color:black }
`)

Vue.use(VueThreejs)

// Creating a scene - Three.js Documentation
// https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene
let App = {
  template: `
    <div class="container">
      <renderer :size="bg.size">
        <scene>
          <camera :position="{ z: 5 }"></camera>
          <mesh name="Cube" :rotation="ui.rotation">
            <geometry type="Box" :args="[1, 1, 1]"></geometry>
            <material type="MeshBasic" :color="0x00ff00"></material>
          </mesh>
          <animation :fn="animate"></animation>
        </scene>
      </renderer>
    </div>
  `,
  data() {
    return {
      bg: {
        sysKey: 0,
        // size: { w: window.innerWidth, h: window.innerHeight },
        size: { w: mountNode.clientWidth, h: mountNode.clientHeight },
      },
      ui: {
        rotation: { x: 0, y: 0, z: 0 },
      }
    }
  },
  mounted() {
    mountNode.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    mountNode.removeEventListener('resize', this.handleResize)
  },
  methods: {
    animate() {
      this.ui.rotation.x += 0.01
      this.ui.rotation.y += 0.01
    },
    handleResize: _.debounce(triggerPreview, 2000)
  }
}
