import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function FeaturePill({ label }: { label: string }) {
  return (
    <span className="feature-pill">
      <CheckCircleOutlineIcon fontSize="small" />
      {label}
    </span>
  );
}
