import { Meteor } from 'meteor/meteor';
import '/imports/api/logs.js';
import '/imports/api/handles.js';
import '/imports/api/tickets.js';
import '/imports/api/users.js';
import '/imports/api/locationSettings.js';

Meteor.startup(() => {
if(!Meteor.users.find().count()) {
    var options = {
      username: 'admin', 
      password: 'admin', 
      email: 'admin@example.com'
    };
    Accounts.createUser(options);
  }
});