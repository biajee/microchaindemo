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
  
  import { Monitor } from '../mongo/mongo.js'
  Meteor.publish('Monitor',function (){
    // console.log(Meteor.userId() + "  " + this.userId);
    return Monitor.find({});
})

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
  runCode: function () {
    // This method call won't return immediately, it will wait for the
    // asynchronous code to finish, so we call unblock to allow this client
    // to queue other method calls (see Meteor docs)
    /*this.unblock();
    var future=new Future();
    var path = process.env.PWD + "/contracts/micro_chain_test.js"
    console.log(process.env.PWD);
    var command="node " + path;
    exec(command,function(error,stdout,stderr){
      if(error){
        console.log(error);
        throw new Meteor.Error(500,command+" failed");
      }
      //future.return(stdout.toString());
      console.log(stdout.toString());
    });
    return future.wait();*/
    var path = process.env.PWD + "/contracts/micro_chain_test.js"
    const ls = spawn("node",[path]);
    ls.stdout.on('data', (data)=>{
      console.log(`${data}`);
    });
  }
});

