import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Monitor } from '../mongo/mongo.js'
 
import './main.html';

var subHandle;
subHandle = Meteor.subscribe("_console");

var scroll = 2000;
var sharedConsole = new Meteor.Collection('_clientConsole');
sharedConsole.find().observe({
  added: function(doc) {
    //var args = ["Server (" + doc.createdAt.toUTCString() + "):"];
    // while(flag){

      //alert(doc.args.length);
        let log = JSON.parse(doc.args[0]);
        //alert(log);
        if (log == "all Done!!!\n"){
            alert('done')
            Session.set('disableBtn', false);
             //Meteor.call('rmAll');
         }
        //args.push(JSON.parse(doc.args[i]));
        Meteor.call('addMsg',log);
        //$("#terminal").scrollTop(100); 
        //alert(scroll);
        scroll+=100;
        $("#terminal").scrollTop(scroll);
        
        
      // }

      // return;
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
  Session.set('disableBtn', false);
  Meteor.call('rmAll');
});

Template.realdemo.helpers({
  messages(){
    return Monitor.find({}).fetch();
  },
  disableBtn(){
    //alert(Session.get('disableBtn'));
   //return Monitor.findOne({message:'all Done!!!'})==null;
  
   return Session.get('disableBtn');
  }
});

Template.realdemo.events({

  'click button'(){
    Session.set('disableBtn', true);
  },
  // 'click #check'(){
  //   let btnStatus = Session.get('disableBtn');
  //  // TemplateVar.set('disableBtn', !btnStatus);
  // },
  'click button#create'() {
    //TemplateVar.set('disableBtn', false);
    //alert(TemplateVar.get('disableBtn'));
    TemplateVar.set('name', "你好");  //<--put this into input box event
    Meteor.call('runCode', TemplateVar.get('name'), function(e, r){
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