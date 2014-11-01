var okCancelEvents = function (selector, callbacks) {
  var ok = callbacks.ok || function () {};
  var cancel = callbacks.cancel || function () {};

  var events = {};
  events['keyup ' + selector + ', keydown ' + selector + ', focusout ' + selector] =
    function (evt) {
      if (evt.type === "keydown" && evt.which === 27) {
        cancel.call(this, evt);
      } else if (evt.type === "keyup" &&
                 evt.which === 13 ||
                 evt.type === "focusout") {
        var value = String(evt.target.value || "");
        if (value) {
          ok.call(this, value, evt);
        } else {
          cancel.call(this, evt);
        }
      }
    };

  return events;
}

var activateInput = function (input) {
  input.focus();
  input.select();
}

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
          createdAt: new Date().valueOf()
        }}
      });
      element.value = "";
    }
  }
});

Template.ticketShow.helpers({
  createdAtString: function() {
    return moment(new Date(this.createdAt)).fromNow();
  }
})
