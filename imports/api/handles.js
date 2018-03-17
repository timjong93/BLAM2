import { Mongo } from 'meteor/mongo';
this.Handles = new Mongo.Collection('handles');

this.handleSchema = new SimpleSchema({
  callsign: {type: String},
  name: {type: String},
  subnet: {type:String},
  lastLog: {
    type: Date,
    optional: true,
    },
  createdBy: {
        type: String,
        autoValue: function() {
            return Meteor.userId();
        }
    },  
    createdAt: {
        type: Date,
        autoValue: function() {
            return new Date();
        }
    },  
});

Handles.attachSchema(this.handleSchema);

Handles.allow({
  update() { return true; }
});


if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('handles', function handlePublication() {
    return Handles.find();
  });
}
