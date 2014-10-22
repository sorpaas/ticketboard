Session.setDefault('editing_tickettitle', null);

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

Template.ticketIndex.events({
    'dblclick .ticket': function (evt, tmpl) {
	Session.set('editing_tickettitle', this._id);
	Deps.flush();
	activateInput(tmpl.find("#ticket-title-input"));
    },
    'click .ticket-delete': function (evt, tmpl) {
	Tickets.remove(this._id);
    }
});

Template.ticketIndex.events(okCancelEvents(
    "#new-ticket",
    {
	ok: function (text, evt) {
	    var id = Tickets.insert({title: text});
	    evt.target.value = "";
	}
    }));

Template.ticketIndex.events(okCancelEvents(
    "#ticket-title-input",
    {
	ok: function (value) {
	    Tickets.update(this._id, {$set: {title: value}});
	    Session.set('editing_tickettitle', null);
	},
	cancel: function () {
	    Session.set('editing_tickettitle', null);
	}
    }));

Template.ticketIndex.selected = function () {
    return Session.equals('ticket_id', this._id) ? 'selected' : '';
};

Template.ticketIndex.title_class = function () {
    return this.title ? '' : 'empty';
};

Template.ticketIndex.editing = function () {
    return Session.equals('editing_tickettitle', this._id);
};
