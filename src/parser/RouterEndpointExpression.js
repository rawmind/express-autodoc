const { EndpointDoc } = require('./EndpointDoc')
class RouterEndpointExpression{

  constructor(filename, node, routerVariable){
    this.filename = filename
    this.location = node.loc.start
    this.variableName = node?.id?.name
    const caleePropertyName = node.expression?.callee?.property?.name
    this.method = caleePropertyName
    const expressPath = node.expression?.arguments[0].value
    this.documentation = new EndpointDoc(this.extractJsDocComments(node), expressPath)
    this.routerVariable = routerVariable
    this.path = expressPath
  }

  extractJsDocComments(node){
    return node.leadingComments?.map(c => c.value)
      .filter(v => typeof v && v.startsWith('*'))
  }

}

exports.RouterEnpointExpression = RouterEndpointExpression
