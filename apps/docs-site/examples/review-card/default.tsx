import { ReviewCard } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div style={{ maxWidth: 520 }}>
      <ReviewCard
        author="Jamie"
        rating={5}
        date="April 2026"
        verified
        subtitle="Member since 2023"
        body="Place was exactly as described — spotless, well-stocked, and the check-in instructions were the clearest I've gotten. Priya answered my one question about the parking gate in under two minutes. Would stay again next time we're in town."
      />
    </div>
  );
}
