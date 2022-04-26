import { computed } from 'vue'
export function useModelWrapper(props: any, emit: (name: string, arg: object[]) => void, name: string) {
  return computed({
    get: () => props[name],
    set: (value) => emit(`update:${name}`, value)
  })
}
