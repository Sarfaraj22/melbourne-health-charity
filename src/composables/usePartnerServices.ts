export interface PartnerService {
  readonly id: string
  readonly name: string
  readonly address: string
  readonly phone: string
  readonly offers: string
  readonly latitude: number
  readonly longitude: number
}

export interface UsePartnerServicesReturn {
  readonly services: readonly PartnerService[]
}

const services: readonly PartnerService[] = [
  {
    id: 'yooralla',
    name: 'Yooralla',
    address: '244 Flinders Street, Melbourne VIC 3000',
    phone: '1800 966 725',
    offers: 'Disability support, accommodation, and community participation across Victoria.',
    latitude: -37.8183,
    longitude: 144.9671,
  },
  {
    id: 'scope',
    name: 'Scope Australia',
    address: '830 Whitehorse Road, Box Hill VIC 3128',
    phone: '1300 472 673',
    offers: 'Therapy, supported independent living, and employment for people with disability.',
    latitude: -37.819,
    longitude: 145.121,
  },
  {
    id: 'amida',
    name: 'AMIDA',
    address: '247 Flinders Lane, Melbourne VIC 3000',
    phone: '03 9654 2723',
    offers: 'Advocacy for people with disability living in residential services.',
    latitude: -37.817,
    longitude: 144.966,
  },
  {
    id: 'drc',
    name: 'Disability Resources Centre',
    address: 'Level 1, 247 Flinders Lane, Melbourne VIC 3000',
    phone: '03 9662 3324',
    offers: 'Independent information, advocacy, and NDIS navigation support.',
    latitude: -37.8171,
    longitude: 144.9662,
  },
  {
    id: 'independence-australia',
    name: 'Independence Australia',
    address: '208 Wellington Street, Collingwood VIC 3066',
    phone: '1300 704 982',
    offers: 'Personal care, community access, and allied health in Melbourne.',
    latitude: -37.802,
    longitude: 144.986,
  },
  {
    id: 'amaze',
    name: 'Amaze (Autism Victoria)',
    address: '24 Drummond Street, Carlton VIC 3053',
    phone: '1300 308 699',
    offers: 'Autism information, advocacy, and community connection.',
    latitude: -37.806,
    longitude: 144.968,
  },
  {
    id: 'vision-australia',
    name: 'Vision Australia',
    address: '454 Glenferrie Road, Kooyong VIC 3144',
    phone: '1300 847 466',
    offers: 'Blindness and low-vision services, equipment, and orientation support.',
    latitude: -37.841,
    longitude: 145.035,
  },
  {
    id: 'able-australia',
    name: 'Able Australia',
    address: '2/2 Wellington Parade, East Melbourne VIC 3002',
    phone: '1300 225 369',
    offers: 'Deafblind and disability support, communication, and community programs.',
    latitude: -37.816,
    longitude: 144.981,
  },
]

export function usePartnerServices(): UsePartnerServicesReturn {
  return { services }
}
