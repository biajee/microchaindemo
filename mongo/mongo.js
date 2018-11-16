import { Mongo } from 'meteor/mongo';

export const Monitor = new Mongo.Collection('Monitor');

Meteor.methods({
    /**
     * add new line
     * @method addInfo()
     * */
    addMsg(value){
    	//console.log('insert log');
        Monitor.insert({
            message: value,
        });
    },

    rmAll(){
    	Monitor.remove({});
    }
})