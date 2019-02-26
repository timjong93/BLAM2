Template.ticketDetail.helpers({
	currentTicketId(){
		return Session.get('currentTicketId')
	},
	ct(){
		return Tickets.findOne({_id:Session.get('currentTicketId')});
	},
	statusOptions() {
		return [
	        {label: 'Open', value: 'Open'},
	        {label: 'Gesloten', value: 'Gesloten'},
    	];
	},
	priorityOptions() {
		return [
	        {label: 'Laag', value: 'Laag'},
	        {label: 'Normaal', value: 'Normaal'},
	        {label: 'Hoog', value: 'Hoog'},
    	];
	},
	ownerOptions() {
		let options = [];
		Meteor.users.find().fetch().forEach(function(user){
			options.push({label: user.username, value: user.username});
		})
		return options;
	},
	logs(ticketId){
		let ticket = Tickets.findOne({_id:ticketId});
		let logs = Logs.find({_id:{$in:ticket.logs}},{sort: {createdAt: -1}}).fetch();
		logs.map(function(log){
			log.message = log.message.replace(/(BATA-[0-9]*)/ig, '<span class="label label-primary">$1</span>');
			return log;
		});
		return logs
	},
	handles(ticketId){
		let ticket = Tickets.findOne({_id:ticketId});
		return Handles.find({_id:{$in:ticket.handles}},{sort: {callsign: -1}}).fetch();
	},
	getStatusColor(status, priority){
		if (status === 'Gesloten') {
			color = '#f5f5f5';
		} else {
			switch(priority) {
			    case 'Hoog':
			        color = '#ed5565';
			        break;
			    case 'Normaal':
			        color = '#f8ac59';
			        break;
			    case 'Laag':
			        color = '#1c84c6';
			        break;
			    default:
			        color = '#f5f5f5';
			}
		}
		return color;
	}

});