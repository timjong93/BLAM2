import { Session } from 'meteor/session'

Template.tickets.onRendered(function onTicketRendered(){
    $('#ticket-list').slimScroll({
		height: 'auto',
	});
});

Template.tickets.helpers({
    new_tickets() {
        let searchQuery = Session.get('searchValue')
        if(searchQuery){
            let logIds = []
            const logs= Logs.find({message:{'$regex':searchQuery, '$options' : 'i'}},{fields: {_id: 1}}).fetch();
            logs.forEach(log => {
                logIds.push(log._id);
            });           
            return Tickets.find({$and:[{$or:[{title:{'$regex':searchQuery, '$options' : 'i'}},{logs:{$in:logIds}},{owner:{'$regex':searchQuery, '$options' : 'i'}}]},{status:'Open', owner:{$exists:false}, parent:{$exists:false}}]},{sort:{priority:-1}}).fetch();
        }else{
            return Tickets.find({status:'Open', owner:{$exists:false}, parent:{$exists:false}},{sort:{priority:-1}}).fetch();
        }
        
        
    },
    open_tickets() {
        let searchQuery = Session.get('searchValue')
        if(searchQuery){
            let logIds = []
            const logs= Logs.find({message:{'$regex':searchQuery, '$options' : 'i'}},{fields: {_id: 1}}).fetch();
            logs.forEach(log => {
                logIds.push(log._id);
            });           
            return Tickets.find({$and:[{$or:[{title:{'$regex':searchQuery, '$options' : 'i'}},{logs:{$in:logIds}},{owner:{'$regex':searchQuery, '$options' : 'i'}}]},{status:'Open', owner:{$exists:true}, parent:{$exists:false}}]},{sort:{priority:-1}}).fetch();
        }else{
            return Tickets.find({status:'Open', owner:{$exists:true}, parent:{$exists:false}},{sort:{priority:-1}}).fetch();
        }
    },
    closed_tickets() {
        let searchQuery = Session.get('searchValue')
        if(searchQuery){
            let logIds = []
            const logs= Logs.find({message:{'$regex':searchQuery, '$options' : 'i'}},{fields: {_id: 1}}).fetch();
            logs.forEach(log => {
                logIds.push(log._id);
            });           
            return Tickets.find({$and:[{$or:[{title:{'$regex':searchQuery, '$options' : 'i'}},{logs:{$in:logIds}},{owner:{'$regex':searchQuery, '$options' : 'i'}}]},{status:'Gesloten', parent:{$exists:false}}]},{sort:{closedAt:1}}).fetch();
        }else{
            return Tickets.find({status:'Gesloten', parent:{$exists:false}},{sort:{closedAt:1}}).fetch();
        }
    }
});
