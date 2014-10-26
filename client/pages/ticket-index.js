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

Template.ticketIndex.tickets = function () {
    return Tickets.find({}, {sort: {title: 1}});
}

Template.ticketIndex.events(okCancelEvents(
    "#ticket-new",
    {
	ok: function (text, evt) {
	    var id = Tickets.insert({title: text});
	    evt.target.value = "";
	}
    }));
