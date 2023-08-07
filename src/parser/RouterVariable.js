class RouterInstance {

  constructor(filename, node){
    this.filename = filename
    this.location = node.loc.start
    this.variableName = node.id.name
  }

}

exports.RouterInstance = RouterInstance