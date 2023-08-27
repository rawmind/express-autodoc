
# express-autodoc
API documentation generator based on jsdoc comments for express

## Supported tags

| Tag               |      Format                                                                           | Example    |
|-------------------|:-------------------------------------------------------------------------------------:|-----------:|
| @queryParam       | (\<name\>) {type: string, required: true, default: \<defaultValue\> } \[description]> | `/** @queryParam (name) A name param */` |
| @pathParam        |  (\<:name\>)  \<description\>                                                         | `/** @pathParam (:id) song Id */`                                       |
| @produces         | \<contentType1\>,\<contentTypeN\>                                                     |  `/** @produces application/json */`|                                      |
| @description      | \<description\>                                                                       | `/** @description A description */`      |

[![Maintainability](https://api.codeclimate.com/v1/badges/9262fd4bab145894b197/maintainability)](https://codeclimate.com/github/rawmind/express-autodoc/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/9262fd4bab145894b197/test_coverage)](https://codeclimate.com/github/rawmind/express-autodoc/test_coverage)
