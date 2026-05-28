import type { Room } from "@/types/booking";
import RoomCard from "./RoomCard";

type RoomListProps = {
  rooms: Room[];
  selectedRoomId: string;
  onSelectRoom: (room: Room) => void;
};

export default function RoomList({ rooms, selectedRoomId, onSelectRoom }: RoomListProps) {
  return (
    <div className="room-list">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} isSelected={room.id === selectedRoomId} onSelect={onSelectRoom} />
      ))}
    </div>
  );
}
