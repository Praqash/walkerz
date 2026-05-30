import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PaymentIcon from "@mui/icons-material/Payment";
import PersonIcon from "@mui/icons-material/Person";
import { useEffect, useRef, useState } from "react";
import type { Room } from "@/types/booking";
import { formatCurrency } from "@/utils/currency";

type BookingFormState = {
  guestName: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: number;
};

type BookingPanelProps = {
  rooms: Room[];
  formState: BookingFormState;
  nights: number;
  pricePerNight: number;
  total: number;
  canSubmit: boolean;
  isProcessing: boolean;
  paymentError: string;
  onChange: (field: keyof BookingFormState, value: string | number) => void;
  onSubmit: () => void;
};

export default function BookingPanel({
  rooms,
  formState,
  nights,
  pricePerNight,
  total,
  canSubmit,
  isProcessing,
  paymentError,
  onChange,
  onSubmit,
}: BookingPanelProps) {
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const guestDropdownRef = useRef<HTMLDivElement>(null);
  const hasSelectedRooms = rooms.length > 0;
  const maxGuests = Math.max(
    1,
    rooms.reduce((sum, room) => sum + room.maxGuests, 0),
  );
  const guestOptions = Array.from({ length: maxGuests }, (_, index) => index + 1);
  const roomLabel =
    rooms.length === 0
      ? "a room"
      : rooms.length === 1
        ? rooms[0].name
        : `${rooms.length} selected rooms`;

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        guestDropdownRef.current &&
        !guestDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGuestsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, []);

  return (
    <aside id="booking" className="booking-panel card">
      <p className="eyebrow icon-text">
        <CalendarTodayIcon fontSize="small" />
        Room booking
      </p>
      <h3>Reserve {roomLabel}</h3>
      <p className="muted-text">
        Fill in the details to calculate your stay and complete the payment
        securely with Razorpay.
      </p>

      <div className="booking-form">
        <div className="input-group">
          <label htmlFor="guestName">Guest name</label>
          <input
            id="guestName"
            type="text"
            value={formState.guestName}
            onChange={(event) => onChange("guestName", event.target.value)}
            placeholder="Full name"
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={formState.email}
            readOnly
            placeholder="you@example.com"
          />
        </div>

        <div className="form-row">
          <div className="input-group">
            <label htmlFor="checkIn">Check-in</label>
            <input
              id="checkIn"
              className="fancy-date-input"
              type="date"
              value={formState.checkIn}
              onChange={(event) => onChange("checkIn", event.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="checkOut">Check-out</label>
            <input
              id="checkOut"
              className="fancy-date-input"
              type="date"
              value={formState.checkOut}
              onChange={(event) => onChange("checkOut", event.target.value)}
            />
          </div>
        </div>

        <div
          className="input-group"
          title={hasSelectedRooms ? undefined : "Please select room to add guest"}
        >
          <label htmlFor="guests">Guests</label>
          <div
            className={`fancy-select ${isGuestsOpen ? "open" : ""}`}
            ref={guestDropdownRef}
          >
            <button
              id="guests"
              className="fancy-select-trigger"
              type="button"
              disabled={!hasSelectedRooms}
              aria-haspopup="listbox"
              aria-expanded={isGuestsOpen}
              aria-describedby={!hasSelectedRooms ? "guestsHelp" : undefined}
              onClick={() => setIsGuestsOpen((current) => !current)}
            >
              <span className="icon-text">
                <PersonIcon fontSize="small" />
                {formState.guests}{" "}
                {formState.guests === 1 ? "guest" : "guests"}
              </span>
              <ExpandMoreIcon fontSize="small" />
            </button>

            {isGuestsOpen && hasSelectedRooms ? (
              <div className="fancy-select-menu" role="listbox" aria-label="Guests">
                {guestOptions.map((guestCount) => (
                  <button
                    key={guestCount}
                    className={
                      formState.guests === guestCount ? "active" : undefined
                    }
                    type="button"
                    role="option"
                    aria-selected={formState.guests === guestCount}
                    onClick={() => {
                      onChange("guests", guestCount);
                      setIsGuestsOpen(false);
                    }}
                  >
                    <span>
                      {guestCount} {guestCount === 1 ? "guest" : "guests"}
                    </span>
                    <small>
                      {guestCount === 1 ? "Solo stay" : "Group stay"}
                    </small>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          {!hasSelectedRooms ? (
            <span id="guestsHelp" className="field-help">
              Please select room to add guest
            </span>
          ) : null}
        </div>
      </div>

      <div className="price-summary">
        <div>
          <span>Selected rooms</span>
          <strong>{rooms.length}</strong>
        </div>
        <div>
          <span>Room price per night</span>
          <strong>{formatCurrency(pricePerNight)}</strong>
        </div>
        <div>
          <span>Nights</span>
          <strong>{nights || "Select dates"}</strong>
        </div>
        <div className="summary-total">
          <span>Total</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
      </div>

      <button
        className="primary-button full-width"
        type="button"
        disabled={!canSubmit || isProcessing}
        onClick={onSubmit}
      >
        <PaymentIcon fontSize="small" />
        {isProcessing ? "Opening payment" : "Pay now"}
      </button>
      {paymentError ? <p className="payment-error">{paymentError}</p> : null}
    </aside>
  );
}
