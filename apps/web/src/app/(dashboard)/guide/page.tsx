'use client';

import { DailyPracticeCard, QuickActions } from '@/components/guide';

export default function GuideDashboardPage() {
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'tarot':
        window.location.href = '/dashboard/tarot';
        break;
      case 'meditation':
        window.location.href = '/dashboard/guide/meditation';
        break;
      case 'habit':
        window.location.href = '/dashboard/guide/habits';
        break;
      case 'dream':
        window.location.href = '/dashboard/guide/dream';
        break;
    }
  };

  return (
    <div className="space-y-8">
      {/* Daily Practice Card */}
      <DailyPracticeCard onQuickAction={handleQuickAction} />

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}