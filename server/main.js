import { Meteor } from 'meteor/meteor';
import '/imports/api/logs.js';
import '/imports/api/handles.js';
import '/imports/api/tickets.js';
import '/imports/api/users.js';

Meteor.startup(() => {

	Accounts.onCreateUser(function (options, user) {
	    user.profile = {};
	    // create a empty array to avoid the Exception while invoking method 'adminCheckAdmin' 
	    user.emails = [];
	    return user;
	});
});