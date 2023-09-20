const { defaultConfig } = require('./config')
const fs = require('fs')
const { SwaggerPathParam, SwaggerEndpointPath, SwaggerQueryParam, SwaggerBody } = require('../parser/EndpointDoc')
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
  const doc = endpoint.documentation
  const swaggerPath = new SwaggerEndpointPath(fullPath, doc.extractPathParams(fullPath))
  const path = paths[swaggerPath.value] || {}
  if (Object.keys(path).length === 0) {
    paths[swaggerPath.value] = path
  }
  const queryParams = doc.queryParams.map(p => new SwaggerQueryParam(p).value)
  const pathParams = doc.pathParams.map(p => new SwaggerPathParam(p).value)
  const produces = doc.produces.flatMap(p => p.produces)
  const body = doc.body
  const bodyParams = body ? [new SwaggerBody(body).value] : []
  path[endpoint.method] = {
    description: doc.description,
    parameters: pathParams.concat(queryParams).concat(bodyParams),
    responses: { '200': { description: 'OK' } },
  }
  if(produces && produces.length > 0){
    path[endpoint.method].produces = produces
  }
  console.log(`${endpoint.comment} \n ${endpoint.method} ${fullPath}`)
}

exports.ExpressProject = ExpressProject