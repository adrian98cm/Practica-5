import "babel-polyfill";
import { MongoClient, ObjectID } from "mongodb";

import { PubSub } from "graphql-yoga";



const Mutation = {


    addEquipo: async (parent, args, ctx, info) => {
        
        const { client } = ctx
        const name = args.name

        const db = client.db("futbol");
        const collection = db.collection("equipos");

        if(await collection.findOne({name})) throw Error("Equipo existente")

        const resultado = await collection.insertOne({name});

        return resultado.ops[0]

    },

    addPartido: async (parent, args, ctx, info) => {

        const { client } = ctx
        const equipolocal = args.local
        const equipovisitante = args.visitante
        const resultado = args.resultado
        const fecha = args.fecha
        const estadopartido = args.estadopartido

        const db = client.db("futbol");
        const collectionEquipos = db.collection("equipos");
        const collectionPartidos = db.collection("partidos");

        if(!await collectionEquipos.findOne({name: equipolocal})) throw new Error ("El equipo local no existe")
        if(!await collectionEquipos.findOne({name: equipovisitante})) throw new Error ("El equipo visitante no existe")
        if(equipolocal === equipovisitante) throw new Error("El equipo local y visitante no pueden ser el mismo")

        const retornar = await collectionPartidos.insertOne({equipolocal,equipovisitante,resultado,fecha,estadopartido});

        return retornar.ops[0];


    },

    updateResultado: async (parent, args, ctx, info) => {

        const { client, pubsub } = ctx
        const idpartido = args.idpartido;
        const nuevoresultado = args.nuevoresultado;

        const db = client.db("futbol");
        const collection = db.collection("partidos");

        const busqueda = await collection.findOne({ _id: ObjectID(idpartido)});

        if(busqueda.state !==1) { throw new Error("El partido no está en juego")}

        const resultado = await collection.findOneAndUpdate({_id: ObjectID(idpartido)},{$set:{resultado:nuevoresultado}},{returnOriginal: false})

        //Aqui las suscripciones


        pubsub.publish(
            idpartido,
            {
                notificarPartido : resultado.value
            }

        );


        pubsub.publish(
            idpartido,
            {
                notificarEquipo : resultado.value
            }

        );
        

        return resultado.value;

    },

    iniciarPartido: async (parent, args, ctx, info) => {

        const { client, pubsub} = ctx
        const idpartido = args.idpartido
        
        const db = client.db("futbol");
        const collection = db.collection("partidos");

        const busqueda = await collection.findOne({_id:ObjectID(idpartido)});
        if(busqueda.state === 1){ throw new Error("El partido ya está en juego")}

        const resultado = await collection.findOneAndUpdate({_id: ObjectID(idpartido)},{$set:{estadopartido: 1}},{returnOriginal:false})
    
        //Aqui las suscripciones


        pubsub.publish(
            idpartido,
            {
                notificarPartido : resultado.value
            }

        );


        pubsub.publish(
            idpartido,
            {
                notificarEquipo : resultado.value
            }

        );


        return resultado.value;

    },


    finalizarPartido: async (parent, args, ctx, info) => {

        const { client, pubsub} = ctx
        const idpartido = args.idpartido
        
        const db = client.db("futbol");
        const collection = db.collection("partidos");

        const busqueda = await collection.findOne({_id:ObjectID(idpartido)});
        if(busqueda.state === 2){ throw new Error("El partido ya no está en juego")}

        const resultado = await collection.findOneAndUpdate({_id: ObjectID(idpartido)},{$set:{estadopartido: 2}},{returnOriginal:false})
    
        //Aqui las suscripciones


        pubsub.publish(
            idpartido,
            {
                notificarPartido : resultado.value
            }

        );


        pubsub.publish(
            idpartido,
            {
                notificarEquipo : resultado.value
            }

        );

        return resultado.value;

    },




}

export {Mutation as default}