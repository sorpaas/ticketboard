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

Template.ticketShow.events(okCancelEvents(
  "#comment-new",
  {
    ok: function (text, evt) {
      console.log(this.ticket);
      Tickets.update(this.ticket._id, {
        $push: {comments: {
          type: "message",
          message: text
        }}
      });
      evt.target.value = "";
    }
  }));
