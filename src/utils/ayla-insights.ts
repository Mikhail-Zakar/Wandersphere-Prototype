import { Experience, LiveThread } from '../data/mock-data';

// Deeply contextual, location-specific insights that make AYLA feel alive
export function getAylaInsights(experience: Experience): string[] {
  const insightMap: Record<string, string[]> = {
    'sri-lanka-temple': [
      'The stone beneath your feet is cool granite, worn smooth by thirty million hands over six centuries. Feel how the morning air holds prayers.',
      'Anura lights the first lamp at 4:47 AM every morning—thirty years, never missed. The temple bells know his rhythm by heart.',
      'Listen: the chanting you hear isn\'t recorded. Three monks are singing in the inner sanctum right now, their voices wrapping around the pillars like incense smoke.',
      'The mist? It rises from the Mahaweli River below. By 7 AM it will burn away, but this hour—this suspended, sacred hour—belongs only to pilgrims and temple keepers.',
      'That metallic sweetness in the air? Frangipani blossoms and oil lamps. The smell stays in your hair all day, even after you leave.'
    ],
    'portugal-fishing': [
      'João\'s hands tell the story: thirty years of salt water, rope burns, and fish scales. The ocean writes itself on skin.',
      'The nets he mends were his father\'s, and his grandfather\'s before that. See those darker patches? Hand-sewn repairs spanning generations.',
      'The seagulls here aren\'t just noise—they\'re the town clock. When they circle like this, low and insistent, the boats are twenty minutes out.',
      'That weathered wood? Atlantic pine, cured by decades of salt spray. Touch it in your mind—rough, silvered, warm from the sun even in the cold dawn.',
      'The rhythm of his hands never stops: pull, loop, tie. It\'s meditation without trying. His mind is as still as the harbor at midnight.'
    ],
    'kyoto-origami': [
      'The paper whispers as she folds—washi paper, handmade in Kyoto for 400 years. Each sheet costs more than you\'d think, but Yuki says cheap paper doesn\'t hold memory.',
      'That folk song? It\'s about cranes flying home in autumn. Her mother sang it, her grandmother sang it. Now only Yuki remembers all seven verses.',
      'Watch her hands: no hesitation, no measuring. Seventy years of muscle memory. She could fold a crane in total darkness.',
      'The afternoon light through the shoji screens creates those soft shadows. In Japan, they call this komorebi—light filtering through leaves. Here, it\'s light through rice paper.',
      'She doesn\'t count her folds anymore. "After ten thousand," she told me once, "the cranes fold themselves."'
    ],
    'mexico-musician': [
      'Rain mixes with guitar strings—that particular metallic sound happens only here, where the humidity is 80% and Carlos refuses to stop playing.',
      'His guitar is fifty-three years old, older than he is. His father played it on this exact corner. The wood remembers every rainstorm.',
      'The city breathes around him: car horns become percussion, rain becomes rhythm. He doesn\'t play over the city—he plays with it.',
      'That smell? Wet concrete, street tacos from the corner stand, diesel, and somehow—underneath it all—night-blooming jasmine. Mexico City at 7 PM.',
      'When he closes his eyes like that, he\'s not performing. He\'s praying. Music is how he talks to God, and God answers in raindrops.'
    ],
    'mexico-party': [
      'The neighborhood doesn\'t celebrate special occasions—they celebrate Saturday. Every weekend, this joy. This is life, not a break from it.',
      'That laughter you hear? That\'s Señora Martinez, age 73. She brings homemade tamales every week and dances until 2 AM. "I\'ll rest when I\'m dead," she says.',
      'The mariachi band isn\'t hired—they\'re neighbors. Carlos on trumpet teaches math. Rosa on violin runs the corner store. This is what community sounds like.',
      'Smell the air: grilled corn, cilantro, lime, wood smoke, cheap perfume, and underneath it all—possibility. Saturday night possibility.',
      'The fireworks aren\'t for anything. They\'re just because. Because we\'re alive. Because we\'re together. Because the sky is huge and we are small and joyful.'
    ]
  };

  return insightMap[experience.id] || [
    `${experience.host?.name || 'The host'} has been sharing this exact moment for years. Every time feels like the first time.`,
    `The ${experience.soundscape?.split(',')[0] || 'sound'} you hear? That's the authentic texture of ${experience.location}. No studio could recreate it.`,
    `It's ${experience.timeOfDay} in ${experience.location}. Time moves differently here—slower, more intentional.`,
  ];
}

export function getAylaThreadInsights(thread: LiveThread): string[] {
  const insightMap: Record<string, string[]> = {
    'thread-portugal-dawn': [
      'Maria arranges flowers in the dark—roses, carnations, freesias. By the time the sun rises, her hands will smell like a garden for three days.',
      'The fishermen know her by name. She knows which boats will have good catches by how they sit in the water. She\'s never wrong.',
      'That golden hour light? It only lasts eleven minutes here. Photographers travel thousands of miles for this exact eleven minutes.',
      'The dock wood is soaked in fish oil and salt water. That smell—you either love it or hate it. Maria says it smells like home.'
    ],
    'thread-kyoto-temple': [
      'Kenji strikes the bell 108 times every morning—once for each human desire that causes suffering. By the 54th ring, his mind is completely empty.',
      'The bell was cast in 1643. Its voice hasn\'t changed in 383 years. The same sound waves that touched samurai now touch you.',
      'Watch how he breathes before each strike. Meditation isn\'t the silence after—it\'s the breath before.',
      'The sunrise through temple smoke creates that otherworldly glow. Photographers call it "god light." Kenji calls it "just Tuesday."'
    ],
    'thread-mexico-market': [
      'Rosa\'s textiles use natural dyes: cochineal beetles for red, indigo for blue. The colors will outlive you. They\'ll outlive your grandchildren.',
      'Her grandmother taught her which threads to use for which patterns. The knowledge lives in hands, not books. When Rosa dies, some patterns die with her.',
      'That particular shade of orange? It only comes from marigolds grown in volcanic soil. You can\'t fake it. You can\'t rush it.',
      'Market day starts at 4 AM. Setup takes three hours. By 7 AM, everything must be perfect. This is her cathedral, and she\'s preparing for service.'
    ]
  };

  return insightMap[thread.id] || [
    `${thread.host.name} has been doing this ritual from ${thread.host.location} with dedication that borders on devotion.`,
    'This moment is happening right now, thousands of miles away. You\'re not watching a video—you\'re witnessing real life.',
    'Every detail you see tells a story. The worn surfaces, the practiced hands, the particular way the light falls—nothing here is an accident.',
  ];
}
