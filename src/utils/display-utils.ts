import { Duration } from 'luxon';
import { Fund } from 'src/types/transaction';

export function getRelativeTime(timestamp: Date | number | string): string {
  const time = getTime(timestamp)
  if (!Number.isInteger(time)) {
    return 'Unknown';
  }
  const duration = Duration.fromMillis(new Date().getTime() - time).shiftTo('seconds');
  if (duration.seconds < 1) {
    return 'less than one second'
  } else if (duration.seconds < 60) {
    return duration.toHuman({ maximumFractionDigits: 0 });
  } else if (duration.seconds < 3600) {
    return duration.shiftTo('minutes').toHuman({ maximumFractionDigits: 0 })
  } else if (duration.seconds < 86400) {
    return duration.shiftTo('hours').toHuman({ maximumFractionDigits: 0 })
  } else {
    return duration.shiftTo('days').toHuman({ maximumFractionDigits: 0 })
  }
}

function getTime(timestamp: Date | number | string): number {
  if(timestamp instanceof Date) {
    return timestamp.getTime();
  }
  if(typeof(timestamp) === 'string') {
    return new Date(timestamp).getTime();
  }
  return timestamp;
}

export function displayLongString(val: string, maxLength = 12): string {
  if (!val) {
    return '';
  }
  return val.substring(0, maxLength) + '...';
}

export function getStringOrFirstElement(param: string | string[]) {
  if (param instanceof Array) {
    return param[0];
  }
  return param;
}

export function camelCaseToRegular(val: string) {
  return val.replace(/([A-Z])/g, ' $1')
  // uppercase the first character
  .replace(/^./, function(str){ return str.toUpperCase(); })
}


export function getDisplayAddress(funds: Fund[]): string {
  if (!funds || funds.length === 0) {
    return '';
  }
  if (funds.length > 1) {
    return funds[0].address + ` (+ ${funds.length - 1} more)`
  }
  return funds[0].address;

}
