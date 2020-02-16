//initally show vehicle drawer closed
Template.handles.open = false

Template.handles.onCreated(function vehicleListOnCreated() {
  this.searchQuery = new ReactiveVar();
});

Template.handles.onRendered(function vehicleListOnRendered(){
  $('.sidebar-right .vehicleList').slimScroll({
    height: '90vh'
  })
});

Template.handles.events({
  'click .sidebar-right-trigger' (event) {
    if(Template.handles.open){
      $('.sidebar-right').addClass('show')
    } else {
      $('.sidebar-right').removeClass('show')
    }
    Template.handles.open = !Template.handles.open
  },
  'input #vehicle-search': function (event, templateInstance) {
    Template.instance().searchQuery.set(event.target.value);
  },

})

Template.handles.helpers({
  notificationActive(handles){
    for (const subnet of handles) {
      if(subnet.handles.filter(handle => (handle.lastLogNotify)).length > 0) return true;
    }
    return false;
  },
  handles(){
    let searchQuery = Template.instance().searchQuery.get();
    if(searchQuery){
      var arrHandles = Handles.find({
        $or:[
          {name:{'$regex':searchQuery, '$options' : 'i'}},
          {callsign:{'$regex':searchQuery, '$options' : 'i'}}
        ]
      },{sort: {callsign: 1}}).fetch();
    }else{
      var arrHandles = Handles.find({},{sort: {callsign: 1}}).fetch();
    }
    if (arrHandles) {
      arrHandles = _.groupBy(arrHandles, 'subnet');
      var arrResult  = []
      for(var k in arrHandles){
        arrHandles[k].map(function(handle){
          handle.lastLogNotify = false;
          if (handle.lastLogLimit && (Chronos.moment(handle.lastLog).add(handle.lastLogLimit, 'm') < Chronos.moment())) {
            handle.lastLogNotify = true;
          }
          return handle;
        })
        arrResult.push({
          subnet:k, 
          handles: arrHandles[k]
        })
      }
      // Tooltips demo
      $("[data-toggle=tooltip]").tooltip();
      return arrResult;
    }
  }
});