// Transcribed from Connor's 2026 resume. Contact details are deliberately
// limited to city and public profile links — never add a phone number,
// address, or email here (scripts/check-private-info.mjs enforces the phone
// part at build time).

export interface ResumeProject {
  name: string
  client: string
  contractValue: string
  bullets: string[]
}

// Brand colors for the dots on the web resume's date rail
export const brandColors = {
  amazonOrange: '#FF9900', // Amazon's primary brand color
  awsSquid: '#232F3E', // the navy AWS calls "Squid" (Squid Ink)
  teslaRed: '#E82127',
  huskyPurple: '#32006E', // UW's primary brand color
}

export interface ResumeRole {
  title: string
  dates: string
  dotColor: string
  summary?: string
  projects?: ResumeProject[]
  bullets?: string[]
}

export interface ResumeCompany {
  name: string
  location: string
  roles: ResumeRole[]
}

export const resume = {
  name: 'Connor Voelk',
  location: 'Seattle, WA',
  links: [
    { label: 'linkedin.com/in/connorvoelk', href: 'https://www.linkedin.com/in/connorvoelk' },
    { label: 'github.com/connorvoelk', href: 'https://github.com/connorvoelk' },
  ],
  summary:
    'Software Engineer with 4+ years of experience at AWS and Tesla, specializing in delivering value through GenAI and Cloud platforms through production-grade architecture and intuitive product design.',
  experience: [
    {
      name: 'Amazon Web Services (AWS)',
      location: 'Seattle, WA',
      roles: [
        {
          title: 'Cloud Application Developer',
          dates: 'January 2024 – July 2026',
          dotColor: brandColors.amazonOrange,
          summary:
            'Translating C-suite business requirements into high-impact GenAI and cloud-native software architectures.',
          projects: [
            {
              name: 'Agentic AI Platform',
              client: 'Fortune 50 Healthcare',
              contractValue: '$1.9M',
              bullets: [
                'Enabled thousands of internal users to deploy autonomous agents for cross-functional API tasks by architecting an enterprise platform using LangChain, AWS Bedrock AgentCore, and Model Context Protocol (MCP).',
                'Accelerated knowledge discovery across millions of data points by developing a GraphRAG system utilizing Amazon Neptune, Redis, and Textract to map complex semantic relationships.',
              ],
            },
            {
              name: 'Mobile Telemetry SDK',
              client: 'Market-Leading Satellite Provider',
              contractValue: '$1.5M',
              bullets: [
                'Led a team of 3 developers to build an Android Mobile SDK from the ground up, delivering a cross-platform telemetry solution for Android Auto utilizing dozens of system APIs.',
                'Reduced messaging costs by 3.5x and achieved sub-50ms latency by engineering a peer-to-peer networking layer using AWS IoT Core and MQTT as an alternative to traditional HTTP APIs.',
              ],
            },
          ],
        },
        {
          title: 'Frontend Engineer, Delivery Consultant',
          dates: 'July 2022 – January 2024',
          dotColor: brandColors.awsSquid,
          summary:
            'Leveraging value and impact through intuitive, high-performance user interfaces for complex backends.',
          projects: [
            {
              name: 'ML-Driven Dashboard',
              client: 'Major National Media Network',
              contractValue: '$2.0M',
              bullets: [
                'Increased ad-slot sales by 15% on average by designing a simulation system that enabled non-technical users to model complex viewership permutations in real-time.',
                'Streamlined the full product lifecycle from Figma prototyping to a React.js & GraphQL production app, visualizing granular demographic data for multi-million dollar scheduling decisions.',
              ],
            },
            {
              name: 'Multi-Destination Live-Stream Orchestrator',
              client: 'Fortune 10 Big Tech Platform',
              contractValue: '$1.4M',
              bullets: [
                'Prevented the cancellation of a $1.4M contract by rescuing a failing engagement and revitalizing the UX/UI and backend abstraction layer within a high-velocity 4-week window to restore customer confidence.',
                'Consolidated 8 disparate streaming destinations into a single interface, significantly reducing hardware overhead and operational complexity for broadcast engineers via AWS Elemental.',
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Tesla',
      location: 'Palo Alto, CA',
      roles: [
        {
          title: 'Software Engineer Intern',
          dates: 'January – June 2021',
          dotColor: brandColors.teslaRed,
          bullets: [
            'Automated real-time data ingestion and processing for hardware-in-the-loop (HIL) testing by architecting a Python and Apache Kafka pipeline, replacing manual reporting for urgent hardware tests.',
            'Developed a centralized web application using React.js and Flask, featuring visualizations that enabled engineers to monitor live sensor streams and query legacy test data with sub-second response times.',
          ],
        },
      ],
    },
  ] satisfies ResumeCompany[],
  education: {
    school: 'University of Washington',
    location: 'Seattle, WA',
    degree: 'Bachelor of Science in Informatics, Specialization in Human Computer Interaction',
    year: '2022',
    dotColor: brandColors.huskyPurple,
    honors: "Dean's List Scholarship, iSchool Teaching Assistant, Computer Science School Research Assistant",
  },
  skills: [
    {
      name: 'AWS Certifications',
      items: 'Solutions Architect (2026), Developer (2026), Machine Learning Engineer (2026), AI Practitioner (2025)',
    },
    {
      name: 'Languages & Frameworks',
      items: 'Typescript / Javascript, Node.js, React.js, Python, Java, Kotlin, SQL, GraphQL, Dart (Flutter), IaC (CDK, Terraform)',
    },
    {
      name: 'Tools & Technologies',
      items: 'AWS, Docker, K8s, Micro-frontends, CI/CD, GraphRAG, Agent Orchestration, IoT, MCP, REST, MQTT, Figma',
    },
  ],
}
