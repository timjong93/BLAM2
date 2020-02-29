import { Session } from 'meteor/session'

Template.topNavbar.events({
  'input #search-field': function (event, templateInstance) {
    Session.set('searchValue', event.currentTarget.value);
  },
  'click .btn-logout': function (event, templateInstance) {
    Meteor.logout();
  },
  'click .btn-syncGPSSettings': function (event, templateInstance) {
    Meteor.call('pushGPSSettings');
  },
  'click .light-mode':function(){
    let mode = $('body').attr('data-theme-version');
    if(mode == 'light'){
      $('body').attr('data-theme-version','dark');
    }else{
      $('body').attr('data-theme-version','light');
    }
  }
});

Template.topNavbar.helpers({
    username: function() {
      if(Meteor.user()) return Meteor.user().username;
      },
    function: function() {
      if(Meteor.user() && Meteor.user().profile) return Meteor.user().profile.function;
      },
    currentTime: function() {
        return Chronos.moment().format('HH:mm:ss');
    },
    error : function() {
      return Meteor.status().status !== "connected";
    }
});


