
const conversionWeiPerCam = 1000000000000000000;

const conversionWeiPerGwei = 1000000000;

export const WEI_CAM_CONVERSION_THRESHHOLD = 100000000000000000;

export const WEI_GWEI_CONVERSION_THRESHHOLD = 100000000;

export function weiToCam(weiVal: number) {
  return weiVal / conversionWeiPerCam;
}

export function weiToGwei(weiVal: number) {
  return weiVal / conversionWeiPerGwei;
}

export function getDisplayValue(weiVal: number): string {
  if (weiVal >= WEI_CAM_CONVERSION_THRESHHOLD) {
    return weiToCam(weiVal) + ' CAM'
  }
  if (weiVal >= WEI_GWEI_CONVERSION_THRESHHOLD) {
    return weiToGwei(weiVal) + ' GWEI';
  }
  return weiVal + ' WEI'
}
