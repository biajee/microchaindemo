import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Monitor } from '../mongo/mongo.js'
 
import './main.html';

var subHandle;
subHandle = Meteor.subscribe("_console");

var scroll = 1000;
flag = true;
var sharedConsole = new Meteor.Collection('_clientConsole');
sharedConsole.find().observe({
  added: function(doc) {
    //var args = ["Server (" + doc.createdAt.toUTCString() + "):"];
    while(flag){
         
      //alert(doc.args.length);
        let log = JSON.parse(doc.args[0]);
        //args.push(JSON.parse(doc.args[i]));
        Meteor.call('addMsg',log);
        //$("#terminal").scrollTop(100); 
        //alert(scroll);
        scroll+=10;
        // $("#terminal").scrollTop(scroll);
        
        // Meteor.call('allDone',function(e,r){
        //   if(r){
        //     alert('all done');
        //     flag = false;
        //   } 
        // })
      }

      return;
    // for (var i = 0, ln = doc.args.length; i < ln; i++) {
        
    //     let log = JSON.parse(doc.args[i]);
    //     args.push(JSON.parse(doc.args[i]));

    // }
    //console.log.apply(console, args);
  }
});

Template.realdemo.onCreated(function realdemoOnCreated() {
  // counter starts at 0
  Meteor.subscribe('Monitor');
  Meteor.call('rmAll');
});

Template.realdemo.helpers({
  messages(){
    return Monitor.find({}).fetch();
  }
});

Template.realdemo.events({
  'click #check'(event, instance){
    Meteor.call('allDone',function(e, r){
      alert(r);
    });
  },

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

  // 'click #test'(){
  //   $("#terminal").scrollTop($("#terminal").offset().top);
  // }

});