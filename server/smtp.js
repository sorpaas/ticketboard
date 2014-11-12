Meteor.startup(function() {
  process.env.MAIL_URL = 'smtp://sorpaasemail:email718281@smtp.sendgrid.net:587';
});

Meteor.methods({
  emailTicketChange: function(title, content) {
    Meteor.users.find().forEach(function(user) {
      Email.send({
        from: "sorpaas@gmail.com",
        to: user.emails[0].address,
        subject: "[Ticketboard] " + title,
        text: content
      });
      console.log("Email of " + title + " sent to " + user.emails[0].address + ".");
    });
  }
});
