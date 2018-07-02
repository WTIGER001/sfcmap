import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonDialogService } from './dialogs/common-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment';

export const Levels = [
  'TRACE',
  'DEBUG',
  'INFO',
  'LOG',
  'WARN',
  'ERROR',
  'OFF'
];

export enum LoggerLevel {
  TRACE = 0, DEBUG, INFO, LOG, WARN, ERROR, OFF
}

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  private readonly lowestLevel: number
  private readonly _isIE: boolean;
  private readonly _logFunc: Function;
  private debug: Debugger

  constructor(private toast: ToastrService, private dialog: CommonDialogService, @Inject(PLATFORM_ID) private readonly platformId) {
    this.lowestLevel = Levels.findIndex(v => environment.logLevel == v)
    if (this.lowestLevel == -1) {
      this.lowestLevel = LoggerLevel.OFF
    }
    this.debug = this.newDebugger('Notify')
    this.debug.info("Started Notification Service -- Lowest level of logging is: " + Levels[this.lowestLevel] + " and the logged categories are: " + environment.logCategories)
  }

  success(message: any) {
    this.toast.success(message)
    console.log(message);
  }

  showError(error: string, operation?: string, code?: number) {
    console.log("ERRORS: " + error);
    this.dialog.errorMsg(error)
  }

  isDebug(category?: string): boolean {
    return this.willLog(LoggerLevel.DEBUG, category)
  }

  willLog(logLevel: LoggerLevel, category?: string) {
    if (logLevel < this.lowestLevel) {
      return false
    }
    if (category && !environment.logCategories.includes(category)) {
      return false
    }
    return true
  }


  fmt(msg: string, ...args) {
    var formatted = msg;
    for (var i = 0; i < args.length; i++) {
      var regexp = new RegExp('\\{' + i + '\\}', 'gi');
      const arg = args[i]
      formatted = formatted.replace(regexp, arg);
    }
    return formatted;
  }

  getColor(level: LoggerLevel): 'blue' | 'teal' | 'gray' | 'red' | undefined {
    switch (level) {
      case LoggerLevel.TRACE:
        return 'blue';
      case LoggerLevel.DEBUG:
        return 'teal';
      case LoggerLevel.INFO:
      case LoggerLevel.LOG:
        return 'gray';
      case LoggerLevel.WARN:
      case LoggerLevel.ERROR:
        return 'red';
      case LoggerLevel.OFF:
      default:
        return;
    }
  }

  newDebugger(category?: string): Debugger {
    let debuggerObj = {}

    for (let level = 0; level < Levels.length - 1; level++) {
      let property = Levels[level].toLowerCase()
      let bind = this.willLog(level, category)
    }
    var __no_op = function () { };
    for (let level = 0; level < Levels.length - 1; level++) {
      let property = Levels[level].toLowerCase()
      const color = this.getColor(level);

      if (this.willLog(level, category)) {
        if (category) {
          debuggerObj[property] = console[property].bind(window.console, "%c" + Levels[level] + ': ' + category + '>>> %s', `color:${color}`)
        } else {
          debuggerObj[property] = console[property].bind(window.console, "%c" + Levels[level] + ': %s', `color:${color}`)
        }
      } else {
        debuggerObj[property] = __no_op
      }
    }
    debuggerObj['fmt'] = this.fmt
    return <Debugger>debuggerObj
  };


}

export interface Debugger {
  error(msg: any, ...params: any[])
  warn(msg: any, ...params: any[])
  trace(msg: any, ...params: any[])
  debug(msg: any, ...params: any[])
  info(msg: any, ...params: any[])
  log(msg: any, ...params: any[])
  fmt(msg: string, ...args): string
}
