import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PaymentIcon from "@mui/icons-material/Payment";
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
  room: Room;
  formState: BookingFormState;
  nights: number;
  total: number;
  canSubmit: boolean;
  isProcessing: boolean;
  paymentError: string;
  onChange: (field: keyof BookingFormState, value: string | number) => void;
  onSubmit: () => void;
};

export default function BookingPanel({
  room,
  formState,
  nights,
  total,
  canSubmit,
  isProcessing,
  paymentError,
  onChange,
  onSubmit,
}: BookingPanelProps) {
  return (
    <aside id="booking" className="booking-panel card">
      <p className="eyebrow icon-text">
        <CalendarTodayIcon fontSize="small" />
        Booking of room
      </p>
      <h3>Reserve {room.name}</h3>
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
            onChange={(event) => onChange("email", event.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="form-row">
          <div className="input-group">
            <label htmlFor="checkIn">Check-in</label>
            <input
              id="checkIn"
              type="date"
              value={formState.checkIn}
              onChange={(event) => onChange("checkIn", event.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="checkOut">Check-out</label>
            <input
              id="checkOut"
              type="date"
              value={formState.checkOut}
              onChange={(event) => onChange("checkOut", event.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="guests">Guests</label>
          <select
            id="guests"
            value={formState.guests}
            onChange={(event) => onChange("guests", Number(event.target.value))}
          >
            {Array.from(
              { length: room.maxGuests },
              (_, index) => index + 1,
            ).map((guestCount) => (
              <option key={guestCount} value={guestCount}>
                {guestCount} {guestCount === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="price-summary">
        <div>
          <span>Room price</span>
          <strong>{formatCurrency(room.pricePerNight)}</strong>
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
