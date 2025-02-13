import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    'dist',
    'public',
  ],
  rules: {
    'unused-imports/no-unused-vars': 'off',
  },
})
