// @ts-check
const fs = require('fs')
const request = require('request-promise')
const baseUrl = 'x'

/**@type {string[]} */
const files = require('glob').sync('../hermes/*.php').map(path=>path.slice(10))
const get_html_name = (/**@type {string}*/file)=>file.replace(/\.php$/,'.html')
const dir = './html'
require('mkp').sync(dir) //create save dir
/**@type {string[]} */
const dist_htmls = files.map((file)=>get_html_name(`${dir}/${file}`))

//clear last dist html
dist_htmls.forEach((file)=>fs.existsSync(file) && fs.unlinkSync(file))

const matches = /**@type {[RegExp,string][]}*/(
  files.map(file=>([ new RegExp(file,'g'), get_html_name(file) ]))
)

files.map(async(file,index)=>{
  let url = `${baseUrl}/${file}`
  /**@type {string} */
  let html = await request(url).then(null,(err)=>JSON.stringify(err))
  let savePath = dist_htmls[index]
  for(let [ regx, html_name ] of matches){
    html = html.replace(regx,html_name)
  }
  fs.writeFileSync(savePath,html)
})
