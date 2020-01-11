export default {
  methods: {
    $notifyOK (text) {
      const style = {
        visibility: 4000
      }
      this.$notify.success(text, style)
    },
    $notifyNOK (text) {
      const style = {
        closeButtonClass: 'delete',
        permanent: true
      }
      this.$notify.error(text, style)
    }
  }
}
