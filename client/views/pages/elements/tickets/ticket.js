
Template.ticket.helpers({
    children(){
        return Tickets.find({parent:this._id}).fetch()
    },
    getStatusColor(){
        switch(this.priority) {
            case 2:
            return 'icon-danger';
            case 1:
            return 'icon-warning';				
            case 0:
            return 'icon-info';
            default:
            return 'icon-primary';
        }
    },
    isActive(){
        return this._id == Session.get('currentTicketId')
    },
    notify(){        
        return Logs.find({$and:[{_id:{$in:this.logs}},{actionPerformed:{$exists:true}},{actionPerformed:false}]}).fetch().length > 0;
    }
})

Template.ticket.events({
    'click .ticket-link'(event) {
        Session.set(
            'currentTicketId',
            this._id
        );
        /*
        * This be fixed at a later date
        * Somehow height rendering from the scroller library is fired after the render of the template now allowing
        * the height to be properly calculated = S
        */
        window.setTimeout(function () {
            $('.slimScrollDivLogsDetail').slimScroll({
                height: 'auto',
            });
        }, 1)
    }
});