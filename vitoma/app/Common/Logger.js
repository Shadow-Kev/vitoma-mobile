/** @format */

'use strict'

import Sentry from 'sentry-expo'
import Config from './Config'

export default class Logger {
  constructor() {
    if(Config.crashReport.enable) {
      Sentry.enableInExpoDevelopment = Config.crashReport.enableInExpoDevelopment;
      Sentry.config(Config.crashReport.sentryCode).install();
    }
  }
  
  static log(data, isError = true) {
    if(isError)
      Sentry.captureException(data);
    else
      Sentry.captureMessage(data);
  }
}
