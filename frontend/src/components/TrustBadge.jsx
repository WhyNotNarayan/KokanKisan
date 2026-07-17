export default function TrustBadge({ score, size = 'sm' }) {
  let badge;

  if (score >= 75) {
    badge = { level: 'verified', label: 'Verified Natural Farmer', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' };
  } else if (score >= 40) {
    badge = { level: 'building', label: 'Building Trust', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' };
  } else {
    badge = { level: 'review', label: 'Under Review', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' };
  }

  if (size === 'lg') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${badge.bg} ${badge.text}`}>
        <span className={`w-2.5 h-2.5 rounded-full ${badge.dot}`}></span>
        <span className="text-sm font-medium">{badge.label}</span>
        <span className="text-xs opacity-75">({score}/100)</span>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
      {score}
    </span>
  );
}
