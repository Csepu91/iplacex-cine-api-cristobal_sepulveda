import { MongoClient, ServerApiVersion } from "mongodb";

const uri = 'mongodb+srv://eva3_express:TVCoqzXZo7uz0yPj@cluster-express.8sang.mongodb.net/?retryWrites=true&w=majority&appName=cluster-express'


const client = new MongoClient(uri, {
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors:true
    }
})

export default client