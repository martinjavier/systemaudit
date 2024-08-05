const express = require('express')
const app = express()
const { exec } = require('child_process')
const dittoJSON = require('./pokemon/ditto.json')

app.disable('x-powered-by')

app.get('/', (req, res) => {
  const cuerpo = `<HTML>
  <HEAD>
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
            color: #2980b9;
        }
    </STYLE></HEAD>  
  <BODY>
  <div class="welcome">System Audit version 0.5</div>
<a href="/temperatura">Temperaturas</a><br/>
<a href="/discos">Discos</a><br/>
<a href="/particiones">Particiones</a><br/>
<a href="/procesador">Procesador</a><br/>
<a href="/red">Placas de Red</a><br/>
<a href="/wanip">Información de la red</a><br/>
<a href="/machine">Información del Equipo</a><br/>
<a href="/swapinfo">SWAP info</a><br/>
<a href="/basicinfo">Información Básica</a><br/>
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

    // Función para limpiar y formatear una sección
    const formatSection = (section) => {
      return section
        .replace(/\u001b\[\d+m/g, '') // Elimina códigos de color ANSI
        .replace(/\d+/g, '') // Elimina los números que preceden a las etiquetas
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '' && !line.startsWith(':'))
        .map(line => {
          const [key, ...valueParts] = line.split(':')
          const value = valueParts.join(':').trim()
          // Maneja casos especiales como "Sensors:" o "Drives:" que no tienen valor
          if (!value) {
            return `<h3>${key}</h3>`
          }
          return `<p><strong>${key}:</strong> ${value}</p>`
        })
        .join('')
    }

    // Extraer secciones
    const sections = stdout.split(/(?=Sensors:|Drives:)/)
    const sensorsSection = sections.find(section => section.startsWith('Sensors:'))
    const drivesSection = sections.find(section => section.startsWith('Drives:'))

    // Formatear secciones
    const formattedSensors = sensorsSection ? formatSection(sensorsSection) : '<p>No se encontró información de sensores.</p>'
    const formattedDrives = drivesSection ? formatSection(drivesSection) : '<p>No se encontró información de discos.</p>'

    // Enviar respuesta HTML
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Información de Sensores y Discos</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
          h1, h2, h3 { color: #333; }
          section { margin-bottom: 30px; }
          p { margin: 5px 0; }
          a { display: inline-block; margin-top: 20px; padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Información de Sensores y Discos</h1>
        <section>
          <h2>Sensores</h2>
          ${formattedSensors}
        </section>
        <section>
          <h2>Discos</h2>
          ${formattedDrives}
        </section>
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

app.get('/red', (req, res) => {
  exec('inxi -N', (error, stdout, stderr) => {
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
    res.send(`<!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Información de la Red</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
          h1 { color: #333; }
          a { display: inline-block; margin-top: 20px; padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Red</h1>
        ${formattedOutput}
        <a href="javascript:history.back()">VOLVER</a>
      </body>
      </html>`)
  })
})

app.get('/wanip', (req, res) => {
  exec('inxi -i', (error, stdout, stderr) => {
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
        <title>Información de dispositivos de Red</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
          h1 { color: #333; }
          a { display: inline-block; margin-top: 20px; padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Dispositivos de Red</h1>
        ${formattedOutput}
        <a href="javascript:history.back()">VOLVER</a>
      </body>
      </html>`)
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
