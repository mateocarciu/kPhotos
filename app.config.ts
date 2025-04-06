export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue'
    },
    button: {
      defaultVariants: {
        size: 'lg'
      }
    },
    select: {
      defaultVariants: {
        size: 'lg'
      }
    },
    input: {
      slots: {
        root: 'w-full'
      },
      defaultVariants: {
        size: 'lg'
      }
    },
    textarea: {
      defaultVariants: {
        size: 'lg'
      }
    }
  }
})
