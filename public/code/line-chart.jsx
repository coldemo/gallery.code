await loadJs('https://unpkg.com/bizcharts@3.5.8/umd/BizCharts.js')
let { G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape, Facet, Util } = BizCharts

let App = () => {
  const data = [
    { year: '01/19', value: 36 },
    { year: '02/17', value: 29 },
    { year: '03/24', value: 35 },
    { year: '04/21', value: 28 },
    { year: '05/22', value: 31 },
    { year: '06/12', value: 21 },
    { year: '07/26', value: 44 },
    { year: '08/30', value: 35 },
    { year: '10/01', value: 32 },
    { year: '10/31', value: 30 },
    { year: '11/30', value: 30 },
    { year: '01/04', value: 35 },
    { year: '02/11', value: 38 },
    { year: '03/21', value: 39 },
  ]
  const cols = {
    value: { min: 0, alias: '天' },
    year: { range: [0.01, 0.9], alias: '时间' },
  }
  return (
    <div>
      <Chart height={300} padding={40} data={data} scale={cols} forceFit>
        <Axis
          name="year"
          title={{
            position: 'end',
            offset: 10,
            textStyle: {
              fontSize: '12',
              textAlign: 'center',
              fill: '#999',
              fontWeight: 'bold',
              rotate: 0,
              autoRotate: true,
            },
          }}
        />
        <Axis
          name="value"
          title={{
            position: 'end',
            textStyle: {
              fontSize: '12',
              textAlign: 'right',
              fill: '#999',
              fontWeight: 'bold',
              rotate: 0,
            },
          }}
        />
        <Tooltip
          crosshairs={{ type: 'y' }}
        />
        <Geom
          type="line"
          position="year*value"
          size={2}
          tooltip={[
            'year*value',
            (year, value) => {
              return {
                name: '数值', // 要显示的名字
                value: value,
                title: year,
              }
            },
          ]}
        />
        <Geom
          type="point"
          position="year*value"
          size={4}
          shape={'circle'}
          style={{ stroke: '#fff', lineWidth: 1 }}
          tooltip={[
            'year*value',
            (year, value) => {
              return {
                name: '数值', // 要显示的名字
                value: value,
                title: year,
              }
            },
          ]}
        />
      </Chart>
    </div>
  )
}
