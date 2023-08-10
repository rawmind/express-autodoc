const { generateSwagger } = require('./../src/traverse')
const fs = require('fs')

describe('#generateSwagger', () => {

  describe('single app without router', () => {
    it('should return swagger output', () => {
      expect(generateSwagger('./examples/singleApp', undefined, './examples/singleApp/swagger_output_test.json' )).toStrictEqual(loadExample('./examples/singleApp/swagger_output.json'));
    })
  })

  describe('single app with router', () => {
    it('should return swagger output', () => {
      expect(generateSwagger('./examples/withRouter', undefined, './examples/withRouter/swagger_output_test.json' )).toStrictEqual(loadExample('./examples/withRouter/swagger_output.json'));
    })
  })
})

function loadExample(path){
  return JSON.parse(fs.readFileSync(path))
}