Template.handles.onCreated(function handlesOnCreated() {
  let template = Template.instance();
  template.searchQuery = new ReactiveVar();
  template.selected = new ReactiveVar();
  this.autorun(function(){
  		let handle = Handles.findOne()
  		if(handle){
	    template.selected.set(handle._id);

  		}
  	}.bind(this));
});

Template.handles.events({
  'input #search': function (event, template) {
    Template.instance().searchQuery.set(event.currentTarget.value);
  },
  'click .handle_row': function(e, t) {
  	Template.instance().selected.set($(e.target).closest('tr').data('id'));
}
});
 
Template.handles.helpers({
	handles() {
		if(Template.instance().searchQuery.get() && Template.instance().searchQuery.get().length > 0){
			var arrHandles = Handles.find({$or:[{callsign:{'$regex':Template.instance().searchQuery.get(), '$options' : 'i'}},{name:{'$regex':Template.instance().searchQuery.get(), '$options' : 'i'}}]},{sort: {callsign: 1}}).fetch();
		}else{
			var arrHandles = Handles.find({},{sort: {callsign: 1}}).fetch();
		}
		if (arrHandles) {
			arrHandles = _.groupBy(arrHandles, 'subnet');
			var arrResult  = []
			for(var k in arrHandles){
				arrResult.push({'subnet':k, handles: arrHandles[k]})
			}
			console.log(arrResult);
			return arrResult;
		}
	  },
	selectedHandle() {
		return Handles.findOne({_id:Template.instance().selected.get()});
	}
});

Template.registerHelper('formatTime', function(date) {
  return moment(date).format('HH:mm');
});

Template.handle_modal.helpers({
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

Template.handle_modal.rendered = function(){
	  $('.scrollRow').perfectScrollbar();
	};