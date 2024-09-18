import { ObjectId } from 'mongodb'
import client from '../common/db.js'
import { Pelicula } from './pelicula.js'

const peliculaCollection = client.db('cine-db').collection('peliculas')

async function handleInsertPeliculaRequest(req, res) {
    let data = req.body
    let pelicula = Pelicula

    pelicula.nombre = data.nombre
    pelicula.anioEstreno = data.anioEstreno
    pelicula.generos = data.generos

    await peliculaCollection.insertOne(pelicula)
    .then((data)=> {
        if(data === null) return res.status(400).send('Error al guardar registro')
        
            return res.status(201).send(data)
        })
    .catch((e) =>{return res.status(500).send({error:e})})
}

async function handleGetPeliculasRequest(req, res) {
    await peliculaCollection.find({}).toArray()
    .then((data)=>{return res.status(200).send(data)})
    .catch((e)=>{return res.status(500).send({error: e})})
}

async function handleGetPeliculaByIdRequest(req, res) {
    let id = req.params.id

    try{
        let oid = ObjectId.createFromHexString(id)
        await peliculaCollection.findOne({_id : oid})
        .then((data)=>{
            if (data === null) res.status(404).send(data)

            return res.status(200).send(data)
        })
        .catch((e)=>{
            return res.status(500).send({error:e.code})
        })
    }catch(e){
        return res.status(400).send('Id mal formado')
    }
}

async function handleUpdatePeliculaByIdRequest(req, res) {
    let id = req.params.id
    let pelicula = req.body

    try {
        let oid = ObjectId.createFromHexString(id)

        let query = { $set: pelicula }
        
        await peliculaCollection.updateOne({ _id: oid }, query)
        .then((data) => {
            if (data === null) return res.status(404).send(data)

            return res.status(200).send(data)
        })
        .catch((e) => { return res.status(500).send({ code: e.code }) })
    } catch (e) {
        return res.status(400).send('Id mal formado')
    }
}

async function handleDeletePeliculaByIdRequest(req, res) {
    let id = req.params.id
    
    try {
        let oid = ObjectId.createFromHexString(id)
        
        await peliculaCollection.deleteOne({ _id: oid })
        .then((data) => {
            if (data === null) return res.status(404).send(data)

            return res.status(200).send(data)
        })
        .catch((e) => { return res.status(500).send({ code: e.code })})
    } catch (e) {
        return res.status(400).send('Id mal formado')
    }
}

export default {
    handleInsertPeliculaRequest,
    handleGetPeliculasRequest,
    handleGetPeliculaByIdRequest,
    handleUpdatePeliculaByIdRequest,
    handleDeletePeliculaByIdRequest
}