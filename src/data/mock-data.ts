export interface Experience {
  id: string;
  title: string;
  location: string;
  country: string;
  imageUrl: string;
  description: string;
  type: '360' | 'live' | 'still';
  host?: {
    name: string;
    bio: string;
  };
  tags: string[];
  soundscape?: string;
  timeOfDay?: string;
  audioUrl?: string;
}

export interface LiveThread {
  id: string;
  title: string;
  host: {
    name: string;
    location: string;
    country: string;
    bio: string;
  };
  imageUrl: string;
  isLive: boolean;
  scheduledTime?: string;
  description: string;
  viewers?: number;
  tags: string[];
  audioUrl?: string;
}

export const experiences: Experience[] = [
  {
    id: 'sri-lanka-temple',
    title: 'Morning Prayer at Ancient Temple',
    location: 'Kandy',
    country: 'Sri Lanka',
    imageUrl: 'https://images.unsplash.com/photo-1606512180004-f1ec207ad076?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMHRlbXBsZSUyMHN1bnJpc2UlMjBwZWFjZWZ1bHxlbnwxfHx8fDE3NzAxMTg4MDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'The stone is cool under your palms. Temple bells echo softly through the morning mist.',
    type: '360',
    host: {
      name: 'Anura',
      bio: 'Temple keeper for 30 years. I want you to feel the peace I feel here every morning.',
    },
    tags: ['Peaceful', 'Spiritual', 'Morning'],
    soundscape: 'Temple bells, distant chanting, morning birds',
    timeOfDay: '5:30 AM',
    audioUrl: 'https://raw.githubusercontent.com/Mikhail-Zakar/Wandersphere-Prototype-Audios/main/Morning%20Prayer%20at%20Ancient%20Temple.mp3',
  },
  {
    id: 'portugal-fishing',
    title: 'Fisherman Mending Nets at Dawn',
    location: 'Nazaré',
    country: 'Portugal',
    imageUrl: 'https://images.unsplash.com/photo-1720351454152-2330e4d1fcb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0dWdhbCUyMGZpc2hlcm1hbiUyMG9jZWFuJTIwZGF3bnxlbnwxfHx8fDE3NzAxMTg4MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'The smell of salt and fish. Weathered hands work with quiet precision.',
    type: 'live',
    host: {
      name: 'João',
      bio: 'Fourth generation fisherman. The ocean is my life, my father, my teacher.',
    },
    tags: ['Ocean', 'Dawn', 'Craftsmanship'],
    soundscape: 'Waves, seagulls, rope against wood',
    timeOfDay: '6:00 AM',
    audioUrl: 'https://raw.githubusercontent.com/Mikhail-Zakar/Wandersphere-Prototype-Audios/main/Fisherman%20Mending%20Nets%20at%20Dawn.mp3',
  },
  {
    id: 'kyoto-origami',
    title: 'Grandmother Folding Origami',
    location: 'Kyoto',
    country: 'Japan',
    imageUrl: 'https://images.unsplash.com/photo-1724063029566-27853f36392c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxreW90byUyMGphcGFuJTIwdHJhZGl0aW9uYWwlMjBzdHJlZXR8ZW58MXx8fHwxNzcwMTE4ODAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'She hums a folk song her mother taught her. Each fold is a meditation.',
    type: 'live',
    host: {
      name: 'Yuki',
      bio: 'I am 78. I have folded paper for 70 years. It brings me closer to my ancestors.',
    },
    tags: ['Peaceful', 'Traditional', 'Meditation'],
    soundscape: 'Soft humming, paper rustling, distant wind chimes',
    timeOfDay: '2:00 PM',
    audioUrl: 'https://raw.githubusercontent.com/Mikhail-Zakar/Wandersphere-Prototype-Audios/main/Grandmother%20Folding%20Origami.mp3',
  },
  {
    id: 'mexico-musician',
    title: 'Street Musician in the Rain',
    location: 'Mexico City',
    country: 'Mexico',
    imageUrl: 'https://images.unsplash.com/photo-1642661913338-f15b443fbfd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY28lMjBjaXR5JTIwY29sb3JmdWwlMjBzdHJlZXR8ZW58MXx8fHwxNzcwMTE4ODAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Rain begins to fall. He keeps playing. The city breathes around him.',
    type: '360',
    host: {
      name: 'Carlos',
      bio: 'Music is my prayer. Rain or shine, I play for those who need to hear.',
    },
    tags: ['Music', 'Urban', 'Soulful'],
    soundscape: 'Guitar strings, rain on pavement, distant traffic',
    timeOfDay: '7:00 PM',
    audioUrl: 'https://raw.githubusercontent.com/Mikhail-Zakar/Wandersphere-Prototype-Audios/main/Street%20Musician%20in%20the%20Rain.mp3',
  },
  {
    id: 'mexico-party',
    title: 'Late Night Mexican Neighbourhood Party',
    location: 'Guadalajara',
    country: 'Mexico',
    imageUrl: 'https://images.unsplash.com/photo-1708553060169-f94d72cc0b9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXRlJTIwbmlnaHQlMjBtZXhpY2FuJTIwc3RyZWV0JTIwcGFydHklMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NzAyMDcyMDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Laughter spills into the street. Music pulses. The neighborhood is alive with joy.',
    type: 'live',
    host: {
      name: 'Miguel',
      bio: 'Every weekend, we gather. This is how we celebrate life, together.',
    },
    tags: ['Celebration', 'Community', 'Night'],
    soundscape: 'Mariachi music, laughter, clinking glasses, fireworks',
    timeOfDay: '11:00 PM',
    audioUrl: 'https://raw.githubusercontent.com/Mikhail-Zakar/Wandersphere-Prototype-Audios/main/Late%20Night%20Mexican%20Neighbourhood%20Party.mp3',
  },
];

export const liveThreads: LiveThread[] = [
  {
    id: 'thread-portugal-dawn',
    title: 'Dawn at the Docks',
    host: {
      name: 'Maria',
      location: 'Ocean City',
      country: 'Maryland, USA',
      bio: 'I sell flowers at the dock every morning. Come watch the city wake up with me.',
    },
    imageUrl: 'https://images.unsplash.com/photo-1720351454152-2330e4d1fcb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0dWdhbCUyMGZpc2hlcm1hbiUyMG9jZWFuJTIwZGF3bnxlbnwxfHx8fDE3NzAxMTg4MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    isLive: false,
    scheduledTime: 'Every Tuesday at 7:00 AM UTC',
    description: 'Watch Maria arrange fresh flowers as fishermen return with their catch. The air smells of roses and the sea.',
    tags: ['Dawn', 'Market', 'Ocean'],
    audioUrl: 'https://raw.githubusercontent.com/Mikhail-Zakar/Wandersphere-Prototype-Audios/main/Dawn%20at%20the%20Docks.mp3',
  },
  {
    id: 'thread-kyoto-temple',
    title: 'Temple Bells at Sunrise',
    host: {
      name: 'Kenji',
      location: 'Chiang Mai',
      country: 'Thailand',
      bio: 'Monk for 20 years. I ring the bells to wake the spirits and honor the day.',
    },
    imageUrl: 'https://images.unsplash.com/photo-1577936707408-22404e0492a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwdGVtcGxlJTIwYmVsbHMlMjBzdW5yaXNlJTIwbW9ua3xlbnwxfHx8fDE3NzAyMTkzMzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    isLive: true,
    viewers: 142,
    description: 'Shh… listen. That\'s the sound of temple bells at sunrise. Feel the vibration in your chest.',
    tags: ['Spiritual', 'Morning', 'Peaceful'],
    audioUrl: 'https://raw.githubusercontent.com/Mikhail-Zakar/Wandersphere-Prototype-Audios/main/Temple%20Bells%20at%20Sunrise.mp3',
  },
  {
    id: 'thread-mexico-market',
    title: 'Market Day Colors',
    host: {
      name: 'Rosa',
      location: 'Provence',
      country: 'France',
      bio: 'My grandmother sold textiles here. Now I do. Every thread tells a story.',
    },
    imageUrl: 'https://images.unsplash.com/photo-1682448498631-ac630423e275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYXhhY2ElMjBtZXhpY28lMjBjb2xvcmZ1bCUyMG1hcmtldCUyMHRleHRpbGVzfGVufDF8fHx8MTc3MDIxOTMzNXww&ixlib=rb-4.1.0&q=80&w=1080',
    isLive: false,
    scheduledTime: 'Every Saturday at 9:00 AM UTC',
    description: 'Join Rosa as she sets up her stall. The colors are vibrant. The sounds are alive.',
    tags: ['Culture', 'Market', 'Tradition'],
    audioUrl: 'https://raw.githubusercontent.com/Mikhail-Zakar/Wandersphere-Prototype-Audios/main/Market%20Day%20Colors.mp3',
  },
];