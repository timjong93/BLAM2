Template.ticketDetail.helpers({
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
		Tickets.find({parent:{$exists:false}, _id:{$not:Session.get('currentTicketId')}}).fetch().forEach(function(ticket){
			options.push({label: ticket.title, value: ticket._id});
		})
		return options;
	},
	logs(){
		const children = Tickets.find({parent:this._id});
		for (const child of children) {
			this.logs = [].concat(this.logs).concat(child.logs);
		}
		const logs = Logs.find({_id:{$in:this.logs}},{sort: {updatedAt: -1}}).fetch();
		logs.map(function(log){
			let users = Meteor.users.find().fetch().map((u)=>{return u.username});
			let userRegex = new RegExp('('+users.join('|')+')','ig');
			
			log.message = log.message.replace(/(BATA-[0-9]* \([\w*\s*]*\))/ig, '<span class="label label-primary">$1</span>');
			log.message = log.message.replace(userRegex, '<span class="label label-warning">$1</span>');
			return log;
		});
		return logs
	},
	handles(){
		return Handles.find({_id:{$in:this.handles}},{sort: {callsign: -1}}).fetch();
	},
	getStatusColor(){
		if (this.status === 'Gesloten') {
			color = '#f5f5f5';
		} else {
			switch(this.priority) {
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
	},
	isParent(){
		return Tickets.find({parent:this._id}).fetch().length > 0;
	}

});