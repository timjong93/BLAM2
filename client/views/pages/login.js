Template.login.onRendered (function onLoginRendered(){
    //Make body 100%
    $('html').addClass('h-100');
    $('body').addClass('h-100');
    $('body').addClass('login-body');
});

Template.login.events({
    'submit .login-form': function (event) {
        event.preventDefault();
        var username = event.target.username.value;
        var password = event.target.password.value;
        
        Meteor.loginWithPassword({username:username},password,function(err){
            if(!err) {
                Router.go('/');
            }
        });
    }
});