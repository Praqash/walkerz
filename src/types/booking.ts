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
  rooms: Room[];
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

export type SavedBookingOrder = BookingDetails & {
  id: string;
  createdAt: string;
};

export type RoomBookingAvailability = {
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  paymentId: string;
  paidAt: string;
};
