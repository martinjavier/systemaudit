const express = require('express')
const app = express()
const { exec } = require('child_process')
const dittoJSON = require('./pokemon/ditto.json')

app.disable('x-powered-by')

app.get('/', (req, res) => {
  const cuerpo = `<HTML>
  <HEAD>
    <title>System Audit</title>
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <STYLE>
        body {
            font-family: Arial, sans-serif;
            font-size: 18px;
            background-color: #f0f0f0;
            margin: 0;
            padding: 20px;
        }
        .welcome {
            font-size: 32px;
            font-weight: bold;
            color: #2c1e20;
            text-align: center;
            padding: 20px;
            background-color: #aef0f1;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
        }
        a {
            font-size: 30px;
            line-height: 1.0;
            display: block;
            margin-bottom: 0px;
            color: #3498db;
            text-align: center;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        a:hover {
            color: #2910b9;
            font-size: 32px;
        }
    </STYLE></HEAD>  
  <BODY>
  <div class="welcome">System Audit version 0.5</div>
<a href="/temperatura">Temperaturas</a><br/>
<a href="/discos">Discos</a><br/>
<a href="/particiones">Particiones</a><br/>
<a href="/procesador">Procesador</a><br/>
<a href="/machine">Información del Equipo</a><br/>
<a href="/swapinfo">SWAP info</a><br/>
<a href="/basicinfo">Información General</a><br/>
</BODY></HTML>
`
  res.send(cuerpo)
})

app.get('/temperatura', (req, res) => {
  exec('inxi -Fxz', (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(`Error de ejecución: ${error}`)
    }
    if (stderr) {
      return res.status(500).send(`Error de stderr: ${stderr}`)
    }

    // Limpiamos la salida
    const cleanOutput = stdout
      .replace(/\u0003\d*/g, '') // Elimina códigos de color ANSI
      .replace(/^\s+|\s+$/gm, '') // Elimina espacios en blanco al inicio y final de cada línea
      .split('\n') // Divide en líneas
      .filter(line => line.trim() !== '') // Elimina líneas vacías

    const sensors = []
    const drives = []
    let currentSection = null

    cleanOutput.forEach((line) => {
      if (line === 'Sensors:') {
        currentSection = 'sensors'
        sensors.push(line)
      } else if (line === 'Drives:') {
        currentSection = 'drives'
        drives.push(line)
      } else if (currentSection === 'sensors' && line.trim() !== '') {
        sensors.push(line)
      } else if (currentSection === 'drives' && line.trim() !== '') {
        drives.push(line)
      } else if (line.trim() === '') {
        currentSection = null // Reseteamos la sección actual si encontramos una línea vacía
      }
    })

    const sensorsString = sensors.join('\n')
    const drivesString = drives.join('\n')

    res.send(`
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Información de Temperaturas</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
      h1 { color: #333; }
      a { display: inline-block; margin-top: 20px; padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
    </style>
  </head>
  <body>
    <h1>Temperaturas</h1>
    <h2>Sensores</h2>
    ${sensorsString}
    <h2>Drives</h2>
    ${drivesString}
    <br/>
    <a href="javascript:history.back()">VOLVER</a>
  </body>
  </html>
  `)
  })
})

app.get('/discos', (req, res) => {
  exec('inxi -D', (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(`Error de ejecución: ${error}`)
    }
    if (stderr) {
      return res.status(500).send(`Error de stderr: ${stderr}`)
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
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Información de Discos</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
          h1 { color: #333; }
          a { display: inline-block; margin-top: 20px; padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Información de Discos</h1>
        ${formattedOutput}
        <a href="javascript:history.back()">VOLVER</a>
      </body>
      </html>
      `)
  })
})

app.get('/procesador', (req, res) => {
  exec('inxi -C', (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(`Error de ejecución: ${error}`)
    }
    if (stderr) {
      return res.status(500).send(`Error de stderr: ${stderr}`)
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
    res.send(`      
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Información del Procesador</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
          h1 { color: #333; }
          a { display: inline-block; margin-top: 20px; padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Procesador</h1>
        ${formattedOutput}
        <a href="javascript:history.back()">VOLVER</a>
      </body>
      </html>
      `)
  })
})

app.get('/machine', (req, res) => {
  exec('inxi -M', (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(`Error de ejecución: ${error}`)
    }
    if (stderr) {
      return res.status(500).send(`Error de stderr: ${stderr}`)
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
    res.send(`
       <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Información sobre la computadora</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
          h1 { color: #333; }
          a { display: inline-block; margin-top: 20px; padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Información de la Computadora</h1>
        ${formattedOutput}
        <a href="javascript:history.back()">VOLVER</a>
      </body>
      </html>`)
  })
})

app.get('/particiones', (req, res) => {
  exec('inxi -P', (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(`Error de ejecución: ${error}`)
    }
    if (stderr) {
      return res.status(500).send(`Error de stderr: ${stderr}`)
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
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Información sobre las Particiones</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
          h1 { color: #333; }
          a { display: inline-block; margin-top: 20px; padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Particiones</h1>
        ${formattedOutput}
        <a href="javascript:history.back()">VOLVER</a>
      </body>
      </html>
      `)
  })
})

app.get('/swapinfo', (req, res) => {
  exec('inxi -j', (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(`Error de ejecución: ${error}`)
    }
    if (stderr) {
      return res.status(500).send(`Error de stderr: ${stderr}`)
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
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Información sobre la Memoria SWAP</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
          h1 { color: #333; }
          a { display: inline-block; margin-top: 20px; padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Memoria SWAP</h1>
        ${formattedOutput}
        <a href="javascript:history.back()">VOLVER</a>
      </body>
      </html>
      `)
  })
})

app.get('/basicinfo', (req, res) => {
  exec('inxi -b', (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(`Error de ejecución: ${error}`)
    }
    if (stderr) {
      return res.status(500).send(`Error de stderr: ${stderr}`)
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
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Información Básica</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
          h1 { color: #333; }
          a { display: inline-block; margin-top: 20px; padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Información Básica</h1>
        ${formattedOutput}
        <a href="javascript:history.back()">VOLVER</a>
      </body>
      </html>
      `)
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

app.listen(21900, () => {
  console.log('Server running on http://localhost:21900')
})
