Template.log.events({
	'click .close-modal'(event) {
		$("body>.modal-backdrop").remove();
	},
	'click .btn-change-to-ticket'(event) {
		Session.set('logToTicketId', event.currentTarget.id.replace('log_',''));
	},
	'click .btn-perform-action'(event) {
		console.log('perform action', event.currentTarget.id.replace('action_',''));
		
		Logs.update(event.currentTarget.id.replace('action_',''), { $set: { actionPerformed: true } });
	},
	'click .btn-undo-action'(event) {
		console.log('perform action', event.currentTarget.id.replace('action_',''));
		
		Logs.update(event.currentTarget.id.replace('action_',''), { $set: { actionPerformed: false } });
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