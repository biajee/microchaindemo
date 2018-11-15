import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.realdemo.onCreated(function realdemoOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.realdemo.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.realdemo.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
