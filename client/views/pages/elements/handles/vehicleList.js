//initally show vehicle drawer closed
Template.vehicleList.open = false

Template.vehicleList.onCreated(function vehicleListOnCreated() {
  let template = Template.instance();
  template.searchQuery = new ReactiveVar();
  template.selected = new ReactiveVar();
  this.autorun(function(){
  		let handle = Handles.findOne()
  		if(handle){
	    template.selected.set(handle._id);

  		}
  	}.bind(this));
});

Template.vehicleList.onRendered(function vehicleListOnRendered(){
  $('.sidebar-right .vehicleList').slimScroll({
    height: '40vh'
  })
});

Template.vehicleList.events({
  'click .sidebar-right-trigger' (event) {
    if(Template.vehicleList.open){
      $('.sidebar-right').addClass('show')
    } else {
      $('.sidebar-right').removeClass('show')
    }
    Template.vehicleList.open = !Template.vehicleList.open
  },
  'input #vehicle-search': function (event, templateInstance) {
    console.log(event);
    Template.instance().searchQuery.set(event.target.value);
  },
  'click .vehicle-row': function(event, templateInstance) {
    console.log(e.currentTarget.id);
  	Session.set('currentVehicleId', event.currentTarget.id);
}
})

Template.vehicleList.helpers({
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
})

Template.vehicleDetail.helpers({
  vd(){
    return Handles.findOne({_id:Session.get('currentVehicleId')})
  }
})