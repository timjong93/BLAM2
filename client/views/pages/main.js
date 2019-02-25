import '/imports/ui/plugins/common/common.min.js';
import '/imports/ui/plugins/bootstrap/js/bootstrap.bundle.min.js'
import '/imports/ui/custom.min.js';
import '/imports/ui/settings.js';
import '/imports/ui/gleek.js';
import '/imports/ui/stylesheets/custom.css';

import '/imports/ui/stylesheets/custom.css';

Template.main.rendered = function(){
    $('body').removeClass('login-body');

    $('.scrollRow').perfectScrollbar();

}

Template.login.rendered = function(){
        //Make body 100%
        $('html').addClass('h-100');
        $('body').addClass('h-100');
        $('body').addClass('login-body');
}