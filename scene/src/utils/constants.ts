import { Color4 } from '@dcl/sdk/math'

// PRIMARY COLORS
export const RUBY: Color4 = Color4.create(1, 45 / 255, 85 / 255, 1)
export const ALMOST_WHITE: Color4 = Color4.create(
  236 / 255,
  235 / 255,
  237 / 255,
  1
)
export const ALMOST_BLACK: Color4 = Color4.create(
  22 / 255,
  21 / 255,
  24 / 255,
  1
)
// SECONDARY COLORS
export const ORANGE: Color4 = Color4.create(1, 116 / 255, 57 / 255, 1)
export const YELLOW: Color4 = Color4.create(1, 201 / 255, 91 / 255, 1)
export const LAVANDER: Color4 = Color4.create(198 / 255, 64 / 255, 205 / 255, 1)
// TERTIARY COLORS
export const MELON: Color4 = Color4.create(1, 162 / 255, 90 / 255, 1)
export const VIOLET: Color4 = Color4.create(165 / 255, 36 / 255, 179 / 255, 1)
export const PURPLE: Color4 = Color4.create(105 / 255, 31 / 255, 169 / 255, 1)

export const CLICKED_PRIMARY_COLOR: Color4 = Color4.create(
  0.898,
  0.153,
  0.294,
  0.5
)
export const SECONDARY_COLOR: Color4 = Color4.create(0, 0, 0, 0.2)

export const LINK_CHIP_HOVERED: Color4 = { ...Color4.Teal(), a: 0.1 }
export const ALPHA_BLACK_HOVERED: Color4 = { ...Color4.Black(), a: 0.7 }
export const ALPHA_BLACK_NORMAL: Color4 = { ...Color4.Black(), a: 0.35 }

// LINKS
export const DCL_DAO_EXPLORERS_DS: string =
  'https://discordapp.com/channels/1156930256545009674/1157417657562304522'

export const SCENE_LOAD_DISTANCE_TITLE = 'Scene Load Distance'
export const SCENE_LOAD_DISTANCE_DESCRIPTION =
  'The distance at which neighbouring scenes will be spawned. A scene is 16 meters, so for example a value of 64 will load 4 scenes in all directions.'
export const SCENE_UNLOAD_DISTANCE_TITLE = 'Scene Unload Distance'
export const SCENE_UNLOAD_DISTANCE_DESCRIPTION =
  'The additional distance (above the load distance) at which neighbouring scenes will be despawned. Using too low a setting will cause churn as scenes load and unload frequently.'
export const TARGET_FRAME_RATE_TITLE = 'Target Frame Rate'
export const TARGET_FRAME_RATE_DESCRIPTION =
  'Lower values may be uncomfortable or jerky, while higher values will result in a smoother experience but increased CPU and GPU load.'
export const SCENE_THREADS_TITLE = 'Scene Threads'
export const SCENE_THREADS_DESCRIPTION =
  'Number of threads to use for running scenes concurrently. A low number will result in infrequent updates to distant scenes. A high number will result in smoother distant scene update frequency, but will increase CPU usage and may impact overall framerate if it is set higher than half the core count of the CPU.'
export const MAX_VIDEOS_TITLE = 'Max AV Sources'
export const MAX_VIDEOS_DESCRIPTION =
  'Maximum number of audio streams and videos to process simultaneously. Allowing more AV sources puts a higher burden on both CPU and GPU.\nIf scenes spawn more audio and video sources than this maximum, more distant sources from the player will be paused.'
export const MAX_AVATARS_TITLE = 'Max Avatars'
export const MAX_AVATARS_DESCRIPTION =
  'How many avatars to render. Limiting this can help reduce frame rate drops in busy environments. If there are more avatars nearby, only the closest will be shown. This applies to other users and to scene-created avatars.'
export const MAX_DOWNLOADS_TITLE = 'Max Downloads'
export const MAX_DOWNLOADS_DESCRIPTION =
  'Maximum number of simultaneous downloads to allow. Higher numbers may cause more PCIE/GPU memory pressure and more network usage, potentially leading to hiccups, but may also result in scenes loading faster.'
export const DESPAWN_WORKAROUND_TITLE = 'Despawn Workaround'
export const DESPAWN_WORKAROUND_DESCRIPTION =
  'On some linux systems, despawning multiple v8 engines simultaneously causes seg faults. This workaround can be enabled to throttle the scene despawn rate to avoid this crash.'

export const COUNTRIES = [
  '- Select an option -',
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo (Congo-Brazzaville)',
  'Congo (Democratic Republic of the)',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czechia',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini (Swaziland)',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Korea (North)',
  'Korea (South)',
  'Kosovo',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar (Burma)',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine State',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States of America',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
  'Other'
]

export const LANGUAGES = [
  '- Select an option -',
  'Afrikaans',
  'Albanian',
  'Amharic',
  'Arabic',
  'Armenian',
  'Azerbaijani',
  'Basque',
  'Belarusian',
  'Bengali',
  'Bosnian',
  'Bulgarian',
  'Catalan',
  'Chinese',
  'Croatian',
  'Czech',
  'Danish',
  'Dutch',
  'English',
  'Estonian',
  'Finnish',
  'French',
  'Galician',
  'Georgian',
  'German',
  'Greek',
  'Gujarati',
  'Hebrew',
  'Hindi',
  'Hungarian',
  'Icelandic',
  'Indonesian',
  'Irish',
  'Italian',
  'Japanese',
  'Javanese',
  'Kannada',
  'Kazakh',
  'Khmer',
  'Korean',
  'Kurdish',
  'Kyrgyz',
  'Lao',
  'Latvian',
  'Lithuanian',
  'Macedonian',
  'Malay',
  'Malayalam',
  'Maltese',
  'Maori',
  'Marathi',
  'Mongolian',
  'Nepali',
  'Norwegian',
  'Pashto',
  'Persian',
  'Polish',
  'Portuguese',
  'Punjabi',
  'Romanian',
  'Russian',
  'Samoan',
  'Serbian',
  'Sindhi',
  'Sinhala',
  'Slovak',
  'Slovenian',
  'Somali',
  'Spanish',
  'Swahili',
  'Swedish',
  'Tagalog',
  'Tajik',
  'Tamil',
  'Telugu',
  'Thai',
  'Tibetan',
  'Tigrinya',
  'Turkish',
  'Turkmen',
  'Ukrainian',
  'Urdu',
  'Uyghur',
  'Uzbek',
  'Vietnamese',
  'Welsh',
  'Xhosa',
  'Yiddish',
  'Yoruba',
  'Zulu',
  'Other'
]

export const GENDERS = [
  '- Select an option -',
  'Female',
  'Male',
  'Transgender',
  'Neutral',
  'Non-Binary',
  'Fluid',
  'Agender',
  'Pangender',
  'Queer',
  'Two-Spirit',
  'Other'
]

export const SEXUAL_ORIENTATIONS = [
  '- Select an option -',
  'Heterosexual',
  'Bisexual',
  'Lesbian',
  'Gay',
  'Asexual',
  'Queer',
  'Polysexual',
  'Pansexual',
  'Other'
]

export const PRONOUNS = [
  '- Select an option -',
  'He / Him',
  'She / Her',
  'They / Them',
  'Ze / Zir',
  'Xe / Xem',
  'Ze / Hir',
  'Per / Per',
  'Other'
]

export const RELATIONSHIP_STATUS = [
  '- Select an option -',
  'Single',
  'In a relationship',
  'Engaged',
  'Married',
  "It's complicated",
  'In an open relationship',
  'Widowed',
  'Separated',
  'Divorced',
  'Other'
]

export const EMPLOYMENT_STATUS = [
  '- Select an option -',
  'Studying',
  'Working',
  'Chilling',
  'Looking for a job',
  'Home/Family',
  'Retired',
  'Other'
]

export const TEST = ['- Select an option -', 'Test', 'Other']
