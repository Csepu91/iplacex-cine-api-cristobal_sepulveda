import express, { urlencoded } from 'express'
import cors from 'cors'


import client from './src/common/db.js'
import peliculaRoutes from './src/pelicula/routes.js'
import actorRoutes from './src/actor/routes.js'

const PORTS = 3000 || 4000
const app = express()

app.use(express.json())
app.use(urlencoded({extended:true}))
app.use(cors())


// elemento modificado desde all a get
app.get('/', (req,res)=> {return res.status(200).send('Bienvenido al cine Iplacex')})

app.use('/api', peliculaRoutes)
app.use('/api', actorRoutes)

await client.connect()
.then(()=>{
     // simulación de error: throw new Error('Simulación de error al conectar al cluster');
    console.log('conectado al clúster')
    try{
        // simulación de error: throw new Error('Simulación de error al conectar al servidor');
        app.listen(PORTS, () => {console.log(`Servidor corriendo en http://localhost:${PORTS}`)})
    }catch(error){
        console.log('Ha ocurrido un error al conectar al Servidor')}
})
.catch(()=>{
    console.log('Ha ocurrido un error al conectar al clúster de Atlas')
})
