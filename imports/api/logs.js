import { Mongo } from 'meteor/mongo';
this.Logs = new Mongo.Collection('logs');

this.logSchema = new SimpleSchema({
  message: {type: String},
  handles: {type: Array},
  'handles.$': {type: String},
  createdBy: {
        type: String,
        autoValue: function() {
            return Meteor.user().username;
        },  
        denyUpdate: true
    },  
    createdAt: {
        type: Date,
        autoValue: function() {
            return new Date();
        },  
        denyUpdate: true
    },  
});

Logs.attachSchema(this.logSchema);

Logs.allow({
  insert() { return true; }
});

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('logs', function logPublication() {
    return Logs.find();
  });
}