import type { DashboardContent, DashboardSettingsRow } from '@/types/dashboard'

export interface UseDashboardContentReturn {
  readonly content: DashboardContent
}

const settingsRows: readonly DashboardSettingsRow[] = [
  {
    id: 'settings-1',
    label: 'Accessibility Settings',
    value: 'Manage',
    to: '/dashboard/profile-settings',
  },
  {
    id: 'settings-2',
    label: 'Privacy & Security',
    value: 'Manage',
    to: '/dashboard/profile-settings',
  },
  { id: 'settings-3', label: 'Text Size', value: 'Medium', to: '/dashboard/profile-settings' },
  { id: 'settings-4', label: 'Language', value: 'English', to: '/dashboard/profile-settings' },
]

const dashboardContent: DashboardContent = {
  greetingSubtitle: "Here's what's happening with your account today.",
  settingsRows,
}

export function useDashboardContent(): UseDashboardContentReturn {
  return { content: dashboardContent }
}
