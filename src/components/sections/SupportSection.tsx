import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SectionHeader from "@/components/ui/SectionHeader";

export default function SupportSection() {
  return (
    <section id="support" className="section support-section">
      <div className="container">
        <SectionHeader
          eyebrow="Support"
          title="Need help with your booking?"
          description="Keep your Razorpay payment ID ready when asking about booking changes, payment status, or stay details."
        />

        <div className="support-grid">
          <article className="support-card card">
            <ContactSupportIcon />
            <h3>Booking support</h3>
            <p>
              Share your name, email, selected rooms, and stay dates so the
              team can quickly identify your booking.
            </p>
          </article>
          <article className="support-card card">
            <ReceiptLongIcon />
            <h3>Payment support</h3>
            <p>
              Use the payment ID from your profile orders section for any
              Razorpay payment or confirmation questions.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
