"use client";

import { useEffect, useMemo, useState } from "react";
import { rooms } from "@/data/rooms";
import type { BookingDetails, Room } from "@/types/booking";
import BookingPanel from "./BookingPanel";
import { useAuth } from "@/components/auth/AuthProvider";
import RoomList from "@/components/rooms/RoomList";
import SectionHeader from "@/components/ui/SectionHeader";
import TransactionSummary from "@/components/transaction/TransactionSummary";
import { saveBookingOrder } from "@/utils/bookingOrders";

type BookingFormState = {
  guestName: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: number;
};

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayFailureResponse = {
  error?: {
    code?: string;
    description?: string;
    reason?: string;
  };
};

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
};

type RazorpayConstructor = new (options: RazorpayCheckoutOptions) => {
  open: () => void;
  on: (
    event: "payment.failed",
    handler: (response: RazorpayFailureResponse) => void,
  ) => void;
};

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

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

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const getResponseError = async (response: Response) => {
  const data = await response.json().catch(() => null);
  return data?.error ?? "Payment request failed. Please try again.";
};

export default function BookingExperience() {
  const { user } = useAuth();
  const [selectedRooms, setSelectedRooms] = useState<Room[]>([]);
  const [formState, setFormState] =
    useState<BookingFormState>(initialFormState);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    if (!user?.email) {
      return;
    }

    setFormState((current) =>
      current.email ? current : { ...current, email: user.email ?? "" },
    );
  }, [user?.email]);

  const nights = useMemo(
    () => getNights(formState.checkIn, formState.checkOut),
    [formState.checkIn, formState.checkOut],
  );
  const pricePerNight = selectedRooms.reduce(
    (sum, room) => sum + room.pricePerNight,
    0,
  );
  const total = nights * pricePerNight;
  const canSubmit = Boolean(
    selectedRooms.length > 0 &&
    formState.guestName.trim() &&
    isValidEmail(formState.email) &&
    nights > 0 &&
    total > 0,
  );

  const handleToggleRoom = (room: Room) => {
    setSelectedRooms((current) => {
      const isSelected = current.some((selected) => selected.id === room.id);
      const nextRooms = isSelected
        ? current.filter((selected) => selected.id !== room.id)
        : [...current, room];
      const nextMaxGuests = nextRooms.reduce(
        (sum, selected) => sum + selected.maxGuests,
        0,
      );

      setFormState((currentForm) => ({
        ...currentForm,
        guests: Math.max(1, Math.min(currentForm.guests, nextMaxGuests || 1)),
      }));

      return nextRooms;
    });
  };

  const handleFieldChange = (
    field: keyof BookingFormState,
    value: string | number,
  ) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!canSubmit || isProcessingPayment) {
      if (!isValidEmail(formState.email)) {
        setPaymentError("Enter a valid email address.");
      }

      return;
    }

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      setPaymentError("Razorpay is not configured yet.");
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError("");

    try {
      const orderResponse = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomIds: selectedRooms.map((room) => room.id),
          guestName: formState.guestName.trim(),
          email: formState.email.trim(),
          checkIn: formState.checkIn,
          checkOut: formState.checkOut,
          guests: formState.guests,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error(await getResponseError(orderResponse));
      }

      const order = await orderResponse.json();
      const isScriptLoaded = await loadRazorpayScript();

      if (!isScriptLoaded || !window.Razorpay) {
        throw new Error("Unable to load Razorpay Checkout. Please try again.");
      }

      let hasCheckoutResolved = false;

      const checkout = new window.Razorpay({
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "Walkerz",
        description:
          selectedRooms.length === 1
            ? `${selectedRooms[0].name} booking`
            : `${selectedRooms.length} room booking`,
        order_id: order.order_id,
        prefill: {
          name: formState.guestName.trim(),
          email: formState.email.trim(),
        },
        theme: {
          color: "#324432",
        },
        handler: async (response) => {
          hasCheckoutResolved = true;

          try {
            const verifyResponse = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(response),
            });

            if (!verifyResponse.ok) {
              throw new Error(await getResponseError(verifyResponse));
            }

            const confirmedBooking = {
              rooms: selectedRooms,
              guestName: formState.guestName.trim(),
              email: formState.email.trim(),
              checkIn: formState.checkIn,
              checkOut: formState.checkOut,
              guests: formState.guests,
              nights,
              total,
              transactionId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              paidAt: new Date().toISOString(),
            };

            setBooking(confirmedBooking);

            if (user) {
              await saveBookingOrder(user, confirmedBooking);
            }
          } catch (error) {
            setPaymentError(
              error instanceof Error
                ? error.message
                : "Payment verification failed.",
            );
          } finally {
            setIsProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: () => {
            if (!hasCheckoutResolved) {
              setPaymentError("Payment was cancelled before completion.");
            }

            setIsProcessingPayment(false);
          },
        },
      });

      checkout.on("payment.failed", (response) => {
        hasCheckoutResolved = true;
        setPaymentError(
          response.error?.description ??
            response.error?.reason ??
            "Payment failed. Please try again.",
        );
        setIsProcessingPayment(false);
      });

      checkout.open();
    } catch (error) {
      setPaymentError(
        error instanceof Error ? error.message : "Unable to start payment.",
      );
      setIsProcessingPayment(false);
    }
  };

  return (
    <section className="section" aria-label="Walkerz booking experience">
      <div className="container grid two-column">
        <div id="rooms">
          <SectionHeader
            eyebrow="Available rooms"
            title="Pick the rooms that fit your Manali trip"
            description="Each room is configured from shared data so the listing, booking, and transaction details stay consistent."
          />
          <RoomList
            rooms={rooms}
            selectedRoomIds={selectedRooms.map((room) => room.id)}
            onToggleRoom={handleToggleRoom}
          />
        </div>

        <BookingPanel
          rooms={selectedRooms}
          formState={formState}
          nights={nights}
          pricePerNight={pricePerNight}
          total={total}
          canSubmit={canSubmit}
          isProcessing={isProcessingPayment}
          paymentError={paymentError}
          onChange={handleFieldChange}
          onSubmit={handleSubmit}
        />
      </div>

      <TransactionSummary booking={booking} onClose={() => setBooking(null)} />
    </section>
  );
}
