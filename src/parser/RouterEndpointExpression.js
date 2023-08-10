const { pathToRegexp } = require('path-to-regexp')
class RouterEnpointExpression{

  constructor(filename, node, routerVariable){
    this.filename = filename
    this.location = node.loc.start
    this.variableName = node?.id?.name
    const caleePropertyName = node.expression?.callee?.property?.name
    this.comment = this.extractJsDocComments(node)
    this.method = caleePropertyName
    // todo
    const expressPath = node.expression?.arguments[0].value
    this.routerVariable = routerVariable
    this.pathParams = this.extractPathParams(expressPath)
    this.path = this.normalizePath(expressPath, this.pathParams)
  }

  extractJsDocComments(node){
    return node.leadingComments?.map(c => c.value)
    .filter(v => typeof v
      && v.startsWith('*')
      ) || []
  }

  normalizePath(path, pathParams = []){
    // replace all path params with :param
    let normalized = path || ''
    pathParams.forEach(p => {
      normalized = normalized.replace(`:${p}`, `{${p}}`)
    })
    return normalized
  }


  extractPathParams(path = ''){
    const keys = []
    const normalized = this.relaceWildchart(path)
    pathToRegexp(normalized, keys)
    return keys.map(k => k.name)
  }

  relaceWildchart(str){
    return str.split('*').reduce((acc, currentValue, index) => {
      if (index === 0) {
        return currentValue;
      } else {
        return acc + `{anyStringParam}${index}` + currentValue;
      }
    }, '');
  }

}

exports.RouterEnpointExpression = RouterEnpointExpression
