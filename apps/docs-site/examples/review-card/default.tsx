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
        body="Honestly the easiest pickup I've ever had. The car was spotless, the keys were waiting, and Priya answered my one question in under two minutes. Would 100% rent from her again on my next trip."
      />
    </div>
  );
}
