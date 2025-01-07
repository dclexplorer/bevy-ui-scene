import { Color4 } from '@dcl/sdk/math'
import { type Invitation, type Friend } from './definitions'

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
export const ALPHA_BLACK_PANEL: Color4 = { ...Color4.Black(), a: 0.9 }
export const UNSELECTED_TEXT_WHITE: Color4 = { ...ALMOST_WHITE, a: 0.5 }

export const GRAY_TEXT: Color4 = Color4.create(
  113 / 255,
  107 / 255,
  124 / 255,
  1
)

export const BLACK_TEXT: Color4 = Color4.create(22 / 255, 21 / 255, 24 / 255, 1)

export const PANEL_BACKGROUND_COLOR: Color4 = Color4.create(
  228 / 255,
  228 / 255,
  228 / 255,
  1
)

export const DCL_SNOW: Color4 = Color4.create(
  252 / 255,
  252 / 255,
  252 / 255,
  1
)

export const SELECTED_BUTTON_COLOR: Color4 = { ...Color4.Gray(), a: 0.3 }

// LINKS
export const DCL_DAO_EXPLORERS_DS: string =
  'https://discordapp.com/channels/1156930256545009674/1157417657562304522'

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
  'Decentraland',
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

export const TEST_FRIENDS: Friend[] = [
  { id: '1', status: 'online' },
  { id: '2', status: 'offline' },
  { id: '3', status: 'online' },
  { id: '4', status: 'offline' },
  { id: '5', status: 'online' },
  { id: '6', status: 'offline' },
  { id: '7', status: 'online' },
  { id: '8', status: 'offline' },
  { id: '9', status: 'online' },
  { id: '10', status: 'offline' },
  { id: '11', status: 'online' },
  { id: '12', status: 'offline' },
  { id: '13', status: 'online' }
]

export const TEST_INVITATIONS: Invitation[] = [
  { id: '1', status: 'received', message: 'Hey bro...', date: 'DEC 1' },
  { id: '2', status: 'sent', message: 'Hello', date: 'DEC 2' },
  { id: '3', status: 'sent', message: 'Whats up?', date: 'DEC 3' },
  {
    id: '4',
    status: 'received',
    message: 'Want to earn crypto?',
    date: 'DEC 4'
  },
  { id: '5', status: 'sent', message: 'asd', date: 'DEC 5' },
  { id: '6', status: 'received', message: 'asd2', date: 'DEC 6' },
  {
    id: '7',
    status: 'sent',
    message:
      'This is an extense message to try the truncater function - This is an extense message to try the truncater function - This is an extense message to try the truncater function - This is an extense message to try the truncater function - This is an extense message to try the truncater function',
    date: 'DEC 7'
  }
]

export const LEFT_PANEL_MIN_WIDTH = 320
export const LEFT_PANEL_WIDTH_FACTOR = 0.15
