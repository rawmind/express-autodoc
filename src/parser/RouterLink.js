class RouterLink{

  constructor(filename, node, caller, callee){
    this.filename = filename
    this.location = node.loc.start
    this.routerVariable = callee
    this.appVariable = caller
    this.path = node.expression?.arguments[0].value
  }

}

exports.RouterLink = RouterLink