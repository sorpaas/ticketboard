Router.route('', function() {
    this.render('ticketIndex');
});

Router.route('/tickets', function() {
    this.render('ticketIndex');
});

Router.route('/tickets/:_id', function() {
    this.render('ticketShow', {
	data: function() {
	  return {
            ticket: Tickets.findOne(this.params._id)
          }
	}
    });
});

Router.route('/about');
