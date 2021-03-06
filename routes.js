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

if (Meteor.isServer) {
  var Busboy = Meteor.npmRequire("busboy"),
      fs = Npm.require("fs"),
      os = Npm.require("os"),
      path = Npm.require("path");

  Router.onBeforeAction(function (req, res, next) {
    var filenames = []; // Store filenames and then pass them to request.

    if (req.method === "POST") {
      var busboy = new Busboy({ headers: req.headers });
      busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
        var saveTo = path.join(os.tmpDir(), filename);
        file.pipe(fs.createWriteStream(saveTo));
        filenames.push(saveTo);
      });
      busboy.on("field", function(fieldname, value) {
        req.body[fieldname] = value;
      });
      busboy.on("finish", function () {
        // Pass filenames to request
        req.filenames = filenames;
        next();
      });
    }
    // Pass request to busboy
    req.pipe(busboy);
 });
}
