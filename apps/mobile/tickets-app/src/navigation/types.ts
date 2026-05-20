export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Dashboard: undefined;
  NewTicket: undefined;
  TicketDetails: { ticketId: string };
};
