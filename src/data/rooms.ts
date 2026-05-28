import type { Room } from "@/types/booking";

export const rooms: Room[] = [
  {
    id: "cedar-view",
    name: "Cedar View Room",
    description: "A calm room with mountain-facing windows and warm wooden interiors.",
    pricePerNight: 3200,
    maxGuests: 2,
    bedType: "Queen bed",
    amenities: ["Mountain view", "Heater", "Wi-Fi", "Breakfast"],
  },
  {
    id: "orchard-suite",
    name: "Orchard Suite",
    description: "A spacious suite for couples or small families overlooking the apple orchard.",
    pricePerNight: 4800,
    maxGuests: 3,
    bedType: "King bed with sofa bed",
    amenities: ["Orchard view", "Balcony", "Room service", "Wi-Fi"],
  },
  {
    id: "family-attic",
    name: "Family Attic Room",
    description: "A minimal attic-style stay with extra bedding and a quiet reading corner.",
    pricePerNight: 6200,
    maxGuests: 4,
    bedType: "Two double beds",
    amenities: ["Valley view", "Extra bedding", "Tea station", "Wi-Fi"],
  },
];
