import { Session } from 'meteor/session'

Template.ticket.onRendered(function onTicketRendered(){
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
            return Tickets.find({$and:[{$or:[{title:{'$regex':searchQuery, '$options' : 'i'}},{logs:{$in:logIds}},{owner:{'$regex':searchQuery, '$options' : 'i'}}]},{status:'Open', owner:{$exists:false}}]},{sort:{priority:-1}}).fetch();
        }else{
            return Tickets.find({status:'Open', owner:{$exists:false}},{sort:{priority:-1}}).fetch();
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
            return Tickets.find({$and:[{$or:[{title:{'$regex':searchQuery, '$options' : 'i'}},{logs:{$in:logIds}},{owner:{'$regex':searchQuery, '$options' : 'i'}}]},{status:'Open', owner:{$exists:true}}]},{sort:{priority:-1}}).fetch();
        }else{
            return Tickets.find({status:'Open', owner:{$exists:true}},{sort:{priority:-1}}).fetch();
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
            return Tickets.find({$and:[{$or:[{title:{'$regex':searchQuery, '$options' : 'i'}},{logs:{$in:logIds}},{owner:{'$regex':searchQuery, '$options' : 'i'}}]},{status:'Gesloten'}]},{sort:{priority:-1}}).fetch();
        }else{
            return Tickets.find({status:'Gesloten'},{sort:{priority:-1}}).fetch();
        }
    }
});

Template.ticket.helpers({
    getStatusColor(priority){
        switch(priority) {
            case 2:
            return 'icon-danger';
            case 1:
            return 'icon-warning';				
            case 0:
            return 'icon-info';
            default:
            return 'icon-primary';
        }
    },
    isActive(id){
        return id == Session.get('currentTicketId')
    },
    notify(ticket){        
        return Logs.find({$and:[{_id:{$in:ticket.logs}},{actionPerformed:{$exists:true}},{actionPerformed:false}]}).fetch().length > 0;
    }
})

Template.ticket.events({
    'click .ticket-link'(event) {
        Session.set(
            'currentTicketId',
            event.target.id
        );
        $('.slimScrollDivLogsDetail').slimScroll({
            height: 'auto',
        });
    }
});