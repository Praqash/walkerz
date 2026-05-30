"use client";

import BedIcon from "@mui/icons-material/Bed";
import CloseIcon from "@mui/icons-material/Close";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GroupsIcon from "@mui/icons-material/Groups";
import HotelIcon from "@mui/icons-material/Hotel";
import { useMemo, useState } from "react";
import type { Room } from "@/types/booking";
import {
  getBookedNightDates,
  getDateRange,
  getTodayDateValue,
} from "@/utils/bookingDates";
import { getRoomBookingAvailability } from "@/utils/bookingOrders";
import { formatCurrency } from "@/utils/currency";
import FeaturePill from "@/components/ui/FeaturePill";

type RoomCardProps = {
  room: Room;
  isSelected: boolean;
  onSelect: (room: Room) => void;
};

export default function RoomCard({ room, isSelected, onSelect }: RoomCardProps) {
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const today = useMemo(() => getTodayDateValue(), []);
  const calendarDates = useMemo(() => getDateRange(today, 42), [today]);

  const openAvailability = async () => {
    setIsAvailabilityOpen(true);
    setIsLoadingAvailability(true);

    const bookings = await getRoomBookingAvailability(room.id);
    const unavailableDates = bookings.flatMap((booking) =>
      getBookedNightDates(booking.checkIn, booking.checkOut),
    );

    setBookedDates(new Set(unavailableDates));
    setIsLoadingAvailability(false);
  };

  return (
    <article className={`room-card card ${isSelected ? "selected" : ""}`}>
      <div className="room-card-header">
        <div>
          <p className="eyebrow icon-text">
            <HotelIcon fontSize="small" />
            Available stay
          </p>
          <h3>{room.name}</h3>
        </div>
        <div className="room-price">
          <strong>{formatCurrency(room.pricePerNight)}</strong>
          <span>per night</span>
        </div>
      </div>

      <p className="room-description">{room.description}</p>

      <div className="room-meta">
        <span className="icon-text">
          <GroupsIcon fontSize="small" />
          Up to {room.maxGuests} guests
        </span>
        <span className="icon-text">
          <BedIcon fontSize="small" />
          {room.bedType}
        </span>
      </div>

      <div className="feature-list">
        {room.amenities.map((amenity) => (
          <FeaturePill key={amenity} label={amenity} />
        ))}
      </div>

      <div className="room-actions">
        <button
          className={isSelected ? "secondary-button" : "primary-button"}
          type="button"
          onClick={() => onSelect(room)}
        >
          {isSelected ? "Remove room" : "Choose room"}
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={openAvailability}
        >
          <EventAvailableIcon fontSize="small" />
          Check availability
        </button>
      </div>

      {isAvailabilityOpen ? (
        <section
          className="availability-backdrop"
          aria-label={`${room.name} availability calendar`}
        >
          <div className="availability-card card">
            <button
              className="close-button"
              type="button"
              onClick={() => setIsAvailabilityOpen(false)}
              aria-label="Close availability calendar"
            >
              <CloseIcon fontSize="small" />
            </button>

            <div className="availability-heading">
              <p className="eyebrow icon-text">
                <EventAvailableIcon fontSize="small" />
                Room availability
              </p>
              <h2>{room.name}</h2>
              <span>Next 6 weeks</span>
            </div>

            <div className="availability-legend">
              <span><i className="available-dot" /> Available</span>
              <span><i className="booked-dot" /> Booked</span>
            </div>

            {isLoadingAvailability ? (
              <p className="muted-text">Loading availability...</p>
            ) : (
              <div className="availability-calendar">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <span className="calendar-weekday" key={day}>
                      {day}
                    </span>
                  ),
                )}
                {Array.from({
                  length: new Date(`${calendarDates[0]}T12:00:00`).getDay(),
                }).map((_, index) => (
                  <span
                    className="calendar-spacer"
                    key={`spacer-${calendarDates[0]}-${index}`}
                  />
                ))}
                {calendarDates.map((date) => {
                  const isBooked = bookedDates.has(date);
                  const day = new Date(`${date}T12:00:00`).getDate();

                  return (
                    <button
                      className={`calendar-tile ${isBooked ? "booked" : "available"}`}
                      key={date}
                      type="button"
                      disabled={isBooked}
                      title={isBooked ? "Booked" : "Available"}
                    >
                      <strong>{day}</strong>
                      <span>{isBooked ? "Booked" : "Open"}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      ) : null}
    </article>
  );
}
