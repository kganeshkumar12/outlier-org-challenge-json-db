const fs = require('fs')
const _ = require('lodash')

const helper = require('./helper')

module.exports = {
  getHealth,
  putStudent,
  getStudent,
  deleteStudent
}

async function getHealth (req, res, next) {
  res.json({ success: true })
}

const studentDirpath = 'data'
const studentFileformat = '.json'

function putStudent (req, res) {
  helper.confirmDir(studentDirpath, function () {
    fs.readFile(studentDirpath + '/' + req.params.studentId + studentFileformat, function (err, filedata) {
      const studentData = err ? {} : JSON.parse(filedata)
      const propertyArr = req.params.property.split('/')
      _.set(studentData, propertyArr, _.merge(_.get(studentData, propertyArr), req.body))
      fs.writeFile(studentDirpath + '/' + req.params.studentId + studentFileformat, JSON.stringify(studentData), function (err) {
        if (err) {
          res.json({ error: 'unable to update' })
        } else {
          // detailed response for debugging
          res.json({
            studentId: req.params.studentId,
            propertyPath: propertyArr,
            propertyValue: req.body,
            studentData: studentData
          })
          // simple response
          // res.json({ success: 'updated' })
        }
      })
    })
  })
}

function getStudent (req, res) {
  fs.readFile(studentDirpath + '/' + req.params.studentId + studentFileformat, function (err, filedata) {
    if (err) {
      res.status(404)
    } else {
      const studentData = JSON.parse(filedata)
      const propertyArr = req.params.property.split('/')
      const propertyValue = _.get(studentData, propertyArr)
      // detailed response for debugging
      res.json({
        studentId: req.params.studentId,
        propertyPath: propertyArr,
        propertyValue: propertyValue,
        studentData: studentData
      })
      // simple response
      // res.json(propertyValue)
    }
  })
}

function deleteStudent (req, res) {
  fs.readFile(studentDirpath + '/' + req.params.studentId + studentFileformat, function (err, filedata) {
    if (err) {
      res.status(404)
    } else {
      const studentData = JSON.parse(filedata)
      const propertyArr = req.params.property.split('/')
      _.unset(studentData, propertyArr)
      fs.writeFile(studentDirpath + '/' + req.params.studentId + studentFileformat, JSON.stringify(studentData), function (err) {
        if (err) {
          res.json({ error: 'unable to delete' })
        } else {
          // detailed response for debugging
          res.json({
            studentId: req.params.studentId,
            propertyPath: propertyArr,
            studentData: studentData
          })
          // simple response
          // res.json({ success: 'deleted' })
        }
      })
    }
  })
}
