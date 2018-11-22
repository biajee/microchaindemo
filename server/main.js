import { Meteor } from 'meteor/meteor';


const spawn = require('child_process').spawn;

ConsoleMe = {};

Meteor.startup(() => {
  ConsoleMe.enabled = true;
  
  var sharedConsole = new Meteor.Collection('_console', {connection: null});
  var originalLog = console.log;
  console.log = Meteor.bindEnvironment(function() {
    originalLog.apply(console, arguments);
    if (ConsoleMe.enabled) {
      // Stringify arguments, stopping recursion at any circular references
      // to avoid errors.
      var args = Array.prototype.slice.call(arguments);
      var cache = [];
      args = args.map(function (arg) {
        return JSON.stringify(arg, function(key, value) {
          if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return;
            }
            // Store value in our collection
            cache.push(value);
          }
          return value;
        });
      });
      cache = null; // Enable garbage collection
      sharedConsole.insert({args: args, createdAt: new Date});
    }
  });
  

  Meteor.publish("_console", function() {
    var self = this;
    var initializing = true;
    var handle = sharedConsole.find().observe({
      added: function(doc) {
        if (!initializing) {
          self.added("_clientConsole", doc._id, doc);
          sharedConsole.remove({_id: doc._id});
        }
      }
    });
    initializing = false;
    self.ready();

    // Stop observing the cursor when client unsubs.
    self.onStop(function() {
      handle.stop();
    });
  });
});

Meteor.methods({
  runCode: function (name) {
    var path = process.env.PWD + "/contracts/micro_chain_test.js"
    const ls = spawn("node", [path, name]);
    ls.stdout.on('data', (data)=>{
      console.log(`${data}`);
    });
    ls.stderr.on('data', (data)=>{
      console.log(`${data}`);
    });
  }
});

