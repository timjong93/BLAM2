Template.handle.events({
    'click .gps-trigger': function(event, templateInstance) {
        Meteor.call('triggerLocationRefresh', this.motoTrboId);
    },
    'click .vehicle-detail-trigger': function(event, templateInstance) {
        Blaze.renderWithData(Template.handleDetail, this, document.body);
    }
});

Template.handle.helpers({
    showLocationTrigger() {
        console.log(this);
        return this.radio && this.motoTrboId && this.manualLocationTrigger
    }
})