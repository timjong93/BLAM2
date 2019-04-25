import '/imports/ui/plugins/common/common.min.js';
import '/imports/ui/plugins/bootstrap/js/bootstrap.bundle.min.js'
import '/imports/ui/custom.min.js';
import '/imports/ui/settings.js';
import '/imports/ui/gleek.js';
import '/imports/ui/stylesheets/custom.css';

import '/imports/ui/stylesheets/custom.css';

Template.main.onRendered ( function onMainRendered() {
    $('body').removeClass('login-body');

    // $('.scrollRow').perfectScrollbar();

});

Template.main.helpers({
    currentTicketId(){
        console.log(Session.get('currentTicketId'))
        return Session.get('currentTicketId')
    },
})