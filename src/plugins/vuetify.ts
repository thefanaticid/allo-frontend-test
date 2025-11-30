/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// Space-inspired dark theme
const spaceTheme = {
  dark: true,
  colors: {
    background: '#0a0e17',
    surface: '#111827',
    'surface-bright': '#1a2332',
    'surface-light': '#1e293b',
    'surface-variant': '#0f172a',
    'on-surface-variant': '#94a3b8',
    primary: '#6366f1',
    'primary-darken-1': '#4f46e5',
    secondary: '#8b5cf6',
    'secondary-darken-1': '#7c3aed',
    accent: '#06b6d4',
    error: '#ef4444',
    info: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    'on-background': '#f1f5f9',
    'on-surface': '#e2e8f0',
    'on-primary': '#ffffff',
    'on-secondary': '#ffffff',
  },
  variables: {
    'border-color': '#1e293b',
    'border-opacity': 0.12,
    'high-emphasis-opacity': 0.95,
    'medium-emphasis-opacity': 0.7,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.06,
    'hover-opacity': 0.08,
    'focus-opacity': 0.12,
    'selected-opacity': 0.12,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.16,
    'dragged-opacity': 0.08,
    'theme-kbd': '#1e293b',
    'theme-on-kbd': '#e2e8f0',
    'theme-code': '#1e293b',
    'theme-on-code': '#e2e8f0',
  },
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'spaceTheme',
    themes: {
      spaceTheme,
    },
  },
  defaults: {
    VCard: {
      elevation: 0,
      rounded: 'lg',
    },
    VBtn: {
      rounded: 'lg',
      fontWeight: 600,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg',
    },
    VChip: {
      rounded: 'lg',
    },
  },
})
