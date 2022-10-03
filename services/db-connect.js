const sqlite = require('better-sqlite3');
const path = require('path');
const db = new sqlite(path.resolve('shopping-cart.db'), { fileMustExist: true });

/**
 * Run a DB query
 * 
 * @param {string} sql - SQL query string
 * @param {string[]} option query params
 */
function query(sql, params = []) {
  return db.prepare(sql).all(params);
}

module.exports = {
  query
}