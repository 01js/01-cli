const path = require('path')

const { stopSpinner } = require('@vue/cli-shared-utils')
async function create (projectName, options) {
  if (options.proxy) {
    process.env.HTTP_PROXY = options.proxy
  }

  const cwd = options.cwd || process.cwd()
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.relative('../', cwd) : projectName
  const targetDir = path.resolve(cwd, projectName || '.')
}


module.exports = (...args) => {
  return create(...args).catch(err => {
    stopSpinner(false) // do not persist
    error(err)
    if (!process.env.VUE_CLI_TEST) {
      process.exit(1)
    }
  })
}
