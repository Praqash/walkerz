import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { rooms } from "@/data/rooms";
import { isPastDate } from "@/utils/bookingDates";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

const razorpay =
  keyId && keySecret
    ? new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      })
    : null;

const getNights = (checkIn: string, checkOut: string) => {
  if (!checkIn || !checkOut) {
    return 0;
  }

  const difference = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return difference > 0 ? Math.ceil(difference / 86400000) : 0;
};

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export async function POST(request: Request) {
  if (!razorpay) {
    return NextResponse.json(
      { error: "Razorpay is not configured." },
      { status: 500 },
    );
  }

  const body = await request.json();
  const roomIds = Array.isArray(body.roomIds)
    ? body.roomIds.filter(
        (roomId: unknown): roomId is string => typeof roomId === "string",
      )
    : typeof body.roomId === "string"
      ? [body.roomId]
      : [];
  const uniqueRoomIds = Array.from(new Set(roomIds));
  const guestName =
    typeof body.guestName === "string" ? body.guestName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const checkIn = typeof body.checkIn === "string" ? body.checkIn : "";
  const checkOut = typeof body.checkOut === "string" ? body.checkOut : "";
  const guests = Number(body.guests);
  const selectedRooms = uniqueRoomIds
    .map((roomId) => rooms.find((candidate) => candidate.id === roomId))
    .filter((room): room is (typeof rooms)[number] => Boolean(room));

  if (
    selectedRooms.length === 0 ||
    selectedRooms.length !== uniqueRoomIds.length
  ) {
    return NextResponse.json(
      { error: "One or more selected rooms were not found." },
      { status: 400 },
    );
  }

  if (!guestName || !email) {
    return NextResponse.json(
      { error: "Guest name and email are required." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const maxGuests = selectedRooms.reduce((sum, room) => sum + room.maxGuests, 0);

  if (!Number.isInteger(guests) || guests < 1 || guests > maxGuests) {
    return NextResponse.json(
      { error: "Guest count is not valid for the selected rooms." },
      { status: 400 },
    );
  }

  const nights = getNights(checkIn, checkOut);

  if (isPastDate(checkIn) || isPastDate(checkOut)) {
    return NextResponse.json(
      { error: "Check-in and check-out dates cannot be in the past." },
      { status: 400 },
    );
  }

  if (nights < 1) {
    return NextResponse.json(
      { error: "Check-out must be after check-in." },
      { status: 400 },
    );
  }

  const pricePerNight = selectedRooms.reduce(
    (sum, room) => sum + room.pricePerNight,
    0,
  );
  const amount = nights * pricePerNight * 100;

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `walkerz_${Date.now()}`,
      notes: {
        roomIds: uniqueRoomIds.join(","),
        roomNames: selectedRooms.map((room) => room.name).join(", "),
        guestName,
        email,
        checkIn,
        checkOut,
        guests: String(guests),
        nights: String(nights),
      },
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    const statusCode =
      typeof error === "object" && error !== null && "statusCode" in error
        ? Number(error.statusCode)
        : 500;

    return NextResponse.json(
      { error: "Unable to create Razorpay order." },
      { status: statusCode === 401 ? 401 : 500 },
    );
  }
}
