'use client';

import { TarotDashboard } from '@/components/tarot/TarotDashboard';

/**
 * Tarot Dashboard Page - /dashboard/tarot
 * Main entry point with daily draw, quick actions, and recent readings
 */
export default function TarotPage() {
  // In a real app, this data would come from API calls or server components
  // For now, we'll use the component with empty props and let it handle client-side state
  return (
    <TarotDashboard
      initialDailyCard={null}
      recentReadings={[]}
      onDrawDaily={async () => {
        // This would call the API in a real implementation
        return null;
      }}
      onSaveReflection={async () => {
        // This would call the API in a real implementation
      }}
      onGenerateReading={async () => {
        // This would call the API in a real implementation
        return null;
      }}
    />
  );
}