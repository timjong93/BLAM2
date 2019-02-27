Template.log.events({
	'click .close-modal'(event) {
		$("body>.modal-backdrop").remove();
	},
	'click .cnf-change-to-ticket'(event) {
		let log = Logs.findOne({_id:event.currentTarget.id.replace('log_','')});
		Tickets.insert({
			logs:[log._id],
			handles:log.handles
		},function(err,result){
			Session.set(
				'currentTicketId',
				result
			);
		});
		$("body>.modal-backdrop").remove();
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
				case 'Hoog':
						return 'btn-danger';
				case 'Normaal':
						return 'btn-warning';				
				case 'Laag':
						return 'btn-info';
				default:
						return 'btn-primary';
			}
		}
		return 'btn-invert';
	}
})