Template.handleDetail.onRendered(function(){
    let tmpl = this;
    $(tmpl.firstNode).modal('show'); //this will trigger the modal when it gets rendered.
  });

Template.handleDetail.events({ 
    'click .close-modal': function(event, template) { 
        Blaze.remove(this);
    } 
});

Template.handleDetail.helpers({
    logs() {
        let logs = Logs.find({handles:this._id},{sort: {createdAt: -1}}).fetch();
        logs.map(function(log){
            let users = Meteor.users.find().fetch().map((u)=>{return u.username});
            let userRegex = new RegExp('('+users.join('|')+')','ig');
            
            log.message = log.message.replace(/(BATA-[0-9]* \([\w*\s*]*\))/ig, '<span class="label label-primary">$1</span>');
            log.message = log.message.replace(userRegex, '<span class="label label-warning">$1</span>');
            log.ticket = Tickets.findOne({logs:log._id}, {fields: {title:1}});
            return log;
        });
        return logs
        }
  })