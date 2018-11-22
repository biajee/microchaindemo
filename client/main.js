import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base'; 

import './main.html';

var scroll = 2000;
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


var sharedConsole = new Meteor.Collection('_clientConsole');

Template.realdemo.onCreated(function realdemoOnCreated() {
  Meteor.subscribe("_console");
  Session.set('disableBtn', false);
});


Template.realdemo.helpers({
  messages(){
    var logs = sharedConsole.find().fetch();

    var messages = _.map(logs, function(log){
      let line = JSON.parse(log.args[0]);
      if (line == "All done!!!\n\n"){
            alert('done')
            Session.set('disableBtn', false);
         }
        scroll+=100;
        $("#terminal").scrollTop(scroll);

      return line;
    });

    return messages;
  },
  disableBtn(){
   return Session.get('disableBtn');
  }
});

Template.realdemo.events({

  'click button'(){
    Session.set('disableBtn', true);
  },
  
  'click button#create'() {
    console.log('run');
    Meteor.call('runCode', TemplateVar.get('name'), function(e, r){
        if (!e){
          console.log(e);
        }
        else
        {
          console.log(r);
        }
    });
  },
  'keyup input#name'(event){
    TemplateVar.set('name', event.target.value);  //<--put this into input box event
    //console.log(TemplateVar.get('name'));
  }



});