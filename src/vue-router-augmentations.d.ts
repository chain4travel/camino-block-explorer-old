// Ensure this file is parsed as a module regardless of dependencies.
export { }

declare module 'vue-router' {
  interface RouteMeta {
    // is optional
    showInMenu?: boolean
    icon?: string
  }
}