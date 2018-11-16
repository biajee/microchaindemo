import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Monitor } from '../mongo/mongo.js'
 
import './main.html';

var subHandle;
subHandle = Meteor.subscribe("_console");

var sharedConsole = new Meteor.Collection('_clientConsole');
sharedConsole.find().observe({
  added: function(doc) {
    var args = ["Server (" + doc.createdAt.toUTCString() + "):"];
    for (var i = 0, ln = doc.args.length; i < ln; i++) {
        let log = JSON.parse(doc.args[i]);
        args.push(JSON.parse(doc.args[i]));
        Meteor.call('addMsg',log)
    }

    //console.log.apply(console, args);
  }
});

Template.realdemo.onCreated(function realdemoOnCreated() {
  // counter starts at 0
  
  Meteor.subscribe('Monitor');
  Meteor.call('rmAll');
});

Template.realdemo.helpers({
  // log(){
  //   sharedConsole.find().observe({
  //     added: function(doc) {
  //       var args = ["Server (" + doc.createdAt.toUTCString() + "):"];
  //       for (var i = 0, ln = doc.args.length; i < ln; i++) {
  //           //console.log(doc.args[i]);
  //           args.push(JSON.parse(doc.args[i]));
  //           //Meteor.call('addMsg',doc.args[i])
  //       }
        
  //       //return args;
  //       console.log.apply(console, args);
  //     }
  //   });
    
  // },
  messages(){
    return Monitor.find({}).fetch();
  }
});

Template.realdemo.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    Meteor.call('runCode', function(e, r){
        console.log('test');
        if (!e){
          console.log(e);
        }
        else
        {
          console.log(r);
        }
    });
  },
  'click #rm'(){
    Meteor.call('rmAll');
  }
});