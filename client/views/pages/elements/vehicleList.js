Template.vehicleList.open = false

Template.vehicleList.rendered = function(){
  $('.sidebar-right .vehicleList').slimScroll({
    height: '40vh'
  })
}

Template.vehicleList.events({
  'click .sidebar-right-trigger' (event) {
    if(Template.vehicleList.open){
      $('.sidebar-right').addClass('show')
    } else {
      $('.sidebar-right').removeClass('show')
    }
    Template.vehicleList.open = !Template.vehicleList.open
  }
})

Template.vehicleList.helpers({
  handles(){
    var arrHandles = Handles.find({},{sort: {callsign: 1}}).fetch();
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
      console.log(arrResult);
      return arrResult;
    }
  }
})