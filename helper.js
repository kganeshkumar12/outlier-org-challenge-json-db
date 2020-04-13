const fs = require('fs')

module.exports = {
  confirmDir
}

function confirmDir (dirpath, next) {
  if (fs.existsSync(dirpath)) {
    next()
  } else {
    fs.mkdir(dirpath, function () {
      next()
    })
  }
}
