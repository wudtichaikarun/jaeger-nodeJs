export interface ILogger {
  info(msg: any): void;
  error(msg: any): void;
  warn(msg: any): void;
  debug(msg: any): void;
  trace(msg: any): void;
}

export const logger = {
  info: function info(msg: any) {
    console.log('INFO : ', JSON.stringify(msg))
  },
  error: function error(msg: any) {
    console.log('ERROR : ', JSON.stringify(msg))
  },
  warn: function warn(msg: any) {
    console.warn('WARN : ', JSON.stringify(msg))
  },
  debug: function debug(msg: any) {
    console.log('DEBUG : ', JSON.stringify(msg))
  },
  trace: function trace(msg: any) {
    console.log('TRACE : ', JSON.stringify(msg))
  },
}
