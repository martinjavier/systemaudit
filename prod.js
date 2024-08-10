const express = require('express')
const app = express()
const { exec } = require('child_process')

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
        button {
          background-color: #4CAF50; /* Color de fondo */
          border: none; /* Sin borde */
          color: white; /* Color del texto */
          padding: 15px 32px; /* Relleno interno */
          text-align: center; /* Alineación del texto */
          text-decoration: none; /* Sin subrayado */
          display: inline-block; /* Mostrar como bloque en línea */
          font-size: 26px; /* Tamaño de la fuente */
          margin: 4px 2px; /* Margen externo */
          cursor: pointer; /* Cursor al pasar por encima */
          border-radius: 8px; /* Bordes redondeados */
        }
        /* Estilo al pasar el mouse por encima */
        button:hover {
          background-color: #45a049;
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
        .menu {
            text-align: center;
            padding: 20px;
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
  <div class="menu">
    <button onclick="location.href='/temperatura'" type="button">Temperaturas</button><br/>
    <button onclick="location.href='/particiones'" type="button">Particiones</button><br/>
    <button onclick="location.href='/discos'" type="button">Discos</button><br/>
    <button onclick="location.href='/procesos'" type="button">Procesos</button><br/>
    <button onclick="location.href='/machine'" type="button">Equipo</button><br/>
    <button onclick="location.href='/swapinfo'" type="button">Swap Info</button><br/>
    <button onclick="location.href='/clima'" type="button">Meteorología</button><br/>
    <button onclick="location.href='/basicinfo'" type="button">Información</button><br/>
  </div>
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

    const sensorsString = sensors.join('<br/>')
    const drivesString = drives.join('<br/>')

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
    <p>${sensorsString}</p>
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

app.get('/procesos', (req, res) => {
  exec('inxi -t', (error, stdout, stderr) => {
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
        <title>Procesos en Ejecución</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
          h1 { color: #333; }
          a { display: inline-block; margin-top: 20px; padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Procesos</h1>
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
  exec('inxi -p', (error, stdout, stderr) => {
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

app.get('/clima', (req, res) => {
  exec('inxi -w', (error, stdout, stderr) => {
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
    //  .filter(line => line.trim() !== '') // Elimina líneas vacías

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
        <title>Información Climática</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
          h1 { color: #333; }
          a { display: inline-block; margin-top: 20px; padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Estado del Clima</h1>
        ${formattedOutput}
        <a href="javascript:history.back()">VOLVER</a>
      </body>
      </html>
      `)
  })
})

// Para una petición desconocida
app.use((req, res) => {
  res.status(404).send('<h1>Error 404</h1>')
})

app.listen(21900, () => {
  console.log('Server running on http://localhost:21900')
})
