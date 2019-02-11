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