import ItineraryCard from './ItineraryCard';

export default function Timeline({ items = [] }) {
  if (items.length === 0) return <p className="text-white/20 font-mono uppercase text-xs">No active data nodes.</p>;
  
  return (
    <div className="animate-in fade-in duration-1000">
      {items.map((item, idx) => (
        <ItineraryCard key={idx} item={item} />
      ))}
    </div>
  );
}