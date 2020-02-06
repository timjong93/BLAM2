Template.handles.onCreated(function handlesOnCreated() {
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

Template.handles.events({
    'input #search': function (event, templateInstance) {
        Template.instance().searchQuery.set(event.currentTarget.value);
    },
    'click .handle_row': function(event, templateInstance) {
        Template.instance().selected.set($(event.target).closest('tr').data('id'));
    }
});

Template.handles.helpers({
    handles() {
        if(Template.instance().searchQuery.get() && Template.instance().searchQuery.get().length > 0){
            var arrHandles = Handles.find({$or:[{callsign:{'$regex':Template.instance().searchQuery.get(), '$options' : 'i'}},{name:{'$regex':Template.instance().searchQuery.get(), '$options' : 'i'}}]},{sort: {callsign: 1}}).fetch();
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
    },
    selectedHandle() {
        return Handles.findOne({_id:Template.instance().selected.get()});
    }
});

Template.registerHelper('formatTime', function(date) {
    return moment(date).format('HH:mm');
});