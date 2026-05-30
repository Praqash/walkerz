import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import type { BookingDetails } from "@/types/booking";
import { formatCurrency } from "@/utils/currency";

type TransactionSummaryProps = {
  booking: BookingDetails | null;
  onClose: () => void;
};

const summaryRows = (booking: BookingDetails) => [
  ["Room", booking.room.name],
  ["Guest", booking.guestName],
  ["Email", booking.email],
  ["Stay", `${booking.checkIn} to ${booking.checkOut}`],
  ["Guests", `${booking.guests}`],
  ["Nights", `${booking.nights}`],
  ["Payment ID", booking.paymentId],
  ["Paid at", new Date(booking.paidAt).toLocaleString("en-IN")],
];

export default function TransactionSummary({
  booking,
  onClose,
}: TransactionSummaryProps) {
  if (!booking) {
    return null;
  }

  return (
    <section
      id="transaction"
      className="transaction-backdrop"
      aria-label="Transaction summary"
    >
      <div className="transaction-card card">
        <button
          className="close-button"
          type="button"
          onClick={onClose}
          aria-label="Close transaction summary"
        >
          <CloseIcon fontSize="small" />
        </button>

        <div className="transaction-status">
          <CheckCircleIcon />
          <p>Payment successful</p>
        </div>

        <h2>Your Walkerz booking is confirmed</h2>
        <p className="muted-text">
          Razorpay verified the payment and your transaction details are listed
          below.
        </p>

        <div className="receipt-box">
          <div className="receipt-title icon-text">
            <ReceiptLongIcon fontSize="small" />
            Receipt summary
          </div>
          {summaryRows(booking).map(([label, value]) => (
            <div className="receipt-row" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
          <div className="receipt-row total-row">
            <span>Total payable</span>
            <strong>{formatCurrency(booking.total)}</strong>
          </div>
        </div>

        <div className="transaction-id">
          <span>Razorpay Order ID</span>
          <strong>{booking.razorpayOrderId}</strong>
        </div>
      </div>
    </section>
  );
}
