import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

var subHandle;
subHandle = Meteor.subscribe("_console");

var sharedConsole = new Meteor.Collection('_clientConsole');
// sharedConsole.find().observe({
//   added: function(doc) {
//     var args = ["Server (" + doc.createdAt.toUTCString() + "):"];
//     for (var i = 0, ln = doc.args.length; i < ln; i++) {
//         args.push(JSON.parse(doc.args[i]));
//     }

//     console.log.apply(console, args);
//   }
// });

Template.realdemo.onCreated(function realdemoOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.realdemo.helpers({
  counter() {
    return Template.instance().counter.get();
  },
  // log(){
  //   sharedConsole.find().observe({
  //     added: function(doc) {
  //       var args = ["Server (" + doc.createdAt.toUTCString() + "):"];
  //       for (var i = 0, ln = doc.args.length; i < ln; i++) {
  //           args.push(JSON.parse(doc.args[i]));
  //       }
  //       return args;
  //       //console.log.apply(console, args);
  //     }
  //   });
  // },
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
});