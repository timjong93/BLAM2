import Tribute from "tributejs";

Template.logs.onCreated(function handlesOnCreated() {
  let template = Template.instance();
  template.searchQuery = new ReactiveVar();
});

Template.logs.events({
  'input #search_logs': function (event, template) {
    Template.instance().searchQuery.set(event.currentTarget.value);
	},
	'click .ticket-chat'(e) {
		Session.set(
			'currentTicketId',
			e.currentTarget.id.replace('tc_','')
		);
	}
});


Template.log_input.rendered = function(){
	this.autorun(function(){
	    initTribute();
  	}.bind(this));
	
};

var initTribute = function(){
	let handles = Handles.find({},{sort: {callsign: 1}}).fetch().map(function(h){return {key:h.callsign,value:h.name, col:'handles'}});
	let users = Meteor.users.find({},{sort:{username:1}}).fetch().map(function(u){return {key:u.username,value:u.username, col:'users'}});
	if (this.tribute) {
		this.tribute.detach(Template.instance().find('.log-message'));
	}
	this.tribute = new Tribute({
		autocompleteMode: true,
		values: handles.concat(users),
		selectTemplate: function (item) {
			if (typeof item === 'undefined') return null;
			if (this.range.isContentEditable(this.current.element)) {
				if(item.original.col == 'users'){
					return '<span class="label label-warning" contenteditable="false"><a>' + item.original.key + '</a></span>';
				}else{
					return '<span class="label label-primary" contenteditable="false"><a>' + item.original.key + '</a></span>';
				}
			}
			return item.original.value;
		},
		menuItemTemplate: function (item) {
			return item.string;
		}
	});
	this.tribute.attach(Template.instance().find('.log-message'));
	
}

Template.log_input.events({
  'click #new-log-btn'(event) {
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
    	},function(err,result){
				Session.set(
					'currentTicketId',
					result
				);
			});
    });
    
		Template.instance().find('#log-message').innerHTML = "";
  }
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
				},{sort: {createdAt: -1}}).fetch();
		}else{
			var logs = Logs.find({},{sort: {createdAt: -1}}).fetch();
		}
		if (logs) {
			logs.map(function(log){
				log.message = log.message.replace(/(BATA-[0-9]*)/ig, '<span class="label label-primary">$1</span>');
	        	log.ticket = Tickets.findOne({logs:log._id}, {fields: {title:1}});
				return log;
			});
			return logs;
		}
	}
});	

Template.ticket_log.helpers({
	getStatusColor(status, priority){
		if (status === 'Gesloten') {
			color = '#f5f5f5';
		} else {
			switch(priority) {
			    case 'Hoog':
			        color = '#ed5565';
			        break;
			    case 'Normaal':
			        color = '#f8ac59';
			        break;
			    case 'Laag':
			        color = '#1c84c6';
			        break;
			    default:
			        color = '#f5f5f5';
			}
		}
		return color;
	}
});

Template.log.events({
	'click .close-modal'(e) {
		$("body>.modal-backdrop").remove();
	},
	'click .cnf-change-to-ticket'(e) {
		let log = Logs.findOne({_id:e.currentTarget.id.replace('log_','')});
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
	}
});