const { STATUS_CODES } = require('http')

module.exports = {
  notFound,
  handleError,
  studentParamsValidator
}

function handleError (err, req, res, next) {
  if (res.headersSent) return next(err)

  if (!err.statusCode) console.error(err)
  const statusCode = err.statusCode || 500
  const errorMessage = STATUS_CODES[statusCode] || 'Internal Error'
  res.status(statusCode).json({ error: errorMessage })
}

function notFound (req, res) {
  res.status(404).json({ error: 'Not Found' })
}

function studentParamsValidator (req, res, next) {
  if (req.params.property.length < 1) {
    res.status(400).json({ error: 'property parameter is required' })
  } else if (req.params.property.slice(-1) === '/') {
    res.status(400).json({ error: 'property parameter should not contain a trailing slash (/)' })
  } else {
    next()
  }
}
