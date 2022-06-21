import { Amount } from 'src/types/amount';

const conversionACamPerCam = 1000000000000000000;

const conversionACamPerNCam = 1000000000;

export const ACAM_CAM_CONVERSION_THRESHHOLD = 1000000000000000;

export const ACAM_NCAM_CONVERSION_THRESHHOLD = 1000000;

export function aCamToCam(aCam: number) {
  return aCam / conversionACamPerCam;
}

export function aCamToNCam(aCam: number) {
  return aCam / conversionACamPerNCam;
}

export function nCamToACam(nCam: number) {
  return nCam * conversionACamPerNCam;
}

export function getDisplayValueForGewi(nCamVal: number): string {
  return getDisplayValue(nCamVal * conversionACamPerNCam);
}

export function getDisplayValue(aCam: number): string {
  const amount = getDisplayAmount(aCam);
  return formatAmount(amount.value, amount.currency);
}

export function getACamAmount(value: number, currency: string): number {
  if (currency.toLowerCase() === 'cam') {
    return value * conversionACamPerCam;
  } else if (currency.toLowerCase() === 'ncam') {
    return value * conversionACamPerNCam;
  } else {
    return value;
  }
}

export function getDisplayAmount(aCam: number): Amount {
  if (aCam === 0 || aCam >= ACAM_CAM_CONVERSION_THRESHHOLD) {
    return {
      value: aCamToCam(aCam),
      currency: 'CAM',
      currencyIcon: 'img:/images/camino-coin-logo.png',
    };
  }
  if (aCam >= ACAM_NCAM_CONVERSION_THRESHHOLD) {
    return {
      value: aCamToNCam(aCam),
      currency: 'nCAM',
      currencyIcon: 'img:/images/camino-ncam-coin-logo.png',
    };
  }
  return {
    value: aCam,
    currency: 'aCAM',
    currencyIcon: 'img:/images/camino-acam-coin-logo.png',
  };
}

export function formatAmount(value: number, currency: string): string {
  return `${value.toLocaleString()} ${currency}`;
}

export const currencyFields = [
  'baseFeePerGas',
  'gasLimit',
  'gasUsed',
  'cumulativeGasUsed',
  'gasUsed',
  'effectiveGasPrice',
  'value',
  'gasPrice',
  'gas',
];
