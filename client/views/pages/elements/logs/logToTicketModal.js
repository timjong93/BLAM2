Template.logToTicketModal.onRendered(function(){
    let tmpl = this;
    $(tmpl.firstNode).modal('show'); //this will trigger the modal when it gets rendered.
});

Template.logToTicketModal.events({
    'click .close-modal'(event) {
		Blaze.remove(this);
	},
	'click .cnf-change-to-ticket'(event) {
		Tickets.insert({
			logs:[this._id],
			handles:this.handles
		},function(err,result){
			Session.set(
				'currentTicketId',
				result
			);
        });
	},
});