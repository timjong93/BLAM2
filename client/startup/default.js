import '/imports/api/logs.js';
import '/imports/api/handles.js';
import '/imports/api/tickets.js';

// Run this when the meteor app is started
Meteor.startup(function () {

	toastr.options = {
	  "closeButton": true,
	  "debug": false,
	  "newestOnTop": true,
	  "progressBar": true,
	  "positionClass": "toast-top-right",
	  "preventDuplicates": true,
	  "onclick": null,
	  "showDuration": "300",
	  "hideDuration": "1000",
	  "timeOut": "5000",
	  "extendedTimeOut": "1000",
	  "showEasing": "swing",
	  "hideEasing": "linear",
	  "showMethod": "fadeIn",
	  "hideMethod": "fadeOut"
	}

	var now = new Date();
	Tickets.find({$and:[{updatedBy:{$not:Meteor.userId()}}]}).observe({
	    added: function(document){ 
	    	if (document.updatedAt > now) {
	    		toastr.warning(document.title, 'New Ticket:');
	    	} 
	    },
	    changed:function(new_document, old_document){
	        toastr.info(new_document.title, 'Ticket updated:');
	    }
	});
});