const { defaultConfig } = require('./config')
const fs = require('fs')
const { parse } = require('path')

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
      const rootPath = '/'
      app.routerEndpoints.forEach(endpoint => createPath(endpoint, rootPath, paths))
      app.routerLinks.forEach(link => {
        if (link.routerVariable) {
          const routerModule = this.findRoute(link.routerVariable.importPath)
          if (!routerModule) {
            return
          }
          const rootPath = link.path
          routerModule.routerEndpoints.forEach(endpoint => createPath(endpoint, rootPath, paths))
        }
      })
    })
    swaggerConfig.paths = paths
    const json = JSON.stringify(swaggerConfig, null, 2)
    fs.writeFileSync(outFile, json)
    return swaggerConfig
  }
}

function createPath(endpoint, rootPath, paths) {
  const fullPath = (rootPath + endpoint.path).replace(/\/\//g, '/')
  const path = paths[fullPath] || {}
  if (Object.keys(path).length === 0) {
    paths[fullPath] = path
  }
  const comment = endpoint.comment.find(() => true) || ''
  path[endpoint.method] = {
    description: comment,
    parameters: endpoint.pathParams.map(p => ({ name: p, in: 'path', required: true, type: 'string' })),
    responses: { '200': { description: 'OK' } }
  }
  console.log(`${endpoint.comment} \n ${endpoint.method} ${fullPath}`)
}

exports.ExpressProject = ExpressProject