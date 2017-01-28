(function () {
  'use strict'

  /* eslint-disable no-new */
  new Vue({
    el: '#rightMenu',
    data: {
      comment: '',
      errors: {}
    },
    methods: {
      submit: function (event) {
        this.errors = {}

        axios.post(`${window.location.pathname}/tickets`, {
          comment: this.comment
        })
        .then((response) => {
          window.location.reload()
        })
        .catch((error) => {
          if (error.response) {
            this.errors = error.response.data.errors
          } else {
            this.errors.message = error.message
          }
        })
      }
    }
  })
})()
