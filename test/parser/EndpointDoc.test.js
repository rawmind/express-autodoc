const { EndpointDoc, PathParam, SwaggerPathParam, SwaggerEndpointPath, QueryParam, SwaggerQueryParam } = require('../../src/parser/EndpointDoc')

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


describe('SwaggerEndpointPath', () => {
    describe('#new', () => {
      it('should convert to swagger', () => {
        expect(new SwaggerEndpointPath('/api/v1/song/:id', ['id']).value).toEqual('/api/v1/song/{id}')
      })
    })

  })

describe('QueryParam', () => {

  it('should parse tag name', () => {
    expect(QueryParam.parse('(title)')).toEqual(new QueryParam('title', 'string', false, ''))
  })

  it('should handle empty queryparam', () => {
    expect(QueryParam.parse('')).toEqual(undefined)
  })

  it('should parse queryparam with description', () => {
    expect(QueryParam.parse('(title) {type: string} some title')).toEqual(new QueryParam('title', 'string', false, 'some title'))
  })

  it('should parse queryparam with description and required', () => {
    expect(QueryParam.parse('(title) {type: string, required: true} some title')).toEqual(new QueryParam('title', 'string', true, 'some title'))
  })

  it('should parse queryparam with type', () => {
    expect(QueryParam.parse('(title) {type: integer} some title')).toEqual(new QueryParam('title', 'integer', false, 'some title'))
  })
})

describe('SwaggerQueryParam', () => {

  describe('#new', () => {
    it('should convert to swagger', () => {
      expect(new SwaggerQueryParam(new QueryParam('title', 'string', false, 'some title')).value).toEqual({ name: 'title', in: 'query', required: false, type: 'string', description: 'some title' })
    })

    it('should convert to swagger with required', () => {
      expect(new SwaggerQueryParam(new QueryParam('title', 'integer', true, 'some title')).value).toEqual({ name: 'title', in: 'query', required: true, type: 'integer', description: 'some title' })
    })

    it('should convert to swagger with default type', () => {
      expect(new SwaggerQueryParam(new QueryParam('title', '', false, 'some title')).value).toEqual({ name: 'title', in: 'query', required: false, type: 'string', description: 'some title' })
    })
  })
})