"use client";

import CloseIcon from "@mui/icons-material/Close";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import type { User } from "firebase/auth";
import { useEffect, useState, type ReactNode } from "react";
import type { SavedBookingOrder } from "@/types/booking";
import { formatCurrency } from "@/utils/currency";
import { getBookingOrders } from "@/utils/bookingOrders";

type ProfileTab = "profile" | "orders" | "support";

type UserProfileModalProps = {
  isOpen: boolean;
  user: User;
  onClose: () => void;
};

const tabs: Array<{
  id: ProfileTab;
  label: string;
  icon: ReactNode;
}> = [
  { id: "profile", label: "Profile", icon: <PersonIcon fontSize="small" /> },
  { id: "orders", label: "Orders", icon: <HistoryIcon fontSize="small" /> },
  {
    id: "support",
    label: "Support",
    icon: <ContactSupportIcon fontSize="small" />,
  },
];

const getRoomsLabel = (order: SavedBookingOrder) =>
  order.rooms.map((room) => room.name).join(", ");

export default function UserProfileModal({
  isOpen,
  user,
  onClose,
}: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");
  const [orders, setOrders] = useState<SavedBookingOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setActiveTab("profile");
    setIsLoadingOrders(true);

    getBookingOrders(user)
      .then(setOrders)
      .finally(() => setIsLoadingOrders(false));
  }, [isOpen, user]);

  if (!isOpen) {
    return null;
  }

  const displayName = user.displayName ?? "Walkerz guest";
  const email = user.email ?? "Email not available";

  return (
    <section className="auth-backdrop" aria-label="User profile dialog">
      <div className="profile-card card">
        <button
          className="close-button"
          type="button"
          onClick={onClose}
          aria-label="Close user profile"
        >
          <CloseIcon fontSize="small" />
        </button>

        <div className="profile-header">
          {user.photoURL ? (
            <span
              className="profile-avatar"
              style={{ backgroundImage: `url(${user.photoURL})` }}
              aria-hidden="true"
            />
          ) : (
            <span className="profile-avatar fallback-avatar">
              <PersonIcon />
            </span>
          )}
          <div>
            <p className="eyebrow">User profile</p>
            <h2>{displayName}</h2>
            <span>{email}</span>
          </div>
        </div>

        <div className="profile-tabs" role="tablist" aria-label="Profile tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "active" : ""}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "profile" ? (
          <div className="profile-panel">
            <div className="profile-detail">
              <span>Name</span>
              <strong>{displayName}</strong>
            </div>
            <div className="profile-detail">
              <span>Email</span>
              <strong>{email}</strong>
            </div>
            <div className="profile-detail">
              <span>Account ID</span>
              <strong>{user.uid}</strong>
            </div>
          </div>
        ) : null}

        {activeTab === "orders" ? (
          <div className="profile-panel orders-panel">
            {isLoadingOrders ? (
              <p className="muted-text">Loading orders...</p>
            ) : orders.length ? (
              orders.map((order) => (
                <article className="order-card" key={order.id}>
                  <div className="order-card-header">
                    <div>
                      <p className="eyebrow icon-text">
                        <ReceiptLongIcon fontSize="small" />
                        Paid booking
                      </p>
                      <h3>{getRoomsLabel(order)}</h3>
                    </div>
                    <strong>{formatCurrency(order.total)}</strong>
                  </div>
                  <div className="order-meta">
                    <span>
                      {order.checkIn} to {order.checkOut}
                    </span>
                    <span>{order.nights} nights</span>
                    <span>{order.guests} guests</span>
                  </div>
                  <div className="profile-detail">
                    <span>Payment ID</span>
                    <strong>{order.paymentId}</strong>
                  </div>
                  <div className="profile-detail">
                    <span>Paid at</span>
                    <strong>
                      {new Date(order.paidAt).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </article>
              ))
            ) : (
              <p className="muted-text">No past orders yet.</p>
            )}
          </div>
        ) : null}

        {activeTab === "support" ? (
          <div className="profile-panel support-panel">
            <p className="muted-text">
              Need help with a booking or payment? Keep your payment ID ready
              from the Orders tab when you contact Walkerz support.
            </p>
            <div className="profile-detail">
              <span>Booking changes</span>
              <strong>Share your stay dates and payment ID.</strong>
            </div>
            <div className="profile-detail">
              <span>Payment help</span>
              <strong>Use the Razorpay payment ID from your order.</strong>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
