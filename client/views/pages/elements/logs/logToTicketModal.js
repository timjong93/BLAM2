Template.logToTicketModal.onRendered(function(){
    let tmpl = this;
    $(tmpl.firstNode).modal('show'); //this will trigger the modal when it gets rendered.
});

Template.logToTicketModal.events({
    'click .close-modal'(event, template) {
		deleteModal(template);
	},
	'click .cnf-change-to-ticket'(event, template) {
		Tickets.insert({
			logs:[this._id],
			handles:this.handles
		},function(err,result){
			Session.set(
				'currentTicketId',
				result
			);
		});
		deleteModal(template);
	},
	'click .cnf-append-to-ticket'(event, template) {
		console.log($('#ticketToAppend')[0].value);
		Tickets.update({
			_id: $('#ticketToAppend')[0].value},
			{ $push: { logs: this._id, handles: { $each: this.handles } } 
		});
		deleteModal(template);
	},
});

Template.logToTicketModal.helpers({
	ticketOptions() {
		let options = [];
		Tickets.find({}).fetch().forEach(function(ticket){
			options.push({label: ticket.title, value: ticket._id});
		})
		return options;
	},
})

const deleteModal = (t) => {
	Blaze.remove(t.view);
	$('.modal-backdrop').remove()
}