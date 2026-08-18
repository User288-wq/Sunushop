// ============================================================
// 🌍 CONFIGURATION MULTI-PAYS
// ============================================================

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  phoneCode: string;
  languages: string[];
  cities: string[];
  paymentMethods: string[];
  deliveryZones: string[];
  timezone: string;
  active: boolean;
}

export const countries: Country[] = [
  {
    code: "SN",
    name: "Sénégal",
    flag: "🇸🇳",
    currency: "XOF",
    currencySymbol: "FCFA",
    phoneCode: "+221",
    languages: ["fr", "wo", "en"],
    cities: ["Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Kaolack"],
    paymentMethods: ["wave", "orange_money", "cash_on_delivery"],
    deliveryZones: ["Dakar", "Thiès", "Mbour", "Rufisque", "Pikine"],
    timezone: "Africa/Dakar",
    active: true,
  },
  {
    code: "CI",
    name: "Côte d'Ivoire",
    flag: "🇨🇮",
    currency: "XOF",
    currencySymbol: "FCFA",
    phoneCode: "+225",
    languages: ["fr", "en"],
    cities: ["Abidjan", "Bouaké", "Daloa", "Yamoussoukro", "San-Pédro"],
    paymentMethods: ["wave", "orange_money", "cash_on_delivery"],
    deliveryZones: ["Abidjan", "Bouaké", "Daloa", "Yamoussoukro"],
    timezone: "Africa/Abidjan",
    active: true,
  },
  {
    code: "ML",
    name: "Mali",
    flag: "🇲🇱",
    currency: "XOF",
    currencySymbol: "FCFA",
    phoneCode: "+223",
    languages: ["fr", "bam"],
    cities: ["Bamako", "Ségou", "Sikasso", "Mopti", "Kayes"],
    paymentMethods: ["orange_money", "wave", "cash_on_delivery"],
    deliveryZones: ["Bamako", "Ségou", "Sikasso"],
    timezone: "Africa/Bamako",
    active: true,
  },
  {
    code: "GN",
    name: "Guinée",
    flag: "🇬🇳",
    currency: "GNF",
    currencySymbol: "FG",
    phoneCode: "+224",
    languages: ["fr", "en"],
    cities: ["Conakry", "Kankan", "Labé", "Nzérékoré", "Kindia"],
    paymentMethods: ["orange_money", "wave", "cash_on_delivery"],
    deliveryZones: ["Conakry", "Kankan", "Labé"],
    timezone: "Africa/Conakry",
    active: true,
  },
  {
    code: "BF",
    name: "Burkina Faso",
    flag: "🇧🇫",
    currency: "XOF",
    currencySymbol: "FCFA",
    phoneCode: "+226",
    languages: ["fr", "en"],
    cities: ["Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Banfora"],
    paymentMethods: ["orange_money", "wave", "cash_on_delivery"],
    deliveryZones: ["Ouagadougou", "Bobo-Dioulasso"],
    timezone: "Africa/Ouagadougou",
    active: false,
  },
  {
    code: "BJ",
    name: "Bénin",
    flag: "🇧🇯",
    currency: "XOF",
    currencySymbol: "FCFA",
    phoneCode: "+229",
    languages: ["fr", "en"],
    cities: ["Cotonou", "Porto-Novo", "Parakou", "Abomey"],
    paymentMethods: ["wave", "orange_money", "cash_on_delivery"],
    deliveryZones: ["Cotonou", "Porto-Novo", "Parakou"],
    timezone: "Africa/Porto-Novo",
    active: false,
  },
];

export function getCountry(code: string): Country | undefined {
  return countries.find(c => c.code === code);
}

export function getActiveCountries(): Country[] {
  return countries.filter(c => c.active);
}

export function getCountryByPhoneCode(phoneCode: string): Country | undefined {
  return countries.find(c => c.phoneCode === phoneCode);
}

export function getCurrencySymbol(code: string): string {
  const country = getCountry(code);
  return country?.currencySymbol || "FCFA";
}
