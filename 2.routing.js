const http = require('node:http')
const dittoJSON = require('./pokemon/ditto.json')

const processRequest = (req, res) => {
  const { method, url } = req
  switch (method) {
    case 'GET':
      switch (url) {
        case '/pokemon/ditto':
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          return res.end(JSON.stringify(dittoJSON))
        default:
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end('<h1>Error 404 No encontrado</h1>')
          break
      }
    // eslint-disable-next-line no-fallthrough
    case 'POST':
      switch (url) {
        case '/pokemon': {
          let body = ''
          // Escuchar el evento
          req.on('data', chunk => {
            body += chunk.toString()
          })
          req.on('end', () => {
            const data = JSON.parse(body)
            res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' })
            data.timestamp = Date.now()
            res.end(JSON.stringify(data))
          })
          break
        }
        default:
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end('Error 404 No encontrado')
          break
      }
  }
}

const server = http.createServer(processRequest)

server.listen(1234, () => {
  console.log('Servidor escuchando en el puerto http://localhost: 1234')
})
