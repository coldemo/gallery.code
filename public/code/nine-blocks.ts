// <!DOCTYPE html>
// <html>
//   <head>
//     <meta charset="utf-8">
//     <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
//     <meta name="renderer" content="webkit">
//     <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
//   </head>
//   <body>
//     <!--
//       // 设备宽度未知，九宫格容器是一个正方形，每个宫格也是正方形，宫格边框宽度为1px
//       +----+----+----+
//       | 0A | 0B | 0C |
//       |----|----|----|
//       | 1A | 1B | 1C |
//       |----|----|----|
//       | 2A | 2B | 2C |
//       +----+----+----+
//     -->
//   </body>
// </html>

appendCss(`
#mountNode {
  padding: 20px;
}
.grids {
  margin: 0 auto;
  max-width: 300px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.grids > div {
  border: solid 1px gray;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -1px 0 0 -1px; /* dont forget */
}
.grids > div:before {
  display: block;
  content: '';
  padding-bottom: 100%;
}
`)

let myGrids = document.createElement('div')
myGrids.id = 'myGrids'
myGrids.className = 'grids'

let cols = 3
let arr: string[] = []
for (let i = 0; i < cols; i++) {
  for (let j = 0; j < cols; j++) {
    arr.push(`${i}${String.fromCharCode(65+j)}`)
  }
}

arr.forEach(val => {
  let div = document.createElement('div')
  div.textContent = val
  div.style.width = `${100 / cols}%`
  myGrids.appendChild(div)
})
document.querySelector('#mountNode').appendChild(myGrids)
