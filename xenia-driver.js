
/**
 * Module dependencies
 */

import axios from 'axios'

/**
 * Module constants
 */

const dataSchema = {
  name: 'my_query',
  desc: 'made with xenia driver',
  enabled: true
}

const querySchema = {
  name: 'my_query',
  type: 'pipeline',
  collection: 'user_statistics',
  return: true
}

/**
 * Driver Class
 * @class
 */

class XeniaDriver {

  /**
   * Initialize the driver
   * @constructor
   * @param {string} base url - Xenia base url
   * @param {object | string} Auth - Xenia basic authentication credentials
   * @param {object} parameters - extra parameters; optional
   * @param {object} request parameters - overrides extra parameters; optional

   */
  constructor(baseURL, auth, params = {}, reqParams) {
    if ('string' !== typeof baseURL) {
      throw new Error('A base url is needed for the Xenia Driver to work.')
    }

    if ('object' !== typeof auth && 'string' !== typeof auth) {
      throw new Error('An authorization object ({username, password}) or a Basic Authentication string is needed for the Xenia Driver to work.')
    }

    this._baseURL = baseURL
    this._auth = auth
    this._params = params
    let headers = {}

    if (typeof auth === 'string') {
      headers.Authorization = auth
      auth = null 
    }

    // Initialize the request instance
    this._request = axios.create({
      baseURL,
      auth,
      headers,
      timeout: 10000
    });

    // Initialize the query
    this._data = Object.assign({}, dataSchema, {params: [], queries: []},
      params.defaults, reqParams)

    if (!reqParams) {
      this.addQuery(params)
    }

    return this
  }

  /**
   * Commit the current query
   * @private
   */

  _commitQuery () {
    if (this._query) {
      this._query.commands = this._commands
      this._query._pendingJoin = this._pendingJoin
      this._data.queries.push(this._query)
    }
    this._query = null
    this._pendingJoin = null
    return this
  }

  /**
   * Initialize a query
   * @param {object} query object - optional
   */

  addQuery (queryData = {}) {
    const rand = Math.floor(Math.random() * 9999)
    this._commitQuery()
    this._query = Object.assign({}, querySchema, queryData, {name: 'my_query_' + rand, commands: []})
    this._commands = []

    return this
  }

  /**
   * Set the collection for the current query
   * @param {string} collection name
   */

  collection ( name = 'user_statistics' ) {
    this._query.collection = name
    return this
  }

  /**
   * Executes the request
   * @api private
   * @param {string} query name - optional
   * @param {object} query parameters - optional
   */
  _execRequest (method = 'post', path = '/exec', data = {}) {
    return this._request[method](path, data)
      .then(res => res.data)

      // perform join match
      .then(data => {
        if (!data.results) return data
        data.results.forEach((res, i) => {
          if(!this._data.queries[i]) return
          const pendingJoin = this._data.queries[i]._pendingJoin
          if (pendingJoin) {
            res.Docs = res.Docs.map(doc => {
              const match = data.results[i + 1].Docs.find(nextDoc => 
                nextDoc[pendingJoin.field] === doc[pendingJoin.matchingField]
              )
              doc[pendingJoin.name] = match
              return doc
            })
          }
        })
        return data
      })
  }
    
  /**
   * Executes the request
   * @param {string} query name - optional
   * @param {object} query parameters - optional
   */

  exec (queryName, params={}) {
    if ('string' !== typeof queryName) {
      this._commitQuery()
      return this._execRequest('post', '/exec', this._data)
    } else {
      return this._execRequest('get', `/exec/${queryName}`, {params})
    }
  }

  /**
   * Get a list of available queries
   */

  getQueries () {
    return this._execRequest('get', '/query')
  }

  /**
   * Get a specific queryset document
   * @param {string} query name
   */

  getQuery ( name ) {
    return this._execRequest('get', `/query/${name}`)
  }

  /**
   * Save a query into xenia instead of executing it
   */

  saveQuery ( name ) {
    if ( name ) {
      this._data.name = name
    }

    return this._request.put('/query', this._data)
      .then(res => res.data)
  }

  /**
   * Delete a query from xenia
   * @param {String} name
   */

  deleteQuery ( name ) {
    if ( name ) {
      this._data.name = name
    }

    return this._request.delete(`/query/${name}`)
      .then(res => res.data)
  }


  /**
   * Limit the amount of retrieved documents
   * @param {number} limit - default: 20
   */

  limit (n = 20) {
    this._commands.push({'$limit': n})
    return this
  }


  /**
   * Skip the first n documents
   * @param {number} skip - default: 0
   */

  skip (n = 0) {
    this._commands.push({'$skip': n})
    return this
  }

  /**
   * Return a document sample from the collection
   * @param {number} size - default: 20
   */

  sample (size = 20) {
    this._commands.push({ '$sample': { size } })
    return this
  }

  /**
   * Include and exclude fields from the result
   * @param {object} fields
   */

  project ( fields = {} ) {
    this._commands.push({ '$project': fields })
    return this
  }

  /**
   * Whitelist retrieved fields
   * @param {array} fields
   */

  include ( fields = [] ) {
    const obj = {}
    fields.forEach(field => obj[field] = true)
    this._commands.push({ '$project': obj })
    return this
  }

  /**
   * Blacklist retrieved fields
   * @param {array} fields
   */

  exclude ( fields = [] ) {
    const obj = {}
    fields.forEach(field => obj[field] = false)
    this._commands.push({ '$project': obj })
    return this
  }

  /**
   * Performs a match command
   * @param {object} match
   */

  match ( query = {} ) {
    this._commands.push({ '$match': query })
    return this
  }


  /**
   * Performs a redact command
   * @param {object} match
   */

  redact ( query = {} ) {
    this._commands.push({ '$redact': query })
    return this
  }

  /**
   * Deconstructs an array field from the input documents to
   * output a document for each element
   * @param {string} path
   * @param {string} include array index - optional
   * @param {boolean} preserve null and empty arrays - optional
   */

  unwind ( path = {}, includeArrayIndex, preserveNullAndEmptyArrays ) {
    this._commands.push({ '$unwind': { path, includeArrayIndex, preserveNullAndEmptyArrays} })
    return this
  }

  /**
   * Group documents
   * @param {object} group
   */

  group ( groups = {} ) {
    this._commands.push({ '$group': groups })
    return this
  }

  /**
   * Sort documents
   * @param {object|array} sorting data
   */

  sort ( order = {} ) {
    if(Array.isArray(order)) {
      this._commands.push({ '$sort': { [order[0]]: order[1] } })
    } else {
      this._commands.push({ '$sort': order })
    }
    return this
  }

  /**
   * Creates a new query joining the actual one using the save method
   * from Xenia
   * @param {string} collection
   * @param {string} field - default: _id
   * @param {string} matching field - default: field
   * @param {sting} join parameter name - default: 'list'
   */

  join ( collection, field = '_id', matchingField, name = 'list' ) {
    if ( !matchingField ) { 
      matchingField = field
    }

    this._pendingJoin = { field, matchingField, name }
    this._commands.push({ '$save': { '$map': name } })
    this.addQuery().collection(collection)
      .match({ [field]: { '$in': `#data.*:${name}.${matchingField}`} })
    return this
  }


}

/**
 * Expose a function that just create a new XeniaDriver instance
 * so you don't need to use the `new` keyword ¯\_(ツ)_/¯
 */

 module.exports = function (url, auth, params) {
   return (reqParams) => {
     return new XeniaDriver(url, auth, params, reqParams)
   }
 }
