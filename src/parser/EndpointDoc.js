const doctrine = require("doctrine");
const { pathToRegexp } = require('path-to-regexp')

class EndpointDoc {

    constructor(comments=[], path) {
        this.ast = doctrine.parse(comments.join('\n'), { unwrap: true })
        this.description = this.ast.tags.find(t => t.title === 'description')?.description || ''
        const docParms = this.ast.tags.filter(t => t.title === 'pathParam')
            .map(t => PathParam.parse(t.description))
            .reduce((acc, p) => {
                acc[p.name] = p
                return acc
            }, {})
        this.pathParams = this.extractPathParams(path).map(paramName =>`:${paramName}`).map(paramName => new PathParam(paramName).merge(docParms[paramName]) )
    }

    extractPathParams(path = ''){
        const keys = []
        const normalized = this.#relaceWildchart(path)
        pathToRegexp(normalized, keys)
        return keys.map(k => k.name)
    }

    #relaceWildchart(str){
        return str.split('*').reduce((acc, currentValue, index) => {
          if (index === 0) {
            return currentValue;
          } else {
            return acc + `{anyStringParam}${index}` + currentValue;
          }
        }, '');
      }

}

class PathParam {

    constructor(name = '', description = '') {
        this.name = name
        this.description = description
    }

    static parse(str) {
        const regex = /\((.*?)\)/g;
        const matches = [...str.matchAll(regex)];
        const tagName = matches.map(match => match[1]).find(() => true)
        return new PathParam(tagName, str.replace(`(${tagName})`, '').trim())
    }

    merge(param){
        return new PathParam(this.name, param?.description || this.description)
    }
}

class SwaggerPathParam {

    constructor(pathParam) {
        const pathTag =  { name: pathParam.name.replace(':', ''), in: 'path', required: true, type: 'string'}
        if(pathParam.description){
            pathTag.description = pathParam.description
        }
        this.value = pathTag
    }
}

class SwaggerEndpointPath {

    constructor(path, pathParams){
        this.value = this.#normalizePath(path, pathParams)
    }

    #normalizePath(path, pathParams = []){
        // replace all path params with :param
        let normalized = path || ''
        pathParams.forEach(p => {
          normalized = normalized.replace(`:${p}`, `{${p}}`)
        })
        return normalized
    }

}

exports.PathParam = PathParam
exports.EndpointDoc = EndpointDoc
exports.SwaggerPathParam = SwaggerPathParam
exports.SwaggerEndpointPath = SwaggerEndpointPath