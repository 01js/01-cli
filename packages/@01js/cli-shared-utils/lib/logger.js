const padStart = require('string.prototype.padstart')
const stripAnsi = require('strip-ansi')
const chalk = require('chalk')
function _log (type, tag, message) {
  if (process.env.CLI_API_MODE && message) {
    exports.events.emit('log', {
      message,
      type,
      tag
    })
  }
}

const format = (label, msg) => {
  return msg.split('\n').map((line, i) => {
    return i === 0
      ? `${label} ${line}`
      : padStart(line, stripAnsi(label).length)
  }).join('\n')
}
const chalkTag = msg => chalk.bgBlackBright.white.dim(` ${msg} `)
exports.error = (msg, tag = null) => {
  console.error(format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(msg)))
  _log('error', tag, msg)
  if (msg instanceof Error) {
    console.error(msg.stack)
    _log('error', tag, msg.stack)
  }
}
