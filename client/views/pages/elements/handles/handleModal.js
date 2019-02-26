Template.handleModal.helpers({
	logs(handle_id) {
		console.log(handle_id);
		let logs = Logs.find({handles:handle_id},{sort: {createdAt: -1}}).fetch();
		logs.map(function(log){
			log.message = log.message.replace(/(BATA-[0-9]*)/ig, '<span class="label label-primary">$1</span>');
			log.ticket = Tickets.findOne({logs:log._id}, {fields: {title:1}});
			return log;
		});
		return logs
	  }
});