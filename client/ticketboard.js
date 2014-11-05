Tickets = new Mongo.Collection("tickets");

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
})
