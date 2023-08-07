const { JsModule } = require('./parser/JsModule')
const { walk } = require('./walker')
const { parse } = require('path')
const fs = require('fs')
const { defaultConfig } = require('./swagger/config')

class ExpressProject {
  constructor(modules) {
    this.modules = modules
    this.expressApps = modules.filter(m => m.isExpressApp())
    this.exportTable = modules.filter(m => !m.isExpressApp()).reduce((acc, m) => {
      acc[m.alias] = m
      return acc
    }, {})
  }

  findRoute(path) {
    const parsed = parse(path)
    const normalized = `${parsed.dir}/${parsed.name}`
    return this.exportTable[normalized]
  }

  generateSwagger(swaggerConfig = defaultConfig, outFile) {
    const paths = {}
    this.expressRoutes = []
    this.expressApps.forEach(app => {
      app.routerLinks.forEach(link => {
        if (link.routerVariable) {
          const routerModule = this.findRoute(link.routerVariable.importPath)
          if (!routerModule) {
            return
          }
          routerModule.routerEndpoints.forEach(endpoint => {
            const fullPath = (link.path + endpoint.path).replace(/\/\//g, '/')
            const path = paths[fullPath] || {}
            if (Object.keys(path).length === 0) {
              paths[fullPath] = path
            }
            const comment = endpoint.comment.find(() => true) || ''
            path[endpoint.method] = { description: comment  }
            console.log(`${endpoint.comment} \n ${endpoint.method} ${fullPath}`)
          })
        }
      })
    })
    swaggerConfig.paths = paths
    const json = JSON.stringify(swaggerConfig, null, 2)
    fs.writeFileSync(outFile, json)
    return swaggerConfig
  }
}

exports.generateSwagger = (projectDir, config, outputFile = 'swagger_output.json') => {
  const modules = walk(projectDir).map(f => new JsModule(f, projectDir).traverseAst())
  const expressModules = modules.filter(m => m.hasExpress())
  return new ExpressProject(expressModules).generateSwagger(config, outputFile)
}