const fs = require('fs')

module.exports = {
  confirmDir,
  readStudentFile,
  writeStudentFile
}

const studentDirpath = 'data'
const studentFileformat = '.json'

function confirmDir (next) {
  if (fs.existsSync(studentDirpath)) {
    next()
  } else {
    fs.mkdir(studentDirpath, () => next())
  }
}

function readStudentFile (studentId, next) {
  fs.readFile(`${studentDirpath}/${studentId}${studentFileformat}`, function (err, filedata) {
    err ? next(err, false) : next(false, JSON.parse(filedata))
  })
}

function writeStudentFile (studentId, studentData, next) {
  fs.writeFile(`${studentDirpath}/${studentId}${studentFileformat}`, JSON.stringify(studentData), function (err) {
    err ? next(err) : next(false)
  })
}
