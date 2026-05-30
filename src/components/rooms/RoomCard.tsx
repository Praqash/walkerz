import BedIcon from "@mui/icons-material/Bed";
import GroupsIcon from "@mui/icons-material/Groups";
import HotelIcon from "@mui/icons-material/Hotel";
import type { Room } from "@/types/booking";
import { formatCurrency } from "@/utils/currency";
import FeaturePill from "@/components/ui/FeaturePill";

type RoomCardProps = {
  room: Room;
  isSelected: boolean;
  onSelect: (room: Room) => void;
};

export default function RoomCard({ room, isSelected, onSelect }: RoomCardProps) {
  return (
    <article className={`room-card card ${isSelected ? "selected" : ""}`}>
      <div className="room-card-header">
        <div>
          <p className="eyebrow icon-text">
            <HotelIcon fontSize="small" />
            Available stay
          </p>
          <h3>{room.name}</h3>
        </div>
        <div className="room-price">
          <strong>{formatCurrency(room.pricePerNight)}</strong>
          <span>per night</span>
        </div>
      </div>

      <p className="room-description">{room.description}</p>

      <div className="room-meta">
        <span className="icon-text">
          <GroupsIcon fontSize="small" />
          Up to {room.maxGuests} guests
        </span>
        <span className="icon-text">
          <BedIcon fontSize="small" />
          {room.bedType}
        </span>
      </div>

      <div className="feature-list">
        {room.amenities.map((amenity) => (
          <FeaturePill key={amenity} label={amenity} />
        ))}
      </div>

      <button
        className={isSelected ? "secondary-button" : "primary-button"}
        type="button"
        onClick={() => onSelect(room)}
      >
        {isSelected ? "Remove room" : "Choose room"}
      </button>
    </article>
  );
}
