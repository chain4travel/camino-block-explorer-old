import { computed } from 'vue';
export function useModelWrapper(
  props,
  emit: (name: string, arg: object[]) => void,
  name: string
) {
  return computed({
    get: () => props[name],
    set: (value) => emit(`update:${name}`, value),
  });
}
