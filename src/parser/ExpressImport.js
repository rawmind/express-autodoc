const VARIABLE_IMPORT =  'VariableImport'
const CLASS_IMPORT = 'ClassImport'
const NOT_IMPORT = 'NotImport'


class ExpressImport {

  constructor(filename, node){
    this.filename = filename
    this.location = node.loc.start
    switch(node.id.type){
      case 'ObjectPattern':
        this.type = node.id.properties.some(p => p.key.name === 'Router') ? CLASS_IMPORT : NOT_IMPORT
        this.class = 'Router'
        break;
      case 'Identifier':
        this.type = VARIABLE_IMPORT
        this.variableName = node.id.name
        break;
      default:
        this.type = NOT_IMPORT
    }
  }

}

exports.ExpressImport = ExpressImport
