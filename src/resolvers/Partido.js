import "babel-polyfill";

const Partido = {

    equipolocal: async (parent, args, ctx, info) => {
        const equipolocal = parent.equipolocal;
        const { client } = ctx

        const db = client.db("futbol");
        const collection = db.collection("equipos");

        const result = await collection.findOne({name:equipolocal})

        return result;
    },



    equipovisitente: async (parent, args, ctx, info) => {
        const equipovisitante = parent.equipovisitante;
        const { client } = ctx

        const db = client.db("futbol");
        const collection = db.collection("equipos");

        const result = await collection.findOne({name:equipovisitante})

        return result;
    },

}

export {Partido as default}