import { Notify } from 'quasar';

export async function copyToClipBoard(value: string) {
  await navigator.clipboard.writeText(value);
  Notify.create({
    message: 'Value copied to Clipboard',
    closeBtn: true,
    timeout: 500,
  });
}
