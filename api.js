const _ = require('lodash')

const student = require('./student')

module.exports = {
  getHealth,
  putStudent,
  getStudent,
  deleteStudent
}

async function getHealth (req, res, next) {
  res.json({ success: true })
}

function putStudent (req, res) {
  student.confirmDir(function () {
    student.readStudentFile(req.params.studentId, function (err, filedata) {
      const studentData = err ? {} : filedata
      const propertyArr = req.params.property.split('/')
      _.set(studentData, propertyArr, _.merge(_.get(studentData, propertyArr), req.body))
      student.writeStudentFile(req.params.studentId, studentData, function (err) {
        if (err) {
          res.status(500).json({ error: 'Unable to update property' })
        } else {
          // detailed response for debugging
          res.json({
            studentId: req.params.studentId,
            propertyPath: propertyArr,
            propertyValue: req.body,
            completeStudentData: studentData
          })
          // simple response
          // res.json({ success: 'updated' })
        }
      })
    })
  })
}

function getStudent (req, res) {
  student.readStudentFile(req.params.studentId, function (err, filedata) {
    if (err) {
      res.status(404).json({ error: 'Student not found' })
    } else {
      const studentData = filedata
      const propertyArr = req.params.property ? req.params.property.split('/') : null
      let propertyValue
      if (propertyArr) {
        propertyValue = _.has(studentData, propertyArr) ? _.get(studentData, propertyArr) : null
      } else {
        propertyValue = studentData
      }
      if (propertyValue) {
        // detailed response for debugging
        res.json({
          studentId: req.params.studentId,
          propertyPath: propertyArr,
          propertyValue: propertyValue,
          completeStudentData: studentData
        })
        // simple response
        // res.json(propertyValue)
      } else {
        res.status(404).json({ error: 'Property not found' })
      }
    }
  })
}

function deleteStudent (req, res) {
  student.readStudentFile(req.params.studentId, function (err, filedata) {
    if (err) {
      res.status(404).json({ error: 'Student not found' })
    } else {
      const studentData = filedata
      const propertyArr = req.params.property.split('/')
      if (_.has(studentData, propertyArr)) {
        _.unset(studentData, propertyArr)
        student.writeStudentFile(req.params.studentId, studentData, function (err) {
          if (err) {
            res.status(500).json({ error: 'Unable to delete property' })
          } else {
            // detailed response for debugging
            res.json({
              studentId: req.params.studentId,
              propertyPath: propertyArr,
              completeStudentData: studentData
            })
            // simple response
            // res.json({ success: 'deleted' })
          }
        })
      } else {
        res.status(404).json({ error: 'Property not found' })
      }
    }
  })
}
