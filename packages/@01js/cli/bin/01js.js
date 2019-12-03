#!/usr/bin/env node

const { chalk, semver } = require('@01js/cli-shared-utils')
const requiredVersion = require('../package.json').engines.node
const didYouMean = require('didyoumean')

// Setting edit distance to 60% of the input string's length
didYouMean.threshold = 0.6

function checkNodeVersion (wanted, id) {

  if (!semver.satisfies(process.version, wanted)) {
    console.log(chalk.red(
    'You are using Node ' + process.version + ', but this version of ' + id +
    ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ))
    process.exit(1)
  }
}

checkNodeVersion(requiredVersion, '@01js/cli')

if (semver.satisfies(process.version, '9.x')) {
  console.log(chalk.red(
    `You are using Node ${process.version}.\n` +
    `Node.js 9.x has already reached end-of-life and will not be supported in future major releases.\n` +
    `It's strongly recommended to use an active LTS version instead.`
  ))
}

const fs = require('fs')
const path = require('path')
const slash = require('slash')
const minimist = require('minimist')

// enter debug mode when creating test repo

if (
  slash(process.cwd()).indexOf('/packages/test') > 0 && (
    fs.existsSync(path.resolve(process.cwd(), '../@01js')) ||
    fs.existsSync(path.resolve(process.cwd(), '../../@01js'))
  )
) {
  process.env.CLI_DEBUG = true
}

const program = require('commander')
const loadCommand = require('../lib/util/loadCommand')

program
  .version(`@01js/cli ${require('../package').version}`)
  .usage('<command> [options]')
  program
  .command('create <app-name>')
  .description('create a new project powered by 01js-cli-service')
  .action((name, cmd) => {

    const options = cleanArgs(cmd)

    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the app\'s name, the rest are ignored.'))
    }
    // --git makes commander to default git to true
    if (process.argv.includes('-g') || process.argv.includes('--git')) {
      options.forceGit = true
    }
    require('../lib/create')(name, options)
  })
  // add some useful info on help
program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`01js <command> --help`)} for detailed usage of given command.`)
  console.log()
})

program.parse(process.argv);


function camelize (str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs (cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}
