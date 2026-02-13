export const tw = {
  background: {
    primary: 'bg-slate-50 dark:bg-slate-950',
    secondary: 'bg-white dark:bg-slate-900',
    tertiary: 'bg-slate-100 dark:bg-slate-800',
    hover: 'bg-slate-200 dark:bg-slate-700',
    code: 'bg-slate-50 dark:bg-slate-800/50',
  },

  text: {
    primary: 'text-slate-900 dark:text-slate-100',
    secondary: 'text-slate-700 dark:text-slate-300',
    tertiary: 'text-slate-600 dark:text-slate-400',
    quaternary: 'text-slate-500 dark:text-slate-400',
    placeholder: 'placeholder:text-slate-400 dark:placeholder:text-slate-500',
    white: 'text-white',
  },

  border: {
    primary: 'border-slate-300 dark:border-slate-700',
    secondary: 'border-slate-200 dark:border-slate-700',
    hover: 'border-slate-400 dark:border-slate-600',
    focus: 'border-slate-400 dark:border-slate-500',
  },

  button: {
    primary: {
      base: 'bg-slate-700 dark:bg-slate-600',
      hover: 'hover:bg-slate-800 dark:hover:bg-slate-700',
      disabled: 'disabled:bg-slate-300 dark:disabled:bg-slate-700',
    },
    secondary: {
      base: 'bg-slate-100 dark:bg-slate-800',
      hover: 'hover:bg-slate-200 dark:hover:bg-slate-700',
      border: 'border-slate-200 dark:border-slate-700',
      borderHover: 'hover:border-slate-300 dark:hover:border-slate-600',
    },
    active: {
      base: 'bg-slate-200 dark:bg-slate-700',
      border: 'border-slate-300 dark:border-slate-600',
      text: 'text-slate-800 dark:text-slate-200',
    },
  },

  input: {
    base: 'bg-white dark:bg-slate-900',
    border: 'border-slate-300 dark:border-slate-700',
    borderHover: 'hover:border-slate-400 dark:hover:border-slate-600',
    text: 'text-slate-900 dark:text-slate-100',
    focusRing: 'focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500',
  },

  separator: 'bg-slate-200 dark:bg-slate-800',

  scrollbar: {
    thumb: 'bg-slate-300 dark:bg-slate-700',
    thumbHover: 'hover:bg-slate-400 dark:hover:bg-slate-600',
  },

  error: {
    background:
      'from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20',
    border: 'border-red-200 dark:border-red-800/50',
    icon: {
      background: 'bg-red-100 dark:bg-red-900/30',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-600 dark:text-red-400',
    },
    text: {
      title: 'text-red-900 dark:text-red-300',
      content: 'text-red-800 dark:text-red-400',
    },
  },

  serverBadge: {
    background: 'bg-slate-100 dark:bg-slate-800',
    border: 'border-slate-200 dark:border-slate-700',
    text: 'text-slate-600 dark:text-slate-400',
  },
}
