const notFoundHandler = (req, res, next) => {
  if (res.locals.data === undefined) {
    const error = new Error('Resource not found')
    error.statusCode = 404
    error.context = `${req.method} ${req.originalUrl}`
    error.details = {
      path: req.originalUrl,
      errorCode: 404,
      timestamp: new Date().toISOString()
    }
    next(error)
  } else {
    next()
  }
}

export default notFoundHandler



// const notFoundHandler = (req, res, next) => {
//   if (res.locals.data === undefined) {
//     const error = new Error('not found')
//     error.statusCode = 500
//     error.context = 'GET /not-found' + req.originalUrl,
//     next(error)
//   }
//   next()

// }

