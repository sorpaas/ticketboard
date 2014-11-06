// Tickets -- {name: String}
Tickets = new Mongo.Collection("tickets");

Meteor.methods({
  changeUsername: function(username) {
    Meteor.users.update(Meteor.userId(), { $set: { username: username }});
  }
});
