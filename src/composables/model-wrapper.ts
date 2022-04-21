import { computed } from 'vue'
export function useModelWrapper(props: any, emit: (name: string, arg: object[]) => void, name: string) {
  console.log(props);
  console.log(props[name])
  return computed({
    get: () => props[name],
    set: (value) => emit(`update:${name}`, value)
  })
}
