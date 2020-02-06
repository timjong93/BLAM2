import Tribute from "tributejs";


Template.logInput.onRendered(function logInputRendered (){
	this.autorun(function(){
        initTribute();
    }.bind(this));
    this.createLog= (ticketId)=>{
        let logHandles = [];
        
        let message = Template.instance().find('#log-message').textContent;
        if(!message) return;
        let messageHandles = message.match(/(BATA-[0-9]*)/ig);
        
        if (messageHandles) {
            messageHandles.forEach(function(handle){
                var handle = Handles.findOne({callsign:{'$regex':handle, '$options' : 'i'}});
                logHandles.push(handle._id);
            });
        }
        
        if(ticketId){
            Logs.insert({
                message: message,
                handles:logHandles
            }, function(err, result){
                Tickets.update({ _id: ticketId },{ $push: { logs: result, handles: { $each: logHandles } } });
            });
        }else{
            Logs.insert({
                message: message,
                handles:logHandles
            });
        }
        
        Template.instance().find('#log-message').innerHTML = "";
    };        
});

const initTribute = function(){
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
					return '<span class="label label-primary" contenteditable="false"><a>' + item.original.key + ' (' +item.original.value + ')</a></span>';
				}
			}
			return item.original.value;
		},
		menuItemTemplate: function (item) {
            if(item.original.col == 'users'){
			    return '<i class="fa fa-user"></i> '+item.string;
            }else{
			    return '<i class="fa fa-car"></i> '+ item.string;
            }
		}
	});
	this.tribute.attach(Template.instance().find('.log-message'));
	
}

Template.logInput.events({
    'keydown .log-message'(event, templateInstance) {
        if(event.keyCode == 13)
        {
            event.preventDefault();           
            if(templateInstance.data){
                templateInstance.createLog(templateInstance.data.ticket_id);
            }else{
                templateInstance.createLog()
            }
        }
    },
    'click #new-log-btn'(event, templateInstance) {
        // Prevent default browser form submit
        event.preventDefault();
        if(templateInstance.data){
            templateInstance.createLog(templateInstance.data.ticket_id);
        }else{
            templateInstance.createLog()
        }
    },
    'click #new-action-btn'(event) {
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
                handles:logHandles,
                actionPerformed:false
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
        // Prevent default browser form submit
        event.preventDefault();
        
        let logHandles = [];
        
        let message = document.getElementById('log-message').textContent;
        if(!message) return;
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
            $('.slimScrollDivLogsDetail').slimScroll({
                height: 'auto'
            });
        }
    });
    