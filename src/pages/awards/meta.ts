export interface Award {
  title: string;
  organization: string;
  date: string;
  year: number;
  description: string;
}

export const awardsData: Award[] = [
  {
    title: 'Beste Auszubildende',
    organization: 'IHK Nord Westfalen',
    date: '2024',
    year: 2024,
    description: 'Auszeichnung im Kreis Borken - Fachinformatiker Anwendungsentwicklung'
  },
  {
    title: '1. Platz IT-Projekttage 2023',
    organization: 'Berufskolleg Wirtschaft und Verwaltung Ahaus',
    date: 'Oktober 2023',
    year: 2023,
    description: 'Siegerprojekt "PawPal" - Web-App zur Vermittlung von Haustieren'
  }
].sort((a, b) => b.year - a.year);
