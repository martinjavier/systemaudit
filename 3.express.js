const express = require('express')
const app = express()
const { exec } = require('child_process')
const PORT = process.env.PORT ?? 1234
const dittoJSON = require('./pokemon/ditto.json')

app.disable('x-powered-by')

app.get('/', (req, res) => {
  const cuerpo = `<HTML>
  <HEAD>
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
            color: #2c3e50;
            text-align: center;
            padding: 20px;
            background-color: #ecf0f1;
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
  <div class="welcome">Bienvenidos</div>
<a href="/temperatura">Temperatura</a><br/>
<a href="/discos">Discos</a><br/>
<a href="/particiones">Particiones</a><br/>
<a href="/procesador">Procesador</a><br/>
<a href="/red">Red</a><br/>
<a href="/wanip">Wan IP</a><br/>
<a href="/machine">Equipo</a><br/>
<a href="/memoriaram">Memoria RAM</a><br/>
<a href="/particiones">Particiones</a><br/>
<a href="/swapinfo">SWAP info</a><br/>
<a href="/basicinfo">Información Básica</a><br/>
</BODY></HTML>
`
  res.send(cuerpo)
})

app.get('/temperatura', (req, res) => {
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
    res.send(`<b>Contenido: ${formattedOutput}</b><br/><a href="javascript:history.back()">VOLVER</a>`)
  })
})

app.get('/discos', (req, res) => {
  exec('inxi -D', (error, stdout, stderr) => {
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
    res.send(`<b>Contenido: ${formattedOutput}</b><br/><a href="javascript:history.back()">VOLVER</a>`)
  })
})

app.get('/particiones', (req, res) => {
  exec('inxi -P', (error, stdout, stderr) => {
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
    res.send(`<b>Contenido: ${formattedOutput}</b><br/><a href="javascript:history.back()">VOLVER</a>`)
  })
})

app.get('/procesador', (req, res) => {
  exec('inxi -C', (error, stdout, stderr) => {
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
    res.send(`<b>Contenido: ${formattedOutput}</b><br/><a href="javascript:history.back()">VOLVER</a>`)
  })
})

app.get('/red', (req, res) => {
  exec('inxi -N', (error, stdout, stderr) => {
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
    res.send(`<b>Contenido: ${formattedOutput}</b><br/><a href="javascript:history.back()">VOLVER</a>`)
  })
})

app.get('/wanip', (req, res) => {
  exec('inxi -i', (error, stdout, stderr) => {
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
    res.send(`<b>Contenido: ${formattedOutput}</b><br/><a href="javascript:history.back()">VOLVER</a>`)
  })
})

app.get('/machine', (req, res) => {
  exec('inxi -M', (error, stdout, stderr) => {
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
    res.send(`<b>Contenido: ${formattedOutput}</b><br/><a href="javascript:history.back()">VOLVER</a>`)
  })
})

app.get('/memoriaram', (req, res) => {
  exec('inxi -m', (error, stdout, stderr) => {
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
    res.send(`<b>Contenido: ${formattedOutput}</b><br/><a href="javascript:history.back()">VOLVER</a>`)
  })
})

app.get('/particiones', (req, res) => {
  exec('inxi -l', (error, stdout, stderr) => {
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
    res.send(`<b>Contenido: ${formattedOutput}</b><br/><a href="javascript:history.back()">VOLVER</a>`)
  })
})

app.get('/swapinfo', (req, res) => {
  exec('inxi -j', (error, stdout, stderr) => {
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
    res.send(`<b>Contenido: ${formattedOutput}</b><br/><a href="javascript:history.back()">VOLVER</a>`)
  })
})

app.get('/basicinfo', (req, res) => {
  exec('inxi -b', (error, stdout, stderr) => {
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
    res.send(`<b>Contenido: ${formattedOutput}</b><br/><a href="javascript:history.back()">VOLVER</a>`)
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
