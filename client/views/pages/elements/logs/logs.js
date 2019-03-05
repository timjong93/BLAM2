
Template.logs.onCreated(function handlesOnCreated() {
  let template = Template.instance();
  template.searchQuery = new ReactiveVar();
});

Template.logs.events({
  'input #search_logs': function (event, templateInstance) {
    Template.instance().searchQuery.set(event.currentTarget.value);
	},
	'click .ticket-chat': function (event, templateInstance) {
		Session.set(
			'currentTicketId',
			event.currentTarget.id.replace('tc_','')
		);
	}
});

Template.logs.onRendered(function logsOnRendered(){
	$('.slimScrollDivLogs').slimScroll({
		height: 'auto'
	})
});

Template.logs.helpers({
	logs() {
		let searchQuery = Session.get('searchValue')
		if(searchQuery && searchQuery.length > 0){
			var logs = Logs.find({
					$or:[
						{message:{'$regex':searchQuery, '$options' : 'i'}},
						{title:{'$regex':searchQuery, '$options' : 'i'}}
					]
				},{sort: {updatedAt: -1}}).fetch();
		}else{
			var logs = Logs.find({},{sort: {updatedAt: -1}}).fetch();
		}
		if (logs) {
			logs.map(function(log){
				let users = Meteor.users.find().fetch().map((u)=>{return u.username});
				let userRegex = new RegExp('('+users.join('|')+')','ig');
				
				log.message = log.message.replace(/(BATA-[0-9]*)/ig, '<span class="label label-primary">$1</span>');
				log.message = log.message.replace(userRegex, '<span class="label label-warning">$1</span>');
	      log.ticket = Tickets.findOne({logs:log._id}, {fields: {title:1, priority:1}});
				return log;
			});
			return logs;
		}
	}
});