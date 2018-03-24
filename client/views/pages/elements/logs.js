
Template.logs.onCreated(function handlesOnCreated() {
  let template = Template.instance();
  template.searchQuery = new ReactiveVar();
});

Template.logs.events({
  'input #search_logs': function (event, template) {
    Template.instance().searchQuery.set(event.currentTarget.value);
  },
});


Template.log_input.rendered = function(){
	this.autorun(function(){
	    initTribute();
  	}.bind(this));
	
};

var initTribute = function(){
	let handles = Handles.find({},{sort: {callsign: 1}}).fetch().map(function(h){return {key:h.callsign,value:h.name}});
	if (! Template.instance().find('#log-message').hasAttribute("data-tribute")) {
	     this.tribute = new Tribute({
		  values: handles,
		  // template for displaying item in menu
		  menuItemTemplate: function (item) {
		    return item.original.key+' - '+item.original.value;
		  },
		  selectTemplate: function (item) {
		    return '<span class="label label-primary" contenteditable="false">'+ item.original.key + '</span>';
		  },
		  trigger:'B',
		});
		tribute.attach(Template.instance().find('#log-message'));
	}else{
		this.tribute.append(0,handles,true)
	}
	
}

Template.log_input.events({
  'click #new-log-btn'(event) {
  	console.log('new-log-btn clicked');

    // Prevent default browser form submit
    event.preventDefault();

    let ticket_id = this.ticket_id;
    let logHandles = [];

    let message = Template.instance().find('#log-message').textContent;
    let messageHandles = message.match(/(BATA-[0-9]*)/ig);

    if (messageHandles) {
	    messageHandles.forEach(function(handle){
	    	var handle = Handles.findOne({callsign:{'$regex':handle, '$options' : 'i'}});
	    	logHandles.push(handle._id);
	    });
    }

    if(this.ticket_id){
    	Logs.insert({
	      message: message,
	      handles:logHandles
	    }, function(err, result){
	    	Tickets.update({ _id: ticket_id },{ $push: { logs: result, handles: { $each: logHandles } } });
	    });
    }else{
	    Logs.insert({
	      message: message,
	      handles:logHandles
	    });
    }
    
    Template.instance().find('#log-message').innerHTML = "";
  },
  'click #new-ticket-btn'(event) {
  	console.log('new-ticket-btn clicked')
    // Prevent default browser form submit
    event.preventDefault();

    let logHandles = [];

    let message = document.getElementById('log-message').textContent;
    let messageHandles = message.match(/(BATA-[0-9]*)/ig);

    if (messageHandles) {
	    messageHandles.forEach(function(handle){
	    	var handle = Handles.findOne({callsign:{'$regex':handle, '$options' : 'i'}});
	    	logHandles.push(handle._id);
	    });
    }

    Logs.insert({
      message: message,
      handles:logHandles
    }, function(err, result){
    	Tickets.insert({
    		logs:[result],
    		handles:logHandles
    	});
    });
    
    Template.instance().find('#log-message').innerHTML = "";
  }
});

Template.logs.helpers({
	logs() {
		if(Template.instance().searchQuery.get() && Template.instance().searchQuery.get().length > 0){
			var logs = Logs.find({message:{'$regex':Template.instance().searchQuery.get(), '$options' : 'i'}},{sort: {createdAt: -1}}).fetch();
		}else{
			var logs = Logs.find({},{sort: {createdAt: -1}}).fetch();
		}
		if (logs) {
			logs.map(function(log){
				log.message = log.message.replace(/(BATA-[0-9]*)/ig, '<span class="label label-primary">$1</span>');
	        	log.ticket = Tickets.findOne({logs:log._id}, {fields: {title:1}});
				return log;
			});
			console.log(logs)
			return logs;
		}
	},
});	