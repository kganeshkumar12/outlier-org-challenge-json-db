const tape = require('tape')
const jsonist = require('jsonist')
const fs = require('fs')

// const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const port = (process.env.PORT = process.env.PORT || 1337)
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
const studentProperty = 'courses/calculus/quizzes/ye0ab61'
const studentPropertyValue = { score: 100 }

const studentUrlValid = `${endpoint}/${studentId}/${studentProperty}`
const studentUrlValidCompleteData = `${endpoint}/${studentId}/`
const studentUrlBadRequest = `${endpoint}/${studentId}/${studentProperty}/`
const studentUrlInvalidStudentId = `${endpoint}/invalid-id`
const studentUrlInvalidProperty = `${endpoint}/${studentId}/invalid-property`

tape('putStudent - Valid Params', async function (t) {
  jsonist.put(studentUrlValid, studentPropertyValue, function (err, body, res) {
    if (err) {
      t.error(err)
    } else {
      t.ok(body, 'property updation is successful')
      t.end()
    }
  })
})

tape('putStudent - Bad Request', async function (t) {
  jsonist.put(studentUrlBadRequest, studentPropertyValue, function (err, body, res) {
    if (err) {
      t.error(err)
    } else {
      t.equal(res.statusCode, 400, '400 received for property containing trailing slash (/)')
      t.end()
    }
  })
})

tape('getStudent - Valid Params', async function (t) {
  jsonist.get(studentUrlValid, function (err, body, res) {
    if (err) {
      t.error(err)
    } else {
      t.ok(body, 'property retrieval is successful')
      t.end()
    }
  })
})

tape('getStudent - Valid Params - Complete Data', async function (t) {
  jsonist.get(studentUrlValidCompleteData, function (err, body, res) {
    if (err) {
      t.error(err)
    } else {
      t.ok(body, 'complete data retrieval is successful')
      t.end()
    }
  })
})

tape('getStudent - Bad Request', async function (t) {
  jsonist.get(studentUrlBadRequest, function (err, body, res) {
    if (err) {
      t.error(err)
    } else {
      t.equal(res.statusCode, 400, '400 received for property containing trailing slash (/)')
      t.end()
    }
  })
})

tape('getStudent - Invalid studentId', async function (t) {
  jsonist.get(studentUrlInvalidStudentId, function (err, body, res) {
    if (err) {
      t.error(err)
    } else {
      t.equal(res.statusCode, 404, '404 received for invalid studentId')
      t.end()
    }
  })
})

tape('getStudent - Invalid property', async function (t) {
  jsonist.get(studentUrlInvalidProperty, function (err, body, res) {
    if (err) {
      t.error(err)
    } else {
      t.equal(res.statusCode, 404, '404 received for invalid property')
      t.end()
    }
  })
})

tape('deleteStudent - Valid Params', async function (t) {
  jsonist.delete(studentUrlValid, function (err, body, res) {
    if (err) {
      t.error(err)
    } else {
      t.ok(body, 'property deletion is successful')
      t.end()
    }
  })
})

tape('deleteStudent - Bad Request', async function (t) {
  jsonist.delete(studentUrlBadRequest, function (err, body, res) {
    if (err) {
      t.error(err)
    } else {
      t.equal(res.statusCode, 400, '400 received for property containing trailing slash (/)')
      t.end()
    }
  })
})

tape('deleteStudent - Invalid studentId', async function (t) {
  jsonist.delete(studentUrlInvalidStudentId, function (err, body, res) {
    if (err) {
      t.error(err)
    } else {
      t.equal(res.statusCode, 404, '404 received for invalid studentId')
      t.end()
    }
  })
})

tape('deleteStudent - Invalid property', async function (t) {
  jsonist.delete(studentUrlInvalidProperty, function (err, body, res) {
    if (err) {
      t.error(err)
    } else {
      t.equal(res.statusCode, 404, '404 received for invalid property')
      t.end()
    }
  })
})

tape('cleanup', function (t) {
  fs.unlinkSync(`${studentDirpath}/${studentId}${studentFileformat}`)
  t.ok(true, 'student file deletion is successful')
  t.end()
  server.close()
})
