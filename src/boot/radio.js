export default ({ app, router, Vue }) => {
  /**
   * Global pub/sub system for vue
   * @example ```
   *   radio.$on('eventName', value => {})
   *   radio.$emit('eventName', 5)
   * ```
   */
  const radio = new Vue()

  if (typeof window !== 'undefined') { window.radio = radio } else { global.radio = radio }
}
