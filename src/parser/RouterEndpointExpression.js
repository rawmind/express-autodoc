class RouterEnpointExpression{

  constructor(filename, node, routerVariable){
    this.filename = filename
    this.location = node.loc.start
    this.variableName = node?.id?.name
    const caleePropertyName = node.expression?.callee?.property?.name
    this.comment = this.extractJsDocComments(node)
    this.method = caleePropertyName
    // todo
    this.path = node.expression?.arguments[0].value
    this.routerVariable = routerVariable
  }

  extractJsDocComments(node){
    return node.leadingComments?.map(c => c.value)
    .filter(v => typeof v
      && v.startsWith('*')
      ) || []
  }

}

exports.RouterEnpointExpression = RouterEnpointExpression
