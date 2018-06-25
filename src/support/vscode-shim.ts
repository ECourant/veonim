import fakeModule from '../support/fake-module'

type LogMissingModuleApi = (moduleName: string, apiPath: string) => void
  let logMissingModuleApiDuringDevelopment: LogMissingModuleApi = () => {}

if (process.env.VEONIM_DEV) {
  logMissingModuleApiDuringDevelopment = (moduleName, apiPath) => console.warn(`fake module ${moduleName} is missing an implementation for: ${apiPath}`)
}

const LanguageClient = class LanguageClient {
  protected name: string
  protected serverActivator: Function

  constructor (name: string, serverActivator: Function) {
    this.name = name
    this.serverActivator = serverActivator
  }

  start () {
    console.log('starting extension:', this.name)
    return this.serverActivator()
  }

  error (...data: any[]) {
    console.error(this.name, ...data)
  }
}

const commands = {
  registerCommand: (command: string, callback: (args: any[]) => any, thisArg?: any) => {
    console.log('pls register cmd:', command)
    // TODO: i'm guessing we just register this as a Veonim action?
    // we will need to pass this back to main thread to talk with neovim
    // if we are within the context of a web worker (right now this is YES)
    // action(command, callback)
    return () => console.log('this is a NYI Disposable that is supposed to unregister the command:', command)
  }
}

fakeModule('vscode', {
  commands,
}, logMissingModuleApiDuringDevelopment)

fakeModule('vscode-languageclient', {
  LanguageClient,
}, logMissingModuleApiDuringDevelopment)

