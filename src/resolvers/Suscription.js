import "babel-polyfill";

const Suscription = {


    notificarPartido:{
        suscribe(parent,args,ctx,info){
            const {id} = args;
            const {pubsub} = ctx;
            return pubsub.asyncIterator(id);
        }
    },


    notificarEquipo:{
        suscribe(parent,args,ctx,info){
            const {id} = args;
            const {pubsub} = ctx;
            return pubsub.asyncIterator(id);
        }
    }

}

export {Suscription as default}