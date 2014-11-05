Session.setDefault('editing_ticket_title', null);
Session.setDefault('editing_comment', null);

Template.ticketShow.events({
  'click #ticket-close': function() {
    Tickets.update(this.ticket._id, {
      $set: {closed: true}
    });
    Router.go('/');
  },
  'click #ticket-back': function() {
    Router.go('/');
  },
  'click #comment-submit': function(evt, template) {
    var element = template.find("#comment-new");
    if(element.value) {
      Tickets.update(this.ticket._id, {
        $push: {comments: {
          type: "message",
          message: element.value,
          user_id: Meteor.user()._id,
          createdAt: new Date().valueOf()
        }}
      });
      element.value = "";
    }
  },
  'click #edit-ticket-title': function(evt, template) {
    Session.set('editing_ticket_title', this.ticket._id);
  },
  'click #save-ticket-title': function(evt, template) {
    var element = template.find("#title-input");
    if(element.value) {
      Tickets.update(this.ticket._id, {
        $set: {title: element.value }
      });
    }
    Session.set('editing_ticket_title', null);
  },
  'click #edit-comment': function(evt, template) {
    Session.set('editing_comment', this.createdAt);
  },
  'click #save-comment': function(evt, template) {
    var element = template.find("#comment-edit-input");
    if(element.value) {
      this.message = element.value;
      this.updatedAt = (new Date()).valueOf();

      Tickets.update(template.data.ticket._id, {
        $set: {
          comments: template.data.ticket.comments
        }
      });
    }
    Session.set('editing_comment', null);
  }
});

Template.ticketShow.helpers({
  createdAtString: function() {
    return moment(new Date(this.createdAt)).fromNow();
  },
  editingTitle: function() {
    if(this.ticket)
      return Session.equals('editing_ticket_title', this.ticket._id);
    else
      return false;
  },
  editingComment: function() {
    return Session.equals('editing_comment', this.createdAt);
  },
  notEditing: function() {
    return Session.equals('editing_comment', null) && Session.equals('editing_ticket_title', null);
  },
  username: function() {
    if(!this.user_id) {
      return "Someone";
    }

    var user = Meteor.users.findOne(this.user_id);
    if(!user) {
      return "Someone";
    }

    return user.username;
  }
});
