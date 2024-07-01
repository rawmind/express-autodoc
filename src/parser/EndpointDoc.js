const doctrine = require("doctrine");
const { pathToRegexp } = require('path-to-regexp')

class EndpointDoc {

    constructor(comments = [], path) {
        this.ast = doctrine.parse(comments.join('\n'), { unwrap: true })
        const tags = this.ast.tags
        this.description = tags.find(t => t.title === 'description')?.description || ''
        this.operationId = tags.find(t => t.title === 'operationId')?.description
        const docParms = tags.filter(t => t.title === 'pathParam')
            .map(t => PathParam.parse(t.description))
            .reduce((acc, p) => {
                acc[p.name] = p
                return acc
            }, {})
        this.queryParams = tags.filter(t => t.title === 'queryParam')
            .map(t => QueryParam.parse(t.description))
        this.body = tags.find(t => t.title === 'body' || t.title == 'request')?.description
        this.response = tags.find(t => t.title === 'response')?.description
        this.pathParams = this.extractPathParams(path).map(paramName => `:${paramName}`).map(paramName => new PathParam(paramName).merge(docParms[paramName]))
        this.produces = tags.filter(t => t.title === 'produces').map(t => new ProducesTag(t.description))
    }

    extractPathParams(path = '') {
        const keys = []
        const normalized = this.#relaceWildchart(path)
        pathToRegexp(normalized, keys)
        return keys.map(k => k.name)
    }

    #relaceWildchart(str) {
        return str.split('*').reduce((acc, currentValue, index) => {
            if (index === 0) {
                return currentValue;
            } else {
                return acc + `{anyStringParam}${index}` + currentValue;
            }
        }, '');
    }

}

class PathParam {

    constructor(name = '', description = '') {
        this.name = name
        this.description = description
    }

    static parse(str) {
        const regex = /\((.*?)\)/g;
        const matches = [...str.matchAll(regex)];
        const tagName = matches.map(match => match[1]).find(() => true)
        return new PathParam(tagName, str.replace(`(${tagName})`, '').trim())
    }

    merge(param) {
        return new PathParam(this.name, param?.description || this.description)
    }
}

class ProducesTag {
    constructor(contentTypes) {
        this.produces = contentTypes?.split(',').map(c => c.trim())
    }
}

class QueryParam {

    constructor(name, type, required = false, description = '', defaultValue) {
        this.name = name?.trim()
        this.type = type?.trim() || 'string'
        this.required = required
        this.defaultValue = defaultValue?.trim()
        this.description = description?.trim()
    }

    static parse(str) {
        const regex = /\(([^)]+)\) ?(\{[^}]+\})? ?(.+)?/;
        const matches = str.match(regex);
        if (matches) {
            const [, paramName, options, paramDescription] = matches;
            if (options) {
                const safeOptions = options.replace('{', '')
                    .replace('}', '')
                    .split(',')
                    .reduce((acc, o) => {
                        const [key, value] = o.split(':')
                        acc[key.trim()] = value?.trim()
                        return acc
                    }, {})
                const required = safeOptions['required'] === 'true'
                const defaultValue = safeOptions['default']
                const type = safeOptions['type']
                return new QueryParam(paramName, type, required, paramDescription, defaultValue)
            }
            return new QueryParam(paramName, undefined, undefined, paramDescription)
        }
    }
}

class SwaggerPathParam {

    constructor(pathParam, majorVersion = 2) {
        const pathTag = { name: pathParam.name.replace(':', ''), in: 'path', required: true }
        if (pathParam.description) {
            pathTag.description = pathParam.description
        }
        if (majorVersion === 3) {
            pathTag.schema = { type: 'string' }
        }
        if (majorVersion === 2) {
            pathTag.type = 'string'
        }
        this.value = pathTag
    }
}

class SwaggerBody {

    constructor(body, majorVersion = 2, contentType = 'application/json') {
        if (majorVersion === 2) {
            if (body.startsWith('{')) {
                this.value = { in: 'body', name: 'body', required: true, schema: { type: 'object', example: body } }
            } else {
                this.value = { in: 'body', name: 'body', required: true, schema: { $ref: body } }
            }
        }
        if (majorVersion === 3) {
            const requestBody = { content: {}, required: true }
            if (body.startsWith('{')) {
                requestBody.content[contentType] = { schema: { type: 'object', example: body } }
                this.value = requestBody
            } else {
                requestBody.content[contentType] = { schema: { $ref: body } }
                this.value = requestBody
            }
        }
    }
}

class SwaggerResponse {

    constructor(body, majorVersion = 2, contentType = 'application/json') {
        if (majorVersion === 2) {
            if (body.startsWith('{')) {
                this.value = { content: contentType, schema: { type: 'object', example: body } }
            } else {
                this.value = { content: contentType, schema: { $ref: body } }
            }
        }
        if (majorVersion === 3) {
            if (body.startsWith('{')) {
                this.value = { content: { 'application/json': { schema: { type: 'object', example: body } } } }
            } else {
                this.value = { content: { 'application/json': { schema: { $ref: body } } } }
            }
        }
    }
}

class SwaggerEndpointPath {

    constructor(path, pathParams) {
        this.value = this.#normalizePath(path, pathParams)
    }

    #normalizePath(path, pathParams = []) {
        // replace all path params with :param
        let normalized = path || ''
        pathParams.forEach(p => {
            normalized = normalized.replace(`:${p}`, `{${p}}`)
        })
        return normalized
    }
}

class SwaggerQueryParam {

    constructor(queryParam, majorVersion = 2) {
        const pathTag = { name: queryParam.name, in: 'query', required: queryParam.required}
        if (queryParam.description) {
            pathTag.description = queryParam.description
        }
        if (majorVersion === 3) {
            pathTag.schema = { type: queryParam.type, default: queryParam.defaultValue }
        }
        if (majorVersion === 2) {
            pathTag.type = queryParam.type
            pathTag.default = queryParam.defaultValue
        }
        this.value = pathTag
    }
}

exports.PathParam = PathParam
exports.QueryParam = QueryParam
exports.EndpointDoc = EndpointDoc
exports.SwaggerPathParam = SwaggerPathParam
exports.SwaggerEndpointPath = SwaggerEndpointPath
exports.SwaggerQueryParam = SwaggerQueryParam
exports.ProducesTag = ProducesTag
exports.SwaggerBody = SwaggerBody
exports.SwaggerResponse = SwaggerResponse