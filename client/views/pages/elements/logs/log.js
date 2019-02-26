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
	}
})