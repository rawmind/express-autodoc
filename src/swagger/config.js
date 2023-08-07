const security = [
  {
    "ApiKeyAuth": [],
    "OrgHeader": []
  }
]

const defaultConfig = {
  swagger: '2.0',
  host: 'localhost',
  schemes: ["http"],
  security,
}

exports.defaultConfig = defaultConfig