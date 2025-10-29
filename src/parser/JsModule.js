const fs = require('fs')
const { parseSync } = require("@babel/core");
const traverse = require("@babel/traverse").default;
const { RouterEnpointExpression } = require('./RouterEndpointExpression')
const { RouterInstance } = require('./RouterVariable')
const { ExpressImport } = require('./ExpressImport')
const { RouterLink } = require('./RouterLink')

const path = require('path');
const { ExpressInstance } = require('./ExpressInstance');
const { LocalImport } = require('./LocalImport');
const VERBS = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options', 'trace']

class JsModule {

  #ast = null
  #localImports = []
  #hasExpressWord = false
  #code = null

  get localImports() {
    return this.#localImports
  }

  constructor(filename, rootDir) {
    this.filename = filename
    const parsed = path.parse(filename)
    this.alias = `.${parsed.dir}/${parsed.name}`.replace(rootDir, '')
    this.#code = fs.readFileSync(filename, 'utf8')
    this.#hasExpressWord = this.#code.includes('express')
  }

  #preloadAst() {
    if (!this.#ast) {
      this.#ast = parseSync(this.#code, { sourceType: 'module' })
      console.log("Parsed AST for ", this.filename)
      this.#code = null
    }
    return this.#ast
  }

  traverseAst() {
    this.#preloadAst()
    const filename = this.filename
    const imports = []
    const routerInstances = []
    const routerEndpoints = []
    const expressInstances = []
    const routerLinks = []
    const localImports = []
    const findVariable = (varName) => {
      let v = routerInstances.find(r => r.variableName === varName)
      if (v) {
        return v
      }
      v = expressInstances.find(r => r.variableName === varName)
      if (v) {
        return v
      }
      return localImports.find(r => r.variableName === varName)
    }
    const isExpressImport = (callName) => imports.some(i => i.variableName == callName)

    traverse(this.#ast, {
      VariableDeclarator: {
        enter: function (nodePath) {
          const node = nodePath.node;
          const init = nodePath.node.init

          const calee = init?.callee?.name
          const args = init?.arguments

          // const { Router } = require('express')
          if (calee === 'require' && args.length > 0 && init?.arguments[0]?.value == 'express') {
            if (node.id.type === 'ObjectPattern' && node.id.properties.some(p => p.key.name === 'Router')) {
              imports.push(new ExpressImport(filename, node))
              return
            }
            // const express = require('express')
            if (node.id.type === 'Identifier') {
              imports.push(new ExpressImport(filename, node))
              return
            }
          }

          // const var = require('./var')
          if (calee === 'require' && node.id.type === 'Identifier' && args.length > 0 && args[0].value?.startsWith('.')) {
            localImports.push(new LocalImport(filename, node))
            return
          }

          // const router = express.Router();
          if (node.init?.type === 'CallExpression' && node.init.callee?.object?.name === 'express' && node.init.callee?.property?.name === 'Router' && node.init.callee?.type == 'MemberExpression') {
            routerInstances.push(new RouterInstance(filename, node))
            return
          }

          if (node.init?.type === 'CallExpression' && isExpressImport(calee)) {
            expressInstances.push(new ExpressInstance(filename, node))
            return
          }
        }
      },
      ExpressionStatement: {
        enter: function (nodePath) {
          const node = nodePath.node;
          const caleePropertyName = node.expression?.callee?.property?.name
          const expressionCalleeObjName = node.expression?.callee?.object?.name

          // app.put('/api/v1/song/:id/*', (_req, res) => ());
          if (VERBS.includes(caleePropertyName)) {
            const variable = findVariable(expressionCalleeObjName)
            if (variable) {
              routerEndpoints.push(new RouterEnpointExpression(filename, node, variable))
            }
            return
          }
          if ((node?.expression?.arguments?.length == 2) && ['use'].includes(caleePropertyName)) {
            const caller = findVariable(expressionCalleeObjName)
            if (caller) {
              const callee = findVariable(node?.expression?.arguments[1].name)
              if (callee) {
                // router in the same file
                routerLinks.push(new RouterLink(filename, node, caller, callee))
              } else {
                // router is imported
                routerLinks.push(new RouterLink(filename, node, caller, node?.expression?.arguments[1].name))
              }
            }
            return
          }
        },
      },
      AssignmentExpression: {
        enter: function (nodePath) {
          let node = nodePath.node;
          const left = node.left
          const right = node.right
          if (left.type === 'MemberExpression' && left?.object?.name === 'module' && left?.property?.name === 'exports' && right?.type === 'Identifier') {
            const variable = findVariable(right?.name)
            if (variable) {
              variable.exported = true
            }
            return
          }
        }
      }
    });

    this.routerInstances = routerInstances
    this.imports = imports
    this.routerEndpoints = routerEndpoints
    this.expressInstances = expressInstances
    this.routerLinks = routerLinks
    this.#localImports = localImports
    return this
  }

  hasExpress(){
    return this.#hasExpressWord && (this.traverseAst() && (this.expressInstances.length > 0 || this.routerInstances.length > 0) )
  }

  isExpressApp(){
    return this.#hasExpressWord && (this.traverseAst() && this.expressInstances.length > 0)
  }

}

exports.JsModule = JsModule