const { EndpointDoc } = require('../../src/parser/EndpointDoc')

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
})