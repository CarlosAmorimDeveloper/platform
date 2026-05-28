import { subscribeToTickets } from './ticketService';

describe('ticketService', () => {
  it.todo('subscribeToTickets returns all tickets for admin users');
  it.todo('subscribeToTickets filters tickets by creator_id for standard users');
  it.todo('createTicket adds a new ticket to firestore');
  it.todo('updateTicket updates ticket fields in firestore');
  it.todo('deleteTicket removes ticket from firestore');
  it.todo('addComment adds a comment to ticket subcollection');
  it.todo('deleteComment removes a comment from ticket subcollection');
});
