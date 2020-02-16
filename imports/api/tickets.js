import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema'

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
  closedAt: {type: Date, optional:true}  
});

Tickets.attachSchema(this.ticketSchema);

Tickets.allow({
  insert() { return true; },
  update() { return true; }
});

this.Tickets.before.update((userID, doc, fieldNames, modifier, options)=>{
  if(doc.status == 'Open' && modifier.$set.status == 'Gesloten'){
    modifier.$set.closedAt = new Date();
  }

})


if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('tickets', function ticketPublication() {
    return Tickets.find();
  });
}