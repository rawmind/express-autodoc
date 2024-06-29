const fs = require('fs')
const { Swagger2 } = require('./Swagger2')
const { OpenApi3 } = require('./OpenApi3')
const { defaultConfig } = require('./config')

class ExpressProject {
  constructor(modules) {
    this.modules = modules
    this.expressApps = modules.filter(m => m.isExpressApp())
    this.exportTable = modules.filter(m => !m.isExpressApp()).reduce((acc, m) => {
      acc[m.alias] = m
      return acc
    }, {})
  }

  generateSwagger(swaggerConfig = defaultConfig, outFile) {
    let product = swaggerConfig
    this.expressRoutes = []
    if (this.#isOpenApi2(product)) {
      product = new Swagger2(swaggerConfig, this.exportTable).generate(this.expressApps, this.exportTable)
    } else {
      product = new OpenApi3(swaggerConfig, this.exportTable).generate(this.expressApps, this.exportTable)
    }
    const json = JSON.stringify(product, null, 2)
    fs.writeFileSync(outFile, json)
    return product
  }

  #isOpenApi2(config) {
    return config.swagger === '2.0'
  }
}

exports.ExpressProject = ExpressProject