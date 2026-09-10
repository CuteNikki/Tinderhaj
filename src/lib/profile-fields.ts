export const PROFILE_FIELDS = [
  { key: 'displayName', label: 'Display Name' },
  { key: 'avatarUrl', label: 'Avatar' },
  { key: 'bannerUrl', label: 'Banner' },
  { key: 'bio', label: 'Bio' },
  { key: 'birthday', label: 'Birthday' },
  { key: 'size', label: 'Size' },
  { key: 'pronouns', label: 'Pronouns' },
  { key: 'location', label: 'Location' },
  { key: 'interests', label: 'Interests' },
] as const;

export type ProfileFieldKey = (typeof PROFILE_FIELDS)[number]['key'];

export function profileFieldLabel(key: string) {
  return PROFILE_FIELDS.find((field) => field.key === key)?.label ?? key;
}
