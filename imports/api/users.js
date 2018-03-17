Meteor.publish('userData', function () {
  return Meteor.users.find({}, {fields: {username:1, profile: 1}});
});