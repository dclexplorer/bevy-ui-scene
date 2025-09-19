import { EventFromApi } from '../ui-classes/scene-info-card/SceneInfoCard.types'

export const fetchLiveEvents = async (): Promise<Array<EventFromApi>> => {
  try {
    const liveEvents = await fetch(
      'https://events.decentraland.org/api/events/?list=live'
    )
      .then((res) => res.json())
      .then((r) => r.data)
    return liveEvents
  } catch (error) {
    console.error('Error fetching live events:', error)
    return []
  }
}

export var MOCK_EVENT: EventFromApi = {
  id: '21fef2ff-713c-4721-82be-022e23497bf5',
  name: 'VTATV MEDIA NIGHTS 37,-149',
  image:
    'https://events-assets-099ac00.decentraland.org/poster/11eb7db068b63a1f.png',
  description:
    '🎬 Metaverse Media Nights 🎬\nDaily at 10PM EST\n\n📍 All VTATV Locations\n🌐 Decentraland: 37, -149\n\nStep into the metaverse for an immersive media night experience! From movies and music to exclusive community showcases, we’re bringing entertainment to the next level inside VTATV’s virtual theaters.\n\n✨ Watch • Connect • Socialize ✨\n\nDon’t miss your seat in the future of entertainment.',
  start_at: '2025-09-02T02:00:00.000Z',
  finish_at: '2025-09-28T11:00:00.000Z',
  coordinates: [37, -147],
  user: '0x60e7357de5ec8c3b07f8efb3a8c1325811eb7db0',
  approved: true,
  created_at: '2025-03-26T04:01:44.322Z',
  updated_at: '2025-09-18T11:00:00.070Z',
  total_attendees: 21,
  latest_attendees: [
    '0xc9c29ab98e6bc42015985165a11153f564e9f8c2',
    '0xe339ebc7ec708bf42eed1b54a4df852312db2c5b',
    '0x1c309eb883af2b484259b644d20385c3ef2506f5',
    '0x51019957e06c9e8737c935058d3a2c69f40479df',
    '0xf605e3257c5662406b8baa9e6040dc393d05922f',
    '0x466ef7734cb7695e2013e7a64809c3ac1c0f8fab',
    '0x135e544aa55fcf47e7ef7494fb1882cd5d4e0694',
    '0x8e529b2ecb8f6ea14172909d5ccb2f583c6da213',
    '0x598f8af1565003ae7456dac280a18ee826df7a2c',
    '0x9f0673ef1fab4b30ce6d5633498b4d3d4392ea82'
  ],
  url: 'https://play.decentraland.org/?position=37%2C-147',
  scene_name: null,
  user_name: 'VTATV',
  rejected: false,
  trending: false,
  server: null,
  estate_id: null,
  estate_name: null,
  x: 37,
  y: -147,
  all_day: false,
  recurrent: true,
  recurrent_frequency: 'WEEKLY',
  recurrent_weekday_mask: 127,
  recurrent_month_mask: 0,
  recurrent_interval: 1,
  recurrent_count: null,
  recurrent_until: '2025-12-31T00:00:00.000Z',
  duration: 32400000,
  recurrent_dates: [
    '2025-09-02T02:00:00.000Z',
    '2025-09-19T02:00:00.000Z',
    '2025-09-20T02:00:00.000Z',
    '2025-09-21T02:00:00.000Z',
    '2025-09-22T02:00:00.000Z',
    '2025-09-23T02:00:00.000Z',
    '2025-09-24T02:00:00.000Z',
    '2025-09-25T02:00:00.000Z',
    '2025-09-26T02:00:00.000Z',
    '2025-09-27T02:00:00.000Z',
    '2025-09-28T02:00:00.000Z'
  ],
  recurrent_setpos: null,
  recurrent_monthday: null,
  highlighted: false,
  next_start_at: '2025-09-19T02:00:00.000Z',
  next_finish_at: '2025-09-19T11:00:00.000Z',
  categories: ['talks'],
  schedules: [],
  approved_by: '0x3385c05ca0ddb46b51f9c2d99fc597cf6f0da891',
  rejected_by: null,
  world: false,
  place_id: null,
  community_id: null,
  attending: false,
  position: [37, -147],
  live: true
}
