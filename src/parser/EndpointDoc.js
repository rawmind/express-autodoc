const doctrine = require("doctrine");

class EndpointDoc {

    constructor(comments=[]) {
        this.ast = doctrine.parse(comments.join('\n'), { unwrap: true })
        this.description = this.ast.tags.find(t => t.title === 'description')?.description || ''
    }

}

exports.EndpointDoc = EndpointDoc