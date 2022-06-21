import { DateTime } from 'luxon';
import { Timeframe, getLabel } from 'src/types/chain-loader';

export function getStartDate(
  endDate: DateTime,
  timeframe: Timeframe
): DateTime {
  switch (timeframe) {
    case Timeframe.DAYS_7:
      return endDate.minus({ weeks: 1 });
    case Timeframe.HOURS_24:
      return endDate.minus({ days: 1 });
    case Timeframe.MONTHS_1:
      return endDate.minus({ months: 1 });
  }
}

export const timeOptions = [
  { value: Timeframe.HOURS_24, label: getLabel(Timeframe.HOURS_24) },
  { value: Timeframe.DAYS_7, label: getLabel(Timeframe.DAYS_7) },
  { value: Timeframe.MONTHS_1, label: getLabel(Timeframe.MONTHS_1) },
];
