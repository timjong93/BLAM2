
Template.logs.onCreated(function handlesOnCreated() {
	this.limit = new ReactiveVar(30);

	this.autorun(() => {
		this.subscribe(
			'logs',
			this.limit.get(),
			Session.get('searchValue')
		);
	});
});

Template.logs.onRendered(function logsOnRendered() {
	$('.slimScrollDivLogs').slimScroll({
		height: 'auto',
	})
});

Template.logs.events({
	// set meteor session active ticket
	'click .ticket-chat': function (event, templateInstance) {
		Session.set(
			'currentTicketId',
			event.currentTarget.id.replace('tc_', '')
		);
	},
	// Change limit of log subscription when end of scrollbox is reached to create a infinitescroll effect
	'scroll .slimScrollDivLogs': function (event, templateInstance) {
		let listElem = event.currentTarget;
		if (listElem.scrollTop + listElem.clientHeight >= listElem.scrollHeight) {
			templateInstance.limit.set(templateInstance.limit.get() + 10);
		}
	}
});

Template.logs.helpers({
	logs() {
		let logs = Logs.find({}, { sort: { updatedAt: -1 } }).fetch();
		if (logs) {
			return logs.map(decorateLogMessage);
		}
	}
});

/**
 *	Decorate log messages by replacing references to handles and username with html labels
 *
 * @param {Log} log
 * @returns {Log} log
 */
const decorateLogMessage = (log) => {
	let users = Meteor.users.find().fetch().map((u) => { return u.username });
	let userRegex = new RegExp('(' + users.join('|') + ')', 'ig');
	log.message = log.message.replace(/(BATA-[0-9]* \([\w*\s*]*\))/ig, '<span class="label label-primary">$1</span>');
	log.message = log.message.replace(userRegex, '<span class="label label-warning">$1</span>');
	log.ticket = Tickets.findOne({ logs: log._id }, { fields: { title: 1, priority: 1 } });
	return log;
}