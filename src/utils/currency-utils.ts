import { Amount } from 'src/types/amount'

const conversionACamPerCam = 1000000000000000000;

const conversionACamPerNCam = 1000000000;

export const ACAM_CAM_CONVERSION_THRESHHOLD = 100000000000000;

export const ACAM_NCAM_CONVERSION_THRESHHOLD = 1000000;

export function aCamToCam(aCam: number) {
  return aCam / conversionACamPerCam;
}

export function aCamToNCam(aCam: number) {
  return aCam / conversionACamPerNCam;
}

export function getDisplayValueForGewi(nCamVal: number): string {
  return getDisplayValue(nCamVal * conversionACamPerNCam);
}

export function getDisplayValue(aCam: number): string {
  const amount = getDisplayAmount(aCam);
  return formatAmount(amount.value, amount.currency);
}

export function getDisplayAmount(aCam: number): Amount {
  if (aCam === 0) {
    return {
       value: 0,
       currency: 'CAM'
    }
  }
  if (aCam >= ACAM_CAM_CONVERSION_THRESHHOLD) {
    return {
      value: aCamToCam(aCam),
      currency: 'CAM'
    }
  }
  if (aCam >= ACAM_NCAM_CONVERSION_THRESHHOLD) {
    return {
      value: aCamToNCam(aCam),
      currency: 'nCAM'
    }
  }
  return {
    value: aCam,
    currency: 'aCAM'
  }
}

export function formatAmount(value: number, currency: string): string {
  return `${value.toLocaleString()} ${currency}`;
}

export const currencyFields = [
  'baseFeePerGas', 'gasLimit', 'gasUsed', 'cumulativeGasUsed', 'gasUsed', 'effectiveGasPrice', 'value', 'gasPrice', 'gas'
]
