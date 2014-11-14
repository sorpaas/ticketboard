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

Router.route('/login');

Router.route('/inbound', function() {
  post = this.request.body;
  console.log(JSON.stringify(this.request.body));
  title = post.subject;
  first_comment = post.text || post.html;

  Tickets.insert({title: title,
                  createdAt: new Date().valueOf(),
                  comments: [ { type: "message",
                                message: first_comment,
                                createdAt: new Date().valueOf() } ]
                 });

  this.response.end('Success.');
}, { where: 'server' });

Router.onBeforeAction(function() {
  if (! Meteor.userId()) {
    this.render('login');
  } else {
    this.next();
  }
}, { except: [ 'inbound' ] });
