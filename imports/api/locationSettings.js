import { Mongo } from 'meteor/mongo';
this.LocationSettings = new Mongo.Collection('locationSettings');

this.locationSchema = new SimpleSchema({
    messagesPerSecond: {type: Number, label:"Throttle (minimum time between location requests on sec)"},
    defaultGpsMode: {type: String, 
    label:"Default GPS mode", 
    allowedValues: ['none', 'pull', 'interval'],
    autoform: {
        options: {
            none: "None",
            pull: "Pull",
            interval: 'Interval',
        }
        }
    },
    defaultInterval: {type: Number, label:"Default interval for polling"},
});

LocationSettings.attachSchema(this.locationSchema);



if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('locationSettings', function locationSettingsPublication() {
        return LocationSettings.find();
    });

    LocationSettings.before.update(function (userId, doc, fieldNames, modifier, options) {
        console.log(doc);
        HTTP.call('Patch', `${Meteor.settings.motoTrboApi}/system/settings`, {
            data: {
                "MessagesPerSecond": doc.messagesPerSecond,
                "DefaultGpsMode": doc.defaultGpsMode,
                "DefaultInterval": doc.defaultInterval
            }
        }, 
        (err,res)=>{
            if(!err){
                console.log(`Succesfully updated location settings`);
            }else{
                console.error(`Error updating location settings`);
                console.error(err);
            }
        });
    });

    Meteor.methods({
        pushGPSSettings(){
            //getdata
            let handles = Handles.find({'radio':true}).fetch();
            const payload = [];
            handles.map((h)=>{
                payload.push({
                    id: h.motoTrboId,
                    GPSMode: h.locationMode,
                    PollInterval: h.locationInterval
                })
            });
            console.log(payload);
            //sendreq
            HTTP.call('PATCH', `${Meteor.settings.motoTrboApi}/device`, {
            data: {
                devices: payload
            }
        }, 
        (err,res)=>{
            if(!err){
                console.log(`Succesfully triggered refresh for ${radioId}`);
            }else{
                console.error(`Error while triggering refresh for ${radioId}`);
                console.error(err);
            }
        });
        }
    })

}