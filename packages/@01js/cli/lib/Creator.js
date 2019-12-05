const EventEmitter = require('events')
const PromptModuleAPI = require('./PromptModuleAPI')
module.exports = class Creator extends EventEmitter {
  constructor (name, context, promptModules) {
    super()
    this.name = name
    const promptAPI = new PromptModuleAPI(this)
    promptModules.forEach(m => m(promptAPI))
  }
}
