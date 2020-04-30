await loadJs('https://unpkg.com/three@0.115.0')

appendCss(`
header { background-color: silver }
header canvas { display: block }
main { padding: 20px }
main h2 a { font-size: 60%; }
`)

let themes = [
  'birds', 'cells', 'clouds', 'clouds2', 'dots', 'fog', 'globe',
  'halo', 'net', 'rings', 'ripple', 'topology', 'trunk', 'waves',
]

// https://github.com/tengbao/vanta
// https://vantajs.com
let App = () => {
  let [theme, setTheme] = useState('birds')
  return (
    <div>
      <VantaHeader theme={theme} />
      <main>
        <h2>Vanta.js - <a target="_blank" href="https://github.com/tengbao/vanta">https://github.com/tengbao/vanta</a></h2>
        <ul>{themes.map(t => {
          return <li key={t}>{t === theme ? t : <a onClick={() => {
            setTheme(t)
          }}>{t}</a>}</li>
        })}</ul>
      </main>
    </div>
  )
}

let VantaHeader = ({ theme }) => {
  let headerRef = useRef(null)

  useEffect(() => {
    let el = headerRef.current
    let destroy = loadVantaEffect(el, theme)
    return destroy
  }, [theme])

  return <header ref={headerRef}></header>
}

let loadVantaEffect = (el, theme) => {
  let promise = (async () => {
    setRendering(true)
    if (['halo', 'topology'].includes(theme)) {
      await loadJs('https://unpkg.com/vanta@0.5.15/vendor/p5.min.js')
    }
    let method = theme.toUpperCase()
    if (!(window.VANTA && VANTA[method])) {
      await loadJs(`https://unpkg.com/vanta@0.5.15/dist/vanta.${theme}.min.js`)
    }
    let ret = VANTA[method]({ el })
    let canvasHeight = el.querySelector('canvas').clientHeight
    el.style.height = `${canvasHeight}px`
    setRendering(false)
    return ret
  })()
  return () => {
    promise.then(ret => { ret.destroy() })
  }
}
