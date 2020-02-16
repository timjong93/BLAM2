Template.handle.events({
    'click .gps-trigger': function(event, templateInstance) {
        Meteor.call('triggerLocationRefresh', this.motoTrboId);
    },
    'click .vehicle-detail-trigger': function(event, templateInstance) {
        Blaze.renderWithData(Template.handleDetail, this, document.body);
    }
});