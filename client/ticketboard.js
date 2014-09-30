Tickets = new Mongo.Collection("tickets");

Session.setDefault('ticket_id', null);
Session.setDefault('editing_tickettitle', null);

// var ticketsHandle = Meteor.subscribe('tickets', function () {
//     if (!Session.get('ticket_id')) {
// 	var ticket = Tickets.findOne({}, {sort: {title: 1}});
// 	if (ticket) {
// 	    Router.setTicket(ticket._id);
// 	}
//     }
// });

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

Template.tickets.loading = function () {
    return false;//!ticketsHandle.ready();
}

Template.tickets.tickets = function () {
    return Tickets.find({}, {sort: {title: 1}});
}

Template.tickets.events({
    'mousedown .ticket': function (evt) {
	Router.setTicket(this._id);
    },
    'click .ticket': function (evt) {
	evt.preventDefault();
    },
    'dblclick .ticket': function (evt, tmpl) {
	Session.set('editing_tickettitle', this._id);
	Deps.flush();
	activateInput(tmpl.find("#ticket-title-input"));
    },
    'click .ticket-delete': function (evt, tmpl) {
	Tickets.remove(this._id);
    }
});

Template.tickets.events(okCancelEvents(
    "#new-ticket",
    {
	ok: function (text, evt) {
	    var id = Tickets.insert({title: text});
	    evt.target.value = "";
	}
    }));

Template.tickets.events(okCancelEvents(
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

Template.tickets.selected = function () {
    return Session.equals('ticket_id', this._id) ? 'selected' : '';
};

Template.tickets.title_class = function () {
    return this.title ? '' : 'empty';
};

Template.tickets.editing = function () {
    return Session.equals('editing_tickettitle', this._id);
};

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get("counter");
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set("counter", Session.get("counter") + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
