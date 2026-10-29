import type { StaticImageData } from 'next/image'
import maniApp from './media/mani/app-home.webp'
import maniFigma from './media/mani/figma-home.webp'
import lpHome from './media/listening-pal/home.webp'
import lpSchedule from './media/listening-pal/schedule.webp'
import lpConfirm from './media/listening-pal/confirm.webp'
import lpJoin from './media/listening-pal/join.webp'
import lpCall from './media/listening-pal/call.webp'
import lpSignUp from './media/listening-pal/sign-up.webp'
import lpResources from './media/listening-pal/resources.webp'
import photogramFeed from './media/photogram/feed.webp'
import photogramUpload from './media/photogram/upload.webp'
import photogramFeed2 from './media/photogram/feed-2.webp'
import photogramSettings from './media/photogram/settings.webp'
import pokedbErd from './media/pokedb/erd.webp'
import pokedbLogo from './media/pokedb/logo.svg'
import hhJournals from './media/head-helper/journals.webp'
import hhGoal from './media/head-helper/goal.webp'
import hhProgress from './media/head-helper/progress.webp'
import type { TagId } from './tags'

export interface ProjectImage {
  src: StaticImageData
  alt: string
  caption?: string
}

export interface ProjectSection {
  title: string
  paragraphs?: string[]
  bullets?: string[]
}

export interface Project {
  slug: string
  name: string
  // One line: the index card and the page's description
  tagline: string
  group: 'now' | 'earlier'
  kind: string
  years?: string
  role?: string
  team?: string
  // Shown as colored tags: what it is and what it's built with
  tags: TagId[]
  stack: string[]
  // Tints the image panels, so each project keeps its own color
  accent: string
  links: { label: string; href: string }[]
  sections: ProjectSection[]
  // 'phones' lays screenshots out in a row; 'wide' shows one big image
  gallery: { layout: 'phones' | 'wide'; images: ProjectImage[]; note?: string }
  // Shown on the index; defaults to the first gallery image
  cover?: ProjectImage
  // The project's own logo: beside its name, and the index cover if set
  logo?: StaticImageData
  // Projects that live elsewhere on the site link there instead of a page
  href?: string
  // Shown on the index as a turning 3D model instead of an image
  model?: string
}

export const projects: Project[] = [
  {
    slug: 'mani',
    name: 'Mani',
    tagline:
      'A to-do app that files your tasks for you, using the language model built into your iPhone.',
    group: 'now',
    kind: 'iOS app',
    years: '2025 – now',
    role: 'Design and development (solo)',
    tags: ['ios', 'swift', 'on-device-llm'],
    stack: ['Swift', 'SwiftUI', 'SwiftData', 'Apple Foundation Models', 'Figma'],
    accent: '#a42bea',
    links: [],
    sections: [
      {
        title: 'Why',
        paragraphs: [
          "I've always wanted a to-do app that keeps me accountable. Google Keep is too broad, Notion takes too much setup to jot something down quickly, and the apps in between never organized things the way my head does.",
          "In Mani, you type or say a task the way you'd say it out loud. The app splits it into separate tasks, files each one into the right section (work, home, groceries, whatever you've set up), and fills in due dates and repeats. You review its guesses before anything is saved.",
        ],
      },
      {
        title: 'How it works',
        bullets: [
          "The language model runs on the phone itself, through Apple's Foundation Models framework. There's no server.",
          'It learns from corrections. When you move a task to a different section, Mani remembers, and the next time you add something similar, the most relevant past corrections (found by word overlap and on-device sentence embeddings) go into the prompt.',
          "It doesn't make up dates. The small on-device model likes to invent due dates, so a plain-code check drops any date or repeat unless your words actually mention one.",
          'A benchmark of about 40 sample inputs and a scoring harness measure how well tasks get routed. The prompt is on its sixth version.',
          'Colorful section cards flip open into a full section view, under the new iOS 26 Liquid Glass tab bar.',
        ],
      },
      {
        title: 'Where it stands',
        paragraphs: [
          "I use it on my own iPhone and iPad while I build it. Next up: search, onboarding, and a mascot that reacts as you finish tasks. It's my first iOS app.",
        ],
      },
    ],
    gallery: {
      layout: 'phones',
      images: [
        {
          src: maniApp,
          alt: "Mani's home screen: colored cards for Inbox, Groceries, Personal, and Home sections, with repeating tasks showing their next dates, above a Liquid Glass tab bar",
          caption: 'The home screen, on my iPhone',
        },
        {
          src: maniFigma,
          alt: "Early mockup of Mani's home screen: colored section cards, each listing placeholder tasks with due times",
          caption: 'The early Figma mockup',
        },
      ],
    },
  },
  {
    slug: 'obj',
    name: '[obj]',
    tagline:
      "My ceramics portfolio: pieces I've made, as 3D models you can turn around in the browser.",
    group: 'now',
    kind: 'Ceramics portfolio',
    tags: ['ceramics', '3d-models', 'nextjs'],
    stack: ['Next.js', 'model-viewer', 'glTF'],
    accent: '#e5e0df',
    links: [],
    sections: [],
    gallery: { layout: 'phones', images: [] },
    href: '/obj',
    model: '/bulbasaur.glb',
  },
  {
    slug: 'listening-pal',
    name: 'ListeningPal',
    tagline:
      'Mobile apps for booking anonymous, half-hour calls with a trained peer listener.',
    group: 'earlier',
    kind: 'Mobile apps, Informatics capstone',
    years: '2022',
    role: 'Frontend, backend, cloud, and some UI/UX design',
    team: 'Emily Dooley, Madison Johnstone, Raiham Malik, and me',
    tags: ['mobile', 'flutter', 'aws', 'stripe', 'capstone'],
    stack: ['Flutter', 'Dart', 'AWS', 'Amazon Cognito', 'Stripe', 'Figma'],
    accent: '#5fb8bf',
    links: [
      { label: 'Demo video', href: 'https://www.youtube.com/watch?v=FVWiznOt_xY' },
      {
        label: 'Capstone page',
        href: 'https://ischool.uw.edu/capstone/projects/2022/listeningpal-peer-peer-mental-health-service',
      },
      { label: 'Project site', href: 'https://listeningpal22.wixsite.com/capstone-landing-pag' },
    ],
    sections: [
      {
        title: 'The problem',
        paragraphs: [
          "ListeningPal is a Pacific Northwest startup offering mental health peer support: affordable, anonymous conversations with a trained listener. It isn't therapy; it's someone to talk to. For our UW Informatics capstone, ListeningPal sponsored four of us to build its apps.",
        ],
      },
      {
        title: 'What we built',
        bullets: [
          'A user app for booking 30-minute calls on a calendar, paid for with credits bought on the ListeningPal website.',
          "Before every call, users accept the terms and confirm they aren't in crisis, with emergency resources one tap away.",
          'Calls stay anonymous: listeners never see who they are talking to.',
          'A listener app where trained listeners claim open appointments and join calls.',
          'Reporting on both sides after a call, for technical problems or conduct.',
        ],
      },
      {
        title: 'My part',
        paragraphs: [
          'I built much of the Flutter frontend for both apps, pitched in on the UI and UX design, and set up the cloud side on AWS: the database, the backend, and sign-up and login with Amazon Cognito. At the end we handed the code, the AWS setup, and the Figma files to ListeningPal to finish testing and publish.',
          'Emily Dooley led the UI and UX design, Madison Johnstone managed the project and its data science, and Raiham Malik built the frontend and backend with me.',
        ],
      },
    ],
    gallery: {
      layout: 'phones',
      note: 'Screens from our capstone showcase site.',
      images: [
        { src: lpHome, alt: 'ListeningPal home screen listing upcoming calls by week', caption: 'Upcoming calls' },
        { src: lpSchedule, alt: 'Scheduling screen with a February 2022 calendar and a time dropdown', caption: 'Picking a time' },
        { src: lpConfirm, alt: 'Confirmation dialog: use one credit to book February 3rd, 3:30 to 4 PM', caption: 'Booking with a credit' },
        { src: lpJoin, alt: "Pre-call dialog asking the user to agree to the terms and confirm they aren't in crisis", caption: 'The check before joining' },
        { src: lpCall, alt: 'In-call screen for a call with Jane, with mute and speaker buttons', caption: 'On a call' },
        { src: lpSignUp, alt: 'Sign-up form hosted by Amazon Cognito', caption: 'Sign-up, through Cognito' },
        { src: lpResources, alt: 'Resources screen listing crisis lines and national mental health organizations', caption: 'Resources' },
      ],
    },
  },
  {
    slug: 'photogram',
    name: 'Photogram',
    tagline: 'A pared-down Instagram for Android: one feed, photos, and likes.',
    group: 'earlier',
    kind: 'Android app',
    years: '2020',
    role: 'Design and development (solo)',
    tags: ['android', 'kotlin', 'firebase'],
    stack: ['Kotlin', 'Android', 'Firebase Auth', 'Firebase Realtime Database', 'Firebase Storage'],
    accent: '#6200ee',
    links: [{ label: 'Code on GitHub', href: 'https://github.com/connorvoelk/photogram' }],
    sections: [
      {
        title: 'The idea',
        paragraphs: [
          "Instagram is hugely popular, but a lot of it is built to keep you scrolling. Photogram keeps only the core: post a photo with a caption, see everyone's posts in one feed, and like them.",
        ],
      },
      {
        title: "How it's built",
        bullets: [
          'Kotlin in Android Studio, with Firebase for sign-in, the database, and photo storage.',
          'The feed listens to the database, so new posts and likes show up live.',
          'A ViewModel holds the signed-in state, and fragments switch between the feed, posting, and settings.',
          "Built for the Android Development course at the UW iSchool, which I later TA'd.",
        ],
      },
    ],
    gallery: {
      layout: 'phones',
      images: [
        { src: photogramFeed, alt: 'Photogram feed showing a photo of a silver Porsche with two likes', caption: 'The feed' },
        { src: photogramUpload, alt: 'Posting screen with a photo and the caption "beautiful day"', caption: 'Posting a photo' },
        { src: photogramFeed2, alt: 'The new post at the top of the feed', caption: 'The new post' },
        { src: photogramSettings, alt: 'Settings screen with a color choice for the post button', caption: 'Settings' },
      ],
    },
  },
  {
    slug: 'pokedb',
    name: 'PokeDB',
    tagline:
      'A SQL Server database for tracking competitive Pokémon teams, battles, and results.',
    group: 'earlier',
    kind: 'Database',
    years: '2020',
    role: 'Team lead and SQL engineer',
    team: 'Team of four',
    tags: ['sql-server', 'database-design', 'pokemon'],
    stack: ['SQL Server', 'T-SQL', 'ERD'],
    accent: '#e3350d',
    logo: pokedbLogo,
    links: [{ label: 'Code on GitHub', href: 'https://github.com/connorvoelk/PokeDB' }],
    sections: [
      {
        title: 'The problem',
        paragraphs: [
          "Competitive Pokémon players don't have a good way to keep detailed records: the Pokémon they've trained, the teams they're on, and how each battle went. PokeDB stores all of it, so a player can look back and improve.",
        ],
      },
      {
        title: 'What I did',
        bullets: [
          "Led the team: kept in touch with the other teams and the instructor, and kept everyone's pieces on track.",
          'Wrote business rules as check constraints: a team holds at most six Pokémon, and a Pokémon knows at most four moves.',
          "Wrote computed columns that work out each battle's winner and each team's win count.",
          'Wrote the stored procedures that load Pokémon, their items, and their stats from the source data.',
          'Wrote views that answer real questions, like which of the top 20 teams have played more than 10 doubles battles.',
        ],
      },
    ],
    gallery: {
      layout: 'wide',
      images: [
        {
          src: pokedbErd,
          alt: 'Entity-relationship diagram of PokeDB: species, types, generations, moves, abilities, items, stats, trainers, teams, and battles',
          caption:
            'The schema: about 20 tables for species, moves, abilities, trainers, teams, and battles.',
        },
      ],
    },
  },
  {
    slug: 'head-helper',
    name: 'Head Helper',
    tagline:
      'A headache journal that connects migraines to sleep, hydration, exercise, and medication.',
    group: 'earlier',
    kind: 'App design',
    years: '2020',
    role: 'Research and design (solo)',
    tags: ['app-design', 'figma', 'health'],
    stack: ['Figma', 'React Native'],
    accent: '#d946ef',
    links: [],
    sections: [
      {
        title: 'The idea',
        paragraphs: [
          'Migraines have a long list of possible triggers, and tracking them by hand is a chore. Head Helper turns it into a quick daily check-in, then shows how headaches line up with everything else.',
        ],
      },
      {
        title: 'The design',
        bullets: [
          'A daily journal of quick-log tiles: headaches, hydration, exercise, medication, and sleep.',
          'Each habit has a goal you set, like eight hours of sleep, and a completion percentage.',
          'A progress view charts the week against your goals, marks each headache, and breaks down headache types.',
        ],
      },
      {
        title: 'Where it stands',
        paragraphs: [
          "The design is done. I started a React Native build for Android, but it didn't get past the starter project.",
        ],
      },
    ],
    gallery: {
      layout: 'phones',
      images: [
        { src: hhJournals, alt: 'Journal screen with tiles for headache, hydration, exercise, medication, and sleep', caption: 'The daily journal' },
        { src: hhGoal, alt: 'Sleep goal dialog: eight hours a night, 100% complete', caption: 'A goal' },
        { src: hhProgress, alt: "Progress screen charting last week's habits against goals, with headaches marked", caption: 'Progress' },
      ],
    },
  },
]

// Projects with their own page here (not ones that live elsewhere on the site)
export const projectPages = projects.filter((project) => !project.href)

export const projectHref = (project: Project) =>
  project.href ?? `/projects/${project.slug}`
