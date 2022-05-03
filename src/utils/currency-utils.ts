
const conversionWeiPerCam = 1000000000000000000;

const conversionWeiPerGwei = 1000000000;

export const WEI_CAM_CONVERSION_THRESHHOLD = 100000000000000;

export const WEI_GWEI_CONVERSION_THRESHHOLD = 1000000;

export function weiToCam(weiVal: number) {
  return weiVal / conversionWeiPerCam;
}

export function weiToGwei(weiVal: number) {
  return weiVal / conversionWeiPerGwei;
}

export function getDisplayValueForGewi(GweiVal: number): string {
  return getDisplayValue(GweiVal * conversionWeiPerGwei);
}

export function getDisplayValue(weiVal: number): string {
  if (weiVal === 0) {
    return formatAmount(0, 'CAM')
  }
  if (weiVal >= WEI_CAM_CONVERSION_THRESHHOLD) {
    return formatAmount(weiToCam(weiVal), 'CAM');
  }
  if (weiVal >= WEI_GWEI_CONVERSION_THRESHHOLD) {
    return formatAmount(weiToGwei(weiVal), 'GWEI');
  }
  return formatAmount(weiVal, 'WEI');
}

export function formatAmount(value: number, currency: string): string {
  return `${value.toLocaleString('en-US')} ${currency}`;
}

export const currencyFields = [
  'baseFeePerGas', 'gasLimit', 'gasUsed', 'cumulativeGasUsed', 'gasUsed', 'effectiveGasPrice', 'value', 'gasPrice', 'gas'
]
