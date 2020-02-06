import { Mongo } from 'meteor/mongo';

this.Tickets = new Mongo.Collection('tickets');


this.ticketSchema = new SimpleSchema({
  title: {type: String, defaultValue: 'New Ticket'},
  description: {type: String, optional:true},
  owner: {type: String, optional:true},
  status: {type: String, defaultValue: 'Open'},
  priority: {type: Number, defaultValue: 1},
  location: {type: String, optional:true},
  handles: {type: Array, defaultValue: []},
  'handles.$': { type: String },
  logs: {type: Array},
  'logs.$': { type: String },
  parent: {type:String, optional:true},
  updatedBy: {
        type: String,
        autoValue: function() {
            return Meteor.userId();
        },  
    },  
  updatedAt: {
      type: Date,
      autoValue: function() {
          return new Date();
      },  
  },  
});

Tickets.attachSchema(this.ticketSchema);

Tickets.allow({
  insert() { return true; },
  update() { return true; }
});


if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('tickets', function ticketPublication() {
    return Tickets.find();
  });
}