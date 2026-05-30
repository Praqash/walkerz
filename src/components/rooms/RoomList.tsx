import type { Room } from "@/types/booking";
import RoomCard from "./RoomCard";

type RoomListProps = {
  rooms: Room[];
  selectedRoomIds: string[];
  onToggleRoom: (room: Room) => void;
};

export default function RoomList({
  rooms,
  selectedRoomIds,
  onToggleRoom,
}: RoomListProps) {
  return (
    <div className="room-list">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          isSelected={selectedRoomIds.includes(room.id)}
          onSelect={onToggleRoom}
        />
      ))}
    </div>
  );
}
