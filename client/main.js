import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Monitor } from '../mongo/mongo.js'
import { Accounts } from 'meteor/accounts-base'; 

import './main.html';

global.gUser = null;
// ServiceConfiguration.configurations.upsert(
//   { service: 'github' },
//   {
//     $set: {
//       loginStyle: "popup",
//       clientId: "biajee"
//     }
//   }
// );
// Meteor.startup(function(){
//   Accounts.ui.config({
//     passwordSignupFields: "USERNAME_ONLY"
//   });
// });

// Accounts.ui.config({
//   passwordSignupFields: "USERNAME_ONLY"
// });
Template.login.events({
    'submit form': function(event) {
        event.preventDefault();
        var userVar = event.target.loginUser.value;
        var passwordVar = event.target.loginPassword.value;
        console.log("Form submitted.");
        Meteor.loginWithPassword(userVar, passwordVar);
    }
});

Template.register.events({
    'submit form': function(event) {
        event.preventDefault();
        var userVar = event.target.registerUser.value;
        var passwordVar = event.target.registerPassword.value;
        Accounts.createUser({
            email: userVar,
            password: passwordVar
        });
    }
});
// Accounts.onLogin(console.log);
// Meteor.loginWithPassword(user, password, [callback])

// Meteor.loginWithGithub({
//   requestPermissions: ['user', 'public_repo']
// }, (error) => {
//   if (error) {
//     Session.set('errorMessage', error.reason || 'Unknown error');
//   } else {
//     console.log('we are logged in');
//   }
// });

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