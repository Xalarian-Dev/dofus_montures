import { describe, it, expect } from 'vitest';
import { buildTradeText } from '@/lib/tradeText';

describe('buildTradeText', () => {
  it('liste vide : texte vide', () => {
    expect(buildTradeText({ offers: [], wanted: [], realm: 'Draconiros', profileUrl: 'https://x/y' })).toBe('');
    expect(buildTradeText({ offers: [{ name: 'Muldo Doré', male: false, female: false }], wanted: [] })).toBe('');
  });

  it('propose, cherche, serveur et adresse du profil à la fin', () => {
    const text = buildTradeText({
      offers: [
        { name: 'Muldo Doré', male: true, female: true },
        { name: 'Dragodinde Rousse', male: false, female: true },
      ],
      wanted: [{ name: 'Volkorne Ivoire', male: true, female: false }],
      realm: 'Draconiros',
      profileUrl: 'https://site.test/pseudo',
    });
    expect(text).toBe(
      [
        '**Je propose :** Muldo Doré ♂♀, Dragodinde Rousse ♀',
        '**Je cherche :** Volkorne Ivoire ♂',
        'Serveur : Draconiros',
        'Liste visible sur https://site.test/pseudo',
      ].join('\n'),
    );
  });

  it('sans recherche ni profil : seulement ce qui existe', () => {
    expect(buildTradeText({ offers: [{ name: 'Muldo Doré', male: true, female: false }], wanted: [] })).toBe(
      '**Je propose :** Muldo Doré ♂',
    );
  });
});
