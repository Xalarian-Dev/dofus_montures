export interface TradeTextInput {
  /** Montures proposées : nom et sexes proposés. */
  offers: { name: string; male: boolean; female: boolean }[];
  /** Montures recherchées : nom et sexes recherchés. */
  wanted: { name: string; male: boolean; female: boolean }[];
  realm?: string;
  /** Adresse du profil public, ajoutée en dernière ligne si elle est connue. */
  profileUrl?: string;
}

function formatMounts(items: TradeTextInput['offers']): string {
  return items
    .filter((i) => i.male || i.female)
    .map((i) => `${i.name} ${[i.male ? '♂' : '', i.female ? '♀' : ''].filter(Boolean).join('')}`)
    .join(', ');
}

/** Texte à coller sur Discord ; chaîne vide s'il n'y a rien à proposer ni à chercher. */
export function buildTradeText({ offers, wanted, realm, profileUrl }: TradeTextInput): string {
  const propose = formatMounts(offers);
  const cherche = formatMounts(wanted);
  if (!propose && !cherche) return '';
  const lines: string[] = [];
  if (propose) lines.push(`**Je propose :** ${propose}`);
  if (cherche) lines.push(`**Je cherche :** ${cherche}`);
  if (realm) lines.push(`Serveur : ${realm}`);
  if (profileUrl) lines.push(`Liste visible sur ${profileUrl}`);
  return lines.join('\n');
}
