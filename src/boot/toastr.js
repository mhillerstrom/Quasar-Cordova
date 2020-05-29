
export default ({ app, router, Vue }) => {
  const toastr = {
    __toastr: function (txt, color, icon) {
      var mes = Object.assign(
        {},
        {
          message: txt,
          position: 'top-right',
          multiline: true,
          timeout: 2000
        },
        color ? { color: color } : {},
        icon ? { icon: icon } : {}
      )
      const vue = new Vue()
      vue.$q.notify(mes)
    },
    success: function (txt) {
      this.__toastr(txt, 'green', 'fas fa-check')
    },
    error: function (txt) {
      this.__toastr(txt, 'red', 'fa fa-times-circle')
    },
    danger: function (txt) {
      this.error(txt)
    },
    warning: function (txt) {
      this.__toastr(txt, 'orange', 'fas fa-exclamation')
    },
    info: function (txt) {
      this.__toastr(txt, null, 'information')
    },
    log: function (txt) {
      this.__toastr(txt, 'yellow')
    },
    debug: function (txt) {
      this.__toastr(txt, 'grey')
    }
  }

  if (typeof window !== 'undefined') { window.toastr = toastr } else { global.toastr = toastr }
}
