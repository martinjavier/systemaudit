const express = require('express')
const app = express()
const { exec } = require('child_process')
const PORT = process.env.PORT ?? 1234
const dittoJSON = require('./pokemon/ditto.json')

app.disable('x-powered-by')

app.get('/', (req, res) => {
  exec('inxi -Fxz | grep temp', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error de ejecución: ${error}`)
      return
    }
    if (stderr) {
      console.error(`Error de stderr: ${stderr}`)
      return
    }
    // Limpiamos la salida
    const cleanOutput = stdout
      .replace(/\u0003\d*/g, '') // Elimina códigos de color ANSI
      .replace(/^\s+|\s+$/gm, '') // Elimina espacios en blanco al inicio y final de cada línea
      .split('\n') // Divide en líneas
      .filter(line => line.trim() !== '') // Elimina líneas vacías

    // Formateamos la salida
    const formattedOutput = cleanOutput.map(line => {
      const parts = line.split(':').map(part => part.trim())
      return `<p><strong>${parts[0]}:</strong> ${parts.slice(1).join(':')}</p>`
    }).join('')
    res.send(`<b>Contenido: ${formattedOutput}</b>`)
  })
})

app.get('/pokemon/ditto', (req, res) => {
  res.json(dittoJSON)
})

app.post('/pokemon', (req, res) => {
  let body = ''
  // Escuchar el evento data
  req.on('data', chunk => {
    body += chunk.toString()
  })
  req.on('end', () => {
    const data = JSON.parse(body)
    data.timestamp = Date.now()
    res.status(201).json(data)
  })
})

// Para una petición desconocida
app.use((req, res) => {
  res.status(404).send('<h1>Error 404</h1>')
})

app.listen(PORT, () => {
  console.log('Servidor escuchando en el puerto http://localhost:1234')
})
