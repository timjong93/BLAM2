Template.log.events({
	'click .btn-change-to-ticket'(event) {
		Blaze.renderWithData(Template.logToTicketModal, this, document.body);
	},
	'click .btn-ticket-log'(event) {
		console.log(this);
		Session.set('currentTicketId', this._id);
	},
	'click .btn-perform-action'(event) {
		Logs.update(this._id, { $set: { actionPerformed: true } });
	},
	'click .btn-undo-action'(event) {	
		Logs.update(this._id, { $set: { actionPerformed: false } });
	},
});

Template.log.helpers({
	isAction(log) {		
		return log.actionPerformed !== undefined;
	},
	btnClass(log) {
		if(log.actionPerformed !== undefined){
			if(log.actionPerformed){
				return 'btn-success';
			}else{
				return 'btn-invert';
			}
		}
		if(log.ticket){
			switch(log.ticket.priority) {
				case 2:
						return 'btn-danger';
				case 1:
						return 'btn-warning';				
				case 0:
						return 'btn-info';
				default:
						return 'btn-primary';
			}
		}
		return 'btn-invert';
	}
})