const assert = require('assert');
const { SwaggerPathParam, SwaggerEndpointPath, SwaggerQueryParam, SwaggerBody, SwaggerResponse } = require('../parser/EndpointDoc')
const { parse } = require('path')

class OpenApi3 {
  constructor(config, exportTable) {
    assert(config, 'requires a config object')
    assert(config.openapi, 'requires an openapi version')
    assert(config.openapi.startsWith('3.'), 'only supports version 3.x')
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
    const queryParams = doc.queryParams.map(p => new SwaggerQueryParam(p, 3).value)
    const pathParams = doc.pathParams.map(p => new SwaggerPathParam(p, 3).value)
    const body = doc.body
    const response = doc.response
    const responseBody = response ? new SwaggerResponse(response, 3).value : {}
    path[endpoint.method] = {
      description: doc.description,
      parameters: pathParams.concat(queryParams),
      // todo: add content type
      responses: { '200': { description: 'OK', ...responseBody} },
    }
    if(body) {
      path[endpoint.method].requestBody = new SwaggerBody(body, 3).value
    }
    const operationId = doc.operationId
    if(operationId) {
      path[endpoint.method].operationId = operationId
    }
    console.log(`${endpoint.method} ${fullPath}`)
  }

}

exports.OpenApi3 = OpenApi3