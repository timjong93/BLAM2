import { Mongo } from 'meteor/mongo';
this.Logs = new Mongo.Collection('logs');

this.logSchema = new SimpleSchema({
    message: {type: String},
    handles: {type: Array},
    'handles.$': {type: String},
    actionPerformed: {
        type: Boolean,
        optional: true
    },
    updatedBy: {
        type: String,
        autoValue: function() {
            if(this.isInsert){
                return Meteor.user().username;
            }
        }
    },  
    updatedAt: {
        type: Date,
        autoValue: function() {
            if(this.isInsert){
                return new Date();
            }
        }
    },  
});

Logs.attachSchema(this.logSchema);

Logs.allow({
    insert() { return true; },
    update() { return true; }
});

Logs.before.insert(function (userId, doc) {
    doc.handles.forEach(function(handle_id){
        Handles.update(handle_id,{$set:{lastLog:new Date()}});
    })
});

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('logs', function logPublication(limit) {
        return Logs.find({},
            {
                sort: {updatedAt: -1},
                limit: limit
            });
    });
}