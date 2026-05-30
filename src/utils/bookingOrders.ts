import type { User } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { BookingDetails, SavedBookingOrder } from "@/types/booking";

const getStorageKey = (userId: string) => `walkerz_orders_${userId}`;

const getLocalOrders = (userId: string): SavedBookingOrder[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const data = window.localStorage.getItem(getStorageKey(userId));

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data) as SavedBookingOrder[];
  } catch {
    return [];
  }
};

const saveLocalOrder = (userId: string, order: SavedBookingOrder) => {
  if (typeof window === "undefined") {
    return;
  }

  const orders = getLocalOrders(userId);
  const nextOrders = [
    order,
    ...orders.filter((existing) => existing.id !== order.id),
  ];

  window.localStorage.setItem(getStorageKey(userId), JSON.stringify(nextOrders));
};

const mergeOrders = (orders: SavedBookingOrder[]) => {
  const byPaymentId = new Map<string, SavedBookingOrder>();

  orders.forEach((order) => {
    byPaymentId.set(order.paymentId, order);
  });

  return Array.from(byPaymentId.values()).sort(
    (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime(),
  );
};

export const saveBookingOrder = async (
  user: User,
  booking: BookingDetails,
) => {
  const order: SavedBookingOrder = {
    ...booking,
    id: booking.paymentId,
    createdAt: new Date().toISOString(),
  };

  saveLocalOrder(user.uid, order);

  if (!db) {
    return order;
  }

  try {
    await addDoc(collection(db, "users", user.uid, "orders"), order);
  } catch {
    return order;
  }

  return order;
};

export const getBookingOrders = async (user: User) => {
  const localOrders = getLocalOrders(user.uid);

  if (!db) {
    return localOrders;
  }

  try {
    const snapshot = await getDocs(
      query(
        collection(db, "users", user.uid, "orders"),
        orderBy("paidAt", "desc"),
      ),
    );
    const firestoreOrders = snapshot.docs.map((doc) => ({
      ...(doc.data() as SavedBookingOrder),
      id: doc.id,
    }));

    return mergeOrders([...firestoreOrders, ...localOrders]);
  } catch {
    return localOrders;
  }
};
