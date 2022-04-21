import { Duration } from 'luxon';

export function getRelativeTime(timestamp: Date | number) {
    const time = timestamp instanceof Date ? timestamp.getTime() : timestamp
    console.log('date', timestamp)
    const duration = Duration.fromMillis(new Date().getTime() - time).shiftTo('seconds');
    console.log('duration', duration.toHuman())
    if (duration.seconds < 1) {
        return 'less than one second'
    } else if (duration.seconds < 60) {
        return duration.toHuman({ maximumFractionDigits: 0 });
    } else {
        return duration.shiftTo('minutes').toHuman({ maximumFractionDigits: 0 })
    }
}


export function displayLongString(val: string, maxLength = 12): string {
    return val.substring(0, maxLength) + '...';
}