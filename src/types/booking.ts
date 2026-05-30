export type Room = {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  bedType: string;
  amenities: string[];
};

export type BookingDetails = {
  room: Room;
  guestName: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  total: number;
  transactionId: string;
  razorpayOrderId: string;
  paymentId: string;
  paidAt: string;
};
