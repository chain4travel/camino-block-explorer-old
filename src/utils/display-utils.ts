import { Duration } from 'luxon';

export function getRelativeTime(timestamp: Date | number): string {
  const time = timestamp instanceof Date ? timestamp.getTime() : timestamp
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

