const { JsModule } = require('./parser/JsModule')
const { walk } = require('./walker')
const { ExpressProject } = require('./swagger/ExpressProject')

exports.generateSwagger = (projectDir, config, outputFile = 'swagger_output.json') => {
  const modules = walk(projectDir).map(f => new JsModule(f, projectDir).traverseAst())
  const expressModules = modules.filter(m => m.hasExpress())
  return new ExpressProject(expressModules).generateSwagger(config, outputFile)
}
