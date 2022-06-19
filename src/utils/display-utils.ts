import { Duration } from 'luxon';
import { Fund } from 'src/types/transaction';

export function getRelativeTime(timestamp: Date | number | string): string {
  const time = getTime(timestamp);
  if (!Number.isInteger(time)) {
    return 'Unknown';
  }
  const duration = Duration.fromMillis(new Date().getTime() - time, {
    locale: 'en-US',
  }).shiftTo('seconds');
  if (duration.seconds < 1) {
    return 'less than one second';
  } else if (duration.seconds < 60) {
    return duration.toHuman({ maximumFractionDigits: 0 });
  } else if (duration.seconds < 3600) {
    return duration.shiftTo('minutes').toHuman({ maximumFractionDigits: 0 });
  } else if (duration.seconds < 86400) {
    return duration.shiftTo('hours').toHuman({ maximumFractionDigits: 0 });
  } else {
    return duration.shiftTo('days').toHuman({ maximumFractionDigits: 0 });
  }
}

function getTime(timestamp: Date | number | string): number {
  if (timestamp instanceof Date) {
    return timestamp.getTime();
  }
  if (typeof timestamp === 'string') {
    return new Date(timestamp).getTime();
  }
  return timestamp;
}

export function displayLongString(val: string, maxLength = 12): string {
  if (!val) {
    return '';
  }
  if (val.length > maxLength) {
    const partSize = (maxLength - 5) / 2;
    const remainder = (maxLength - 5) % 2;
    const firstPartSize = partSize + remainder;
    return (
      val.substring(0, firstPartSize) +
      '&nbsp;&hellip; ' +
      val.substring(val.length + 1 - partSize, val.length)
    );
  } else {
    return val;
  }
}

export function displayFirstPartLongString(
  val: string,
  maxLength = 12
): string {
  if (!val) {
    return '';
  }
  if (val.length > maxLength) {
    const partSize = (maxLength - 1) / 2;
    const remainder = (maxLength - 1) % 2;
    const firstPartSize = partSize + remainder;
    return val.substring(0, firstPartSize);
  } else {
    return val;
  }
}

export function displaySecondPartLongString(
  val: string,
  maxLength = 12
): string {
  if (!val) {
    return '';
  }
  if (val.length > maxLength) {
    const partSize = (maxLength - 1) / 2;
    return val.substring(val.length + 1 - partSize, val.length);
  } else {
    return val;
  }
}

export function getStringOrFirstElement(
  param: string | number | string[]
): string {
  if (param instanceof Array) {
    return param[0];
  }
  return param.toString();
}

export function camelCaseToRegular(val: string) {
  return (
    val
      .replace(/([A-Z])/g, ' $1')
      // uppercase the first character
      .replace(/^./, function (str) {
        return str.toUpperCase();
      })
  );
}

export function getDisplayAddress(funds: Fund[]): string {
  if (!funds || funds.length === 0) {
    return '';
  }
  if (funds.length > 1) {
    return funds[0].address + ` (+ ${funds.length - 1} more)`;
  }
  return funds[0].address;
}

function padTo2Digits(num: number): string {
  return num.toString().padStart(2, '0');
}

export function formatDate(date: Date): string {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
  );
}
