import 'vue-router'

// To ensure it is treated as a module, add at least one `export` statement
export {}

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean
    menuItem?: 'GeneralInfo' | 'BonusShop' | 'Rating' | 'Stats'
    redirected?: boolean
    transition?: string
  }
}
