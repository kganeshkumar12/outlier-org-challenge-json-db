const tape = require('tape')
const jsonist = require('jsonist')
const fs = require('fs')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

tape('health', async function (t) {
  const url = `${endpoint}/health`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful healthcheck')
    t.end()
  })
})

const studentDirpath = 'data'
const studentFileformat = '.json'

const studentId = 'rachel'
const property = 'courses/calculus/quizzes/ye0ab61'
const propertyValue = { score: 100 }
const studentUrl = endpoint + '/' + studentId + '/' + property

tape('putStudent', async function (t) {
  jsonist.put(studentUrl, propertyValue, function (err, body) {
    if (err) {
      t.error(err)
    } else {
      t.ok(body, 'property updation is successful')
      t.end()
    }
  })
})

tape('getStudent', async function (t) {
  jsonist.get(studentUrl, function (err, body) {
    if (err) {
      t.error(err)
    } else {
      t.ok(body, 'property retrieval is successful')
      t.end()
    }
  })
})

tape('deleteStudent', async function (t) {
  jsonist.delete(studentUrl, function (err, body) {
    if (err) {
      t.error(err)
    } else {
      t.ok(body, 'property deletion is successful')
      t.end()
    }
  })
})

tape('cleanup', function (t) {
  fs.unlinkSync(studentDirpath + '/' + studentId + studentFileformat)
  t.ok(true, 'student file deletion is successful')
  t.end()
  server.close()
})
