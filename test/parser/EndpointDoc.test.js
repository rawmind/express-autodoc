const { EndpointDoc, PathParam, SwaggerPathParam } = require('../../src/parser/EndpointDoc')

describe('EndpointDoc', () => {
  it('should read description tag', () => {
    expect(new EndpointDoc(['/** @description Some description */']).description).toBe('Some description')
  })

  it('should handle empty description tag when caption is not provided', () => {
    expect(new EndpointDoc(['/** @description */']).description).toBe('')
  })

  it('should handle empty description tag when tag is absent', () => {
    expect(new EndpointDoc(['/** */']).description).toBe('')
  })

  it('should handle empty description tag when there is no doc', () => {
    expect(new EndpointDoc(['']).description).toBe('')
  })

  it('should handle multiline', () => {
    expect(new EndpointDoc(['/** @description some multi\n*line description*/']).description).toBe('some multi\nline description')
  })

  it('should merge path params', () => {
    const endpointDoc = new EndpointDoc(['/** @pathParam (:id) some id */'], '/:id')
    expect(endpointDoc.pathParams[0]).toStrictEqual(new PathParam(':id', 'some id'))
  })
})

describe('PathParam', () => {

   describe('#parse', () => {

    it('should parse tag name', () => {
      expect(PathParam.parse('(:id)')).toEqual(new PathParam(':id', ''))
    })

    it('should handle empty pathparam', () => {
      expect(PathParam.parse('')).toEqual(new PathParam('', ''))
    })

    it('should parse pathparam with description', () => {
      expect(PathParam.parse('(:id) some id')).toEqual(new PathParam(':id', 'some id'))
    })
  })
})

describe('SwaggerPathParam', () => {

  describe('#new', () => {
    it('should convert to swagger', () => {
      expect(new SwaggerPathParam(new PathParam(':id', 'some id')).value).toEqual({ name: 'id', in: 'path', required: true, type: 'string', description: 'some id' })
    })
  })

})