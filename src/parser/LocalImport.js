class LocalImport{

  constructor(filename, node){
    this.filename = filename
    this.location = node.loc.start
    this.variableName = node.id.name
    this.importPath = node.init.arguments[0].value
  }

}

exports.LocalImport = LocalImport