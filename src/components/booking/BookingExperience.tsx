"use client";

import { useMemo, useState } from "react";
import { rooms } from "@/data/rooms";
import type { BookingDetails, Room } from "@/types/booking";
import BookingPanel from "./BookingPanel";
import RoomList from "@/components/rooms/RoomList";
import SectionHeader from "@/components/ui/SectionHeader";
import TransactionSummary from "@/components/transaction/TransactionSummary";

type BookingFormState = {
  guestName: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: number;
};

const initialFormState: BookingFormState = {
  guestName: "",
  email: "",
  checkIn: "",
  checkOut: "",
  guests: 1,
};

const getNights = (checkIn: string, checkOut: string) => {
  if (!checkIn || !checkOut) {
    return 0;
  }

  const difference = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return difference > 0 ? Math.ceil(difference / 86400000) : 0;
};

const createTransactionId = () => `WLK-${Date.now().toString().slice(-8)}`;

export default function BookingExperience() {
  const [selectedRoom, setSelectedRoom] = useState<Room>(rooms[0]);
  const [formState, setFormState] = useState<BookingFormState>(initialFormState);
  const [booking, setBooking] = useState<BookingDetails | null>(null);

  const nights = useMemo(() => getNights(formState.checkIn, formState.checkOut), [formState.checkIn, formState.checkOut]);
  const total = nights * selectedRoom.pricePerNight;
  const canSubmit = Boolean(formState.guestName.trim() && formState.email.trim() && nights > 0 && total > 0);

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setFormState((current) => ({
      ...current,
      guests: Math.min(current.guests, room.maxGuests),
    }));
  };

  const handleFieldChange = (field: keyof BookingFormState, value: string | number) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    setBooking({
      room: selectedRoom,
      guestName: formState.guestName.trim(),
      email: formState.email.trim(),
      checkIn: formState.checkIn,
      checkOut: formState.checkOut,
      guests: formState.guests,
      nights,
      total,
      transactionId: createTransactionId(),
    });
  };

  return (
    <section className="section" aria-label="Walkerz booking experience">
      <div className="container grid two-column">
        <div id="rooms">
          <SectionHeader
            eyebrow="Available rooms"
            title="Pick the room that fits your Manali trip"
            description="Each room is configured from shared data so the listing, booking, and transaction details stay consistent."
          />
          <RoomList rooms={rooms} selectedRoomId={selectedRoom.id} onSelectRoom={handleSelectRoom} />
        </div>

        <BookingPanel
          room={selectedRoom}
          formState={formState}
          nights={nights}
          total={total}
          canSubmit={canSubmit}
          onChange={handleFieldChange}
          onSubmit={handleSubmit}
        />
      </div>

      <TransactionSummary booking={booking} onClose={() => setBooking(null)} />
    </section>
  );
}
