Template.ticketDetail.onRendered(function ticketDetailOnRendered(){
	$('.slimScrollDivLogsDetail').slimScroll({
		height: 'auto'
	})
});

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
	        {label: 'Low', value: 0},
	        {label: 'Normal', value: 1},
	        {label: 'High', value: 2},
    	];
	},
	ownerOptions() {
		let options = [];
		Meteor.users.find().fetch().forEach(function(user){
			options.push({label: user.username, value: user.username});
		})
		return options;
	},
	parentOptions() {
		let options = [];
		Tickets.find({parent:{$exists:false}}).fetch().forEach(function(ticket){
			options.push({label: ticket.title, value: ticket._id});
		})
		return options;
	},
	logs(ticketId){
		let ticket = Tickets.findOne({_id:ticketId});
		let logs = Logs.find({_id:{$in:ticket.logs}},{sort: {createdAt: -1}}).fetch();
		logs.map(function(log){
			let users = Meteor.users.find().fetch().map((u)=>{return u.username});
			let userRegex = new RegExp('('+users.join('|')+')','ig');
			
			log.message = log.message.replace(/(BATA-[0-9]* \([\w*\s*]*\))/ig, '<span class="label label-primary">$1</span>');
			log.message = log.message.replace(userRegex, '<span class="label label-warning">$1</span>');
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
			    case 2:
			        color = '#ed5565';
			        break;
			    case 1:
			        color = '#f8ac59';
			        break;
			    case 0:
			        color = '#1c84c6';
			        break;
			    default:
			        color = '#f5f5f5';
			}
		}
		return color;
	}

});