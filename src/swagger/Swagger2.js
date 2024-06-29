const assert = require('assert');
const { SwaggerPathParam, SwaggerEndpointPath, SwaggerQueryParam, SwaggerBody, SwaggerResponse } = require('../parser/EndpointDoc')
const { parse } = require('path')

class Swagger2 {
  constructor(config, exportTable) {
    assert(config, 'Swagger2 requires a config object')
    assert(config.swagger === '2.0', 'Swagger2 only supports version 2.0')
    this.config = config;
    this.exportTable = exportTable
  }

  generate(expressApps) {
    const paths = {}
    expressApps.forEach(app => {
      const rootPath = '/'
      app.routerEndpoints.forEach(endpoint => this.#createPath(endpoint, rootPath, paths))
      app.routerLinks.forEach(link => {
        if (link.routerVariable) {
          const routerModule = this.#findRoute(link.routerVariable.importPath)
          if (!routerModule) {
            return
          }
          const rootPath = link.path
          routerModule.routerEndpoints.forEach(endpoint => this.#createPath(endpoint, rootPath, paths))
        }
      })
    })
    this.config.paths = paths
    return this.config
  }

  #findRoute(path) {
    const parsed = parse(path)
    const normalized = `${parsed.dir}/${parsed.name}`
    return this.exportTable[normalized]
  }

  #createPath(endpoint, rootPath, paths) {
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
    const response = doc.response
    const responseBody = response ? new SwaggerResponse(response).value : {}
    path[endpoint.method] = {
      description: doc.description,
      parameters: pathParams.concat(queryParams).concat(bodyParams),
      responses: { '200': { description: 'OK', ...responseBody } },
    }
    if(produces && produces.length > 0){
      path[endpoint.method].produces = produces
    }
    console.log(`${endpoint.method} ${fullPath}`)
  }
}


exports.Swagger2 = Swagger2;