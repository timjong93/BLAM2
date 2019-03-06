import { Session } from "meteor/session";

Template.logToTicketModal.helpers({
    logToConvert(){
        return Session.get('logToTicketId');
    }
})

Template.logToTicketModal.events({
    'click .close-modal'(event) {
		$("body>.modal-backdrop").remove();
	},
	'click .cnf-change-to-ticket'(event) {
		let log = Logs.findOne({_id:Session.get('logToTicketId')});
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
});