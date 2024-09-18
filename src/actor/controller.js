import { ObjectId } from 'mongodb'
import client from '../common/db.js'
import { Actor } from './actor.js'

const actorCollection = client.db('cine-db').collection('actores')

const peliculaCollection = client.db('cine-db').collection('peliculas')


async function handleInsertActorRequest(req, res) {
    let data = req.body;
    
    try {
        let idPeliculaP = ObjectId.createFromHexString(data.idPelicula);

        await peliculaCollection.findOne({ "_id": idPeliculaP })
        .then(async (peliculaEncontrada) => {
            if (!peliculaEncontrada) {
                return res.status(404).send(`Película con id: ${data.idPelicula} no encontrada`)
            }
            let actor = Actor
                
            actor.idPelicula = data.idPelicula
            actor.nombre = data.nombre
            actor.edad = data.edad
            actor.estaRetirado = data.estaRetirado
            actor.premios = data.premios

            await actorCollection.insertOne(actor)
            .then((resultado) => {

                if (!resultado.insertedId) {
                    return res.status(400).send('No se pudo ingresar el actor');
                }

                return res.status(201).send(data)
            })
            .catch((e) => {
                console.log(e);
            })
        })
    } catch (e) {
        return res.status(500).send('Id mal formado')
    }
}


async function handleGetActoresRequest(req, res) {
    await actorCollection.find({}).toArray()
    .then((data)=>{return res.status(200).send(data)})
    .catch((e)=>{return res.status(500).send({error: e})})
}


async function handleGetActorByIdRequest(req, res) {
    let id = req.params.id

    try{
        let oid = ObjectId.createFromHexString(id)
        await actorCollection.findOne({_id : oid})
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

async function handleGetActoresByPeliculaIdRequest(req, res) {
    let id = req.params.pelicula

    try{
        let oid = ObjectId.createFromHexString(id)
        await actorCollection.find({ "idPelicula" : id}).toArray()
        .then((data)=>{
            if (data.length === 0){ 
                return res.status(404).send(`No se encontraron actores para la pelicula de id: ${id}`)}

            return res.status(200).send(data)
        })
        .catch((e)=>{
            return res.status(500).send({error:e.code})
        })
    }catch(e){
        return res.status(400).send('Id ingresado mal formado')
    }
}    


export default {
    handleInsertActorRequest,
    handleGetActoresRequest,
    handleGetActorByIdRequest,
    handleGetActoresByPeliculaIdRequest,
}