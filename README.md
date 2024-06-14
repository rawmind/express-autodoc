
# express-autodoc
API documentation generator based on jsdoc comments for express

[![Maintainability](https://api.codeclimate.com/v1/badges/9262fd4bab145894b197/maintainability)](https://codeclimate.com/github/rawmind/express-autodoc/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/9262fd4bab145894b197/test_coverage)](https://codeclimate.com/github/rawmind/express-autodoc/test_coverage)

## Quick start

### Install

```bash

npm install express-autodoc --save-dev
```

### Add documentation for your Express.js endpoint

```js
/**
 * @description Get songs
 * @queryParam (title) The song title
 * @pathParam (:albumId) album UUID
 * @produces application/json, application/xml
 */
app.get('/api/albums/:albumId/songs', (req, res) => (
  res.json({
    title: req.title,
  })
));
```

### Generate swagger mapping

```bash
node -e 'require("express-autodoc").generateSwagger(".")'
```

## Supported tags

| Tag               |      Format                                                                           | Example                                  |
|-------------------|:-------------------------------------------------------------------------------------:|-----------------------------------------:|
| @queryParam       | (\<name\>) {type: string, required: true, default: \<defaultValue\> } \<description\> | `/** @queryParam (name) A name param */` |
| @pathParam        |  (\<:name\>)  \<description\>                                                         | `/** @pathParam (:id) song Id */`        |
| @produces         | \<contentType1\>,\<contentTypeN\>                                                     |  `/** @produces application/json */`|                                      |
| @description      | \<description\>                                                                       | `/** @description A description */`      |
| @body             | \<body\> [{"example": "object"} |<reference>]                                        | `/** @body {} */` `/** @body #definitions/Song */` |

### See more examples: [simple app](examples/singleApp/), [app with router](examples/withRouter/)