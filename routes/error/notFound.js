class NotFoundError extends Error {
  constructor (...args) {
    super(...args)
    Error.captureStackTrace(this, NotFoundError)
    this.status = 404
  }
}

module.exports = NotFoundError
