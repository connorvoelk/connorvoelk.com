// The timeline page draws Connor's history as an NYC subway strip map: one
// line, with each milestone a station. Stations are evenly spaced (subway
// maps aren't to scale), oldest on the left.
//
// Under each station, "transfer" bullets show which parts of his life it
// belongs to. Those are the threads below; their colors match the resume's
// dots where the two overlap.

export const threads = {
  hale: { letter: 'H', name: 'Nathan Hale High School', color: '#001375', text: '#ffffff' },
  uw: { letter: 'U', name: 'University of Washington', color: '#32006E', text: '#ffffff' },
  coaching: { letter: 'J', name: 'Coaching ultimate at Jane Addams Middle School', color: '#D31212', text: '#ffffff' },
  tesla: { letter: 'T', name: 'Tesla', color: '#E82127', text: '#ffffff' },
  aws: { letter: 'A', name: 'Amazon Web Services', color: '#FF9900', text: '#232F3E' },
  // Connor's own projects wear the site logo's green-to-cyan gradient
  projects: {
    letter: 'P',
    name: 'My own projects',
    color: 'linear-gradient(135deg, #22c55e, #06b6d4)',
    text: '#06210f',
  },
} as const

export type ThreadId = keyof typeof threads

export interface Station {
  id: string
  // Year and month, for ordering and the year markers
  date: string
  // Shown on the map, so keep it short
  label: string
  // Shown when the station is selected
  title: string
  when: string
  threads: ThreadId[]
  description: string
  href?: string
}

export const stations: Station[] = [
  {
    id: 'hale',
    date: '2015-09',
    label: 'Nathan Hale High School',
    title: 'Nathan Hale High School',
    when: '2015 – 2018',
    threads: ['hale'],
    description: 'High school in Seattle, where I graduated with honors marks and AP credits.',
  },
  {
    id: 'slovenian-union',
    date: '2018-03',
    label: 'Slovenian Union of America site',
    title: 'Slovenian Union of America website',
    when: 'Spring 2018',
    threads: ['hale'],
    description: 'One of my two senior capstone projects at Hale: a website for the Slovenian Union of America.',
  },
  {
    id: 'tech-night',
    date: '2018-05',
    label: 'Hale Tech Night',
    title: 'Hale Tech Night',
    when: 'May 2018',
    threads: ['hale'],
    description: "My other senior capstone project: Hale's Technology Night, more than 50 hours of work.",
  },
  {
    id: 'uw',
    date: '2018-09',
    label: 'University of Washington',
    title: 'University of Washington',
    when: '2018 – 2022',
    threads: ['uw'],
    description: 'Started my B.S. in Informatics, with a specialization in Human Computer Interaction.',
    href: '/resume',
  },
  {
    id: 'coaching',
    date: '2019-02',
    label: 'Ultimate coach',
    title: 'Ultimate coach at Jane Addams Middle School',
    when: '2019 – 2022',
    threads: ['coaching'],
    description: 'Coached the middle school ultimate frisbee team.',
  },
  {
    id: 'pokedb',
    date: '2020-08',
    label: 'PokeDB',
    title: 'PokeDB',
    when: '2020',
    threads: ['uw', 'projects'],
    description: 'Led a team of four building a SQL Server database for competitive Pokémon battles.',
    href: '/projects/pokedb',
  },
  {
    id: 'head-helper',
    date: '2020-08',
    label: 'Head Helper',
    title: 'Head Helper',
    when: '2020',
    threads: ['projects'],
    description: 'Designed a headache journal that connects migraines to sleep, hydration, exercise, and medication.',
    href: '/projects/head-helper',
  },
  {
    id: 'ischool-ta',
    date: '2020-09',
    label: 'iSchool TA',
    title: 'Teaching assistant at the UW iSchool',
    when: '2020 – 2022',
    threads: ['uw'],
    description:
      'TA for Intro to Relational Databases, Advanced Relational Databases, Android Application Development, and Web Development.',
  },
  {
    id: 'ubicomp',
    date: '2020-10',
    label: 'UbiComp Lab',
    title: 'Research assistant, UW CSE UbiComp Lab',
    when: 'Oct 2020 – Jan 2021',
    threads: ['uw'],
    description: 'Android development for research in the UW Ubiquitous Computing Lab.',
  },
  {
    id: 'photogram',
    date: '2020-12',
    label: 'Photogram',
    title: 'Photogram',
    when: 'Fall 2020',
    threads: ['uw', 'projects'],
    description: 'A pared-down Instagram for Android, built with Kotlin and Firebase.',
    href: '/projects/photogram',
  },
  {
    id: 'tesla',
    date: '2021-01',
    label: 'Tesla',
    title: 'Software Engineer Intern, Tesla',
    when: 'Jan – Jun 2021, Palo Alto',
    threads: ['tesla'],
    description:
      'Automated hardware-in-the-loop test data ingestion with a Python and Kafka pipeline, and built a React and Flask app for live sensor data.',
  },
  {
    id: 'aws-intern',
    date: '2021-06',
    label: 'AWS internship',
    title: 'Cloud Architect Intern, AWS Professional Services',
    when: 'Jun – Sep 2021, remote',
    threads: ['aws'],
    description: 'My first time at AWS: a cloud architecture internship with Professional Services.',
  },
  {
    id: 'cloud-practitioner',
    date: '2021-08',
    label: 'Cloud Practitioner',
    title: 'AWS Certified Cloud Practitioner',
    when: 'Aug 2021',
    threads: ['aws'],
    description: 'My first AWS certification, earned during the internship.',
  },
  {
    id: 'listening-pal',
    date: '2022-05',
    label: 'ListeningPal',
    title: 'ListeningPal',
    when: '2022',
    threads: ['uw', 'projects'],
    description:
      'Informatics capstone: mobile apps for booking anonymous calls with a trained peer listener, built with Flutter and AWS.',
    href: '/projects/listening-pal',
  },
  {
    id: 'graduation',
    date: '2022-06',
    label: 'Graduated UW',
    title: 'Graduated from UW',
    when: 'June 2022',
    threads: ['uw'],
    description: 'B.S. in Informatics, Specialization in Human Computer Interaction.',
    href: '/resume',
  },
  {
    id: 'aws-proserve',
    date: '2022-07',
    label: 'AWS Professional Services',
    title: 'Software Engineer, Delivery Consultant, AWS',
    when: '2022 – 2024',
    threads: ['aws'],
    description: 'Built full-stack web applications on React, GraphQL, and AWS backends for enterprise media customers.',
    href: '/resume',
  },
  {
    id: 'solutions-architect',
    date: '2022-08',
    label: 'Solutions Architect',
    title: 'AWS Certified Solutions Architect – Associate',
    when: '2022, recertified 2026',
    threads: ['aws'],
    description: 'Earned in August 2022 and recertified in 2026.',
  },
  {
    id: 'developer',
    date: '2022-12',
    label: 'Developer',
    title: 'AWS Certified Developer – Associate',
    when: '2022, recertified 2026',
    threads: ['aws'],
    description: 'Earned in December 2022 and recertified in 2026.',
  },
  {
    id: 'cloud-app-dev',
    date: '2024-01',
    label: 'Cloud Application Developer',
    title: 'Cloud Application Developer, AWS',
    when: '2024 – 2026',
    threads: ['aws'],
    description:
      'Designed and built production GenAI and IoT systems for enterprise customers: an agentic AI platform for a Fortune 50 healthcare company, and a mobile telemetry SDK for a satellite provider.',
    href: '/resume',
  },
  {
    id: 'ai-practitioner',
    date: '2025-01',
    label: 'AI Practitioner',
    title: 'AWS Certified AI Practitioner',
    when: 'Jan 2025',
    threads: ['aws'],
    description: 'Certified on the foundations of AI and generative AI on AWS.',
  },
  {
    id: 'mani',
    date: '2025-06',
    label: 'Mani',
    title: 'Mani',
    when: '2025 – now',
    threads: ['projects'],
    description: 'Started building Mani, a to-do app that files your tasks for you with the language model on your iPhone.',
    href: '/projects/mani',
  },
  {
    id: 'ml-engineer',
    date: '2026-02',
    label: 'ML Engineer',
    title: 'AWS Certified Machine Learning Engineer – Associate',
    when: 'Feb 2026',
    threads: ['aws'],
    description: 'Certified on building, deploying, and operating machine learning workloads on AWS.',
  },
  {
    id: 'site',
    date: '2026-10',
    label: 'connorvoelk.com',
    title: 'connorvoelk.com',
    when: 'Oct 2026',
    threads: ['projects'],
    description: 'This site went live, after a long time in the works.',
    href: '/',
  },
  {
    id: 'now',
    date: '2026-10',
    label: 'Now',
    title: 'Now',
    when: 'Today',
    threads: ['projects'],
    description: 'Building my own projects (Mani, [obj], and this site), and open to my next full-time role.',
    href: '/projects',
  },
]

// The end of the line, highlighted like a subway display's NEXT STOP
export const nextStop = {
  label: 'My next full-time role',
  description: "I'm open to my next full-time role. My resume has the details.",
  href: '/resume',
}
