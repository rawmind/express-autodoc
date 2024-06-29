const { generateSwagger } = require('./../src/traverse')
const fs = require('fs')

describe('#generateSwagger', () => {

  describe('single app without router', () => {

    it('should apply a custom config and return swagger output for 2.0', () => {
      const customConfig ={
        swagger: "2.0",
        host: "localhost:1234",
        definitions: {
          "Song": {
            "type": "object",
            "properties": {
              "title": {
                "type": "string"
              }
            }
          }
        },
        info: { "title": "test" },
        schemes: ["http", "https"],
        security: [
        {
          ApiKeyAuth: [],
          OrgHeader: []
        }
      ]}
      expect(generateSwagger('./examples/singleApp', customConfig, './examples/singleApp/swagger_output_test.json' )).toStrictEqual(loadExample('./examples/singleApp/swagger_output_with_config.json'));
    })

    it('should apply a custom config and return swagger output for 3.0', () => {
      const customConfig ={
        swagger: "3.0",
        host: "localhost:1234",
        components: {
          "Song": {
            "type": "object",
            "properties": {
              "title": {
                "type": "string"
              }
            }
          }
        },
        info: { "title": "test" },
        schemes: ["http", "https"],
        security: [
        {
          ApiKeyAuth: [],
          OrgHeader: []
        }
      ]}
      expect(generateSwagger('./examples/singleApp', customConfig, './examples/singleApp/swagger_output_test_3.json' )).toStrictEqual(loadExample('./examples/singleApp/swagger_output_with_config_3.json'));
    })

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