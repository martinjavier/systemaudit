const express = require('express')
const app = express()
const { exec } = require('child_process')

app.disable('x-powered-by')

const sytle = `
      body {
        font-family: Arial, sans-serif;
        font-size: 18px;
        background-color: #ddddff;
        margin: 10;
        padding: 20px;
      }
      button {
        background-color: #4CAF50;
        border: none;
        color: white;
        padding-top: 25px;
        padding-right: 25px;
        padding-bottom: 25px;
        padding-left: 25px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 36px;
        margin: 20px 20px;
        cursor: pointer;
        border-radius: 8px;
        width: 400px;
      }
      button:hover {
        background-color: #45a049;
      }
      .welcome {
        font-size: 32px;
        font-weight: bold;
        color: #2c1e20;
        text-align: center;
        padding: 10px;
        background-color: #aef0f1;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 30px;
      }
      .menu {
        text-align: center;
        padding-top: 50px;
        padding-right: 30px;
        padding-bottom: 50px;
        padding-left: 80px;
        margin-bottom: 50px;
      }
      a { 
        float: left;
        margin-right: 10px;
        margin-top: 20px;
        padding: 10px 15px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 5px;
      }`

app.get('/', (req, res) => {
  const cuerpo = `<HTML>
  <HEAD>
    <meta charset="UTF-8">
    <title>System Audit</title>
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <style>
      ${sytle}
    </style>
  </HEAD>  
  <BODY>
    <div class="welcome">System Audit version 1.0.5</div>
    <div class="menu">
      <button onclick="location.href='/temperatura'" type="button">Temperaturas</button>
      <button onclick="location.href='/particiones'" type="button">Particiones</button>
      <button onclick="location.href='/discos'" type="button">Discos</button>
      <button onclick="location.href='/procesos'" type="button">Procesos</button>
      <button onclick="location.href='/machine'" type="button">Equipo</button>
      <button onclick="location.href='/swapinfo'" type="button">Swap Info</button>
      <button onclick="location.href='/clima'" type="button">Meteorología</button>
      <button onclick="location.href='/basicinfo'" type="button">Información</button>
      <button onclick="location.href='/memoria'" type="button">Memoria RAM</button>
    </div>
  </BODY>
</HTML>
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
    <title>Información de Temperaturas</title>
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <style>
      ${sytle}
    </style>
  </head>
  <body>
    <div class="welcome">System Audit version 1.0.5</div>
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
          ${sytle}
        </style>
      </head>
      <body>
        <div class="welcome">System Audit version 1.0.5</div>
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
          ${sytle}
        </style>
      </head>
      <body>
        <div class="welcome">System Audit version 1.0.5</div>
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
          ${sytle}
        </style>
      </head>
      <body>
        <div class="welcome">System Audit version 1.0.5</div>
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
          ${sytle}
        </style>
      </head>
      <body>
        <div class="welcome">System Audit version 1.0.5</div>
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
          ${sytle}
        </style>
      </head>
      <body>
        <div class="welcome">System Audit version 1.0.5</div>
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
          ${sytle}
        </style>
      </head>
      <body>
        <div class="welcome">System Audit version 1.0.5</div>
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
          ${sytle}
        </style>
      </head>
      <body>
        <div class="welcome">System Audit version 1.0.5</div>
        <h1>Estado del Clima</h1>
        ${formattedOutput}
        <a href="javascript:history.back()">VOLVER</a>
      </body>
      </html>
      `)
  })
})

app.get('/memoria', (req, res) => {
  exec('inxi -m', (error, stdout, stderr) => {
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
        <title>Información de la Memoria RAM</title>
        <style>
          ${sytle}
        </style>
      </head>
      <body>
        <div class="welcome">System Audit version 1.0.5</div>
        <h1>Memoria RAM</h1>
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
