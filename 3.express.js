const express = require('express')
const app = express()
const dittoJSON = require('./pokemon/ditto.json')

app.disable('x-powered-by')

app.use(express.json())

/*
app.use((req, res, next) => {
  if (req.method !== 'POST') return next()
  if (req.headers['content-type'] !== 'application/json') return next()

  // Solo llegan los request que son POSY y que tienen el header application/json
  let body = ''

  // Escuchar el evento data
  req.on('data', chunk => {
    body += chunk.toString()
  })

  req.on('end', () => {
    const data = JSON.parse(body)
    data.timestamp = Date.now()
    // mutamos la request y meter la información en el req.body
    req.body = data
    next()
  })
})
*/

app.get('/pokemon/ditto', (req, res) => {
  res.json(dittoJSON)
})

app.post('/pokemon', (req, res) => {
  // req.body deberíamos guardar en BB.DD.
  res.status(201).json(req.body)
})

// Para una petición desconocida
app.use((req, res) => {
  res.status(404).send('<h1>Error 404</h1>')
})

app.listen(1234, () => {
  console.log('Server running on http://localhost:1234')
})
