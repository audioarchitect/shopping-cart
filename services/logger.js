const PRINT_LOG = false;

/**
 *  Super basic logger. If const set to true, console.log the message
 *
 *  @param {string} msg
 */
function log(msg) {
  if (PRINT_LOG) {
    console.log(msg);
  }
}

module.exports = {
  log
}