// Transcribed from Connor's SDE 2026 resume, v3 (his general-purpose version;
// tailored variants stay off the site). Contact details are deliberately
// limited to city and public profile links — never add a phone number,
// address, or email here (scripts/check-private-info.mjs enforces the phone
// part at build time).

// Text with some words linked: plain strings are written as-is, and
// link(text, href) pieces become links (on the page and in the PDF)
export type RichText = (string | { text: string; href: string })[]
const link = (text: string, href: string) => ({ text, href })

const aws = (path: string) => `https://aws.amazon.com/${path}`

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
  href: string
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
    'Software engineer with 4+ years at AWS and Tesla, building production GenAI, cloud, and IoT systems end to end, from distributed backends and mobile SDKs to the React interfaces people use every day.',
  experience: [
    {
      name: 'Amazon Web Services (AWS)',
      href: aws(''),
      location: 'Seattle, WA',
      roles: [
        {
          title: 'Cloud Application Developer',
          dates: 'January 2024 – July 2026',
          dotColor: brandColors.amazonOrange,
          summary:
            'Designed and built production GenAI and IoT systems for enterprise customers, from architecture to launch.',
          projects: [
            {
              name: 'Agentic AI Platform',
              client: 'Fortune 50 Healthcare Company',
              contractValue: '$1.9M',
              bullets: [
                'Enabled thousands of internal users to deploy autonomous agents for cross-functional API tasks by architecting an enterprise platform on LangChain, AWS Bedrock AgentCore, and MCP, running on Amazon EKS.',
                'Accelerated knowledge discovery across millions of data points by building a GraphRAG system on Amazon Neptune, Redis, and Textract that maps semantic relationships for retrieval by other GenAI products.',
                'Partnered with the Bedrock AgentCore service team as an early adopter, reporting gaps found in production.',
              ],
            },
            {
              name: 'Mobile Telemetry SDK',
              client: 'Market-Leading Satellite Provider',
              contractValue: '$1.5M',
              bullets: [
                'Led a team of 3 engineers building a Kotlin Android SDK from the ground up on dozens of system APIs, which automakers integrated into their apps and Android Auto for location sharing and emergency assistance.',
                'Reduced messaging costs 3.5x and achieved sub-50ms latency by replacing HTTP APIs with a pub/sub messaging layer over MQTT on AWS IoT Core.',
              ],
            },
          ],
        },
        {
          title: 'Software Engineer, Delivery Consultant',
          dates: 'July 2022 – January 2024',
          dotColor: brandColors.awsSquid,
          summary:
            'Built full-stack web applications on React, GraphQL, and AWS backends for enterprise media customers.',
          projects: [
            {
              name: 'ML-Powered Forecasting Tool',
              client: 'Major National Media Network',
              contractValue: '$2.0M',
              bullets: [
                'Increased ad-slot sales 15% on average with a simulation tool that let non-technical users model viewership scenarios in real time, visualizing demographic data for multi-million dollar scheduling decisions.',
                'Built the viewership forecasting model in Amazon SageMaker (feature engineering, training, inference), served through a React, Redux, and AppSync GraphQL app on DynamoDB.',
              ],
            },
            {
              name: 'Multi-Destination Live-Stream Orchestrator',
              client: 'Large Social Media Company',
              contractValue: '$1.4M',
              bullets: [
                'Saved a $1.4M contract by taking over a failing engagement, rebuilding the UI and backend in 4 weeks.',
                'Consolidated 8 streaming destinations into one AWS Elemental interface, cutting broadcast hardware overhead.',
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Tesla',
      href: 'https://www.tesla.com',
      location: 'Palo Alto, CA',
      roles: [
        {
          title: 'Software Engineer Intern',
          dates: 'January – June 2021',
          dotColor: brandColors.teslaRed,
          bullets: [
            'Automated real-time HIL test data ingestion with a Python/Kafka pipeline, replacing manual reporting.',
            'Built a centralized React/Flask app for live sensor visualization and sub-second queries over legacy test data.',
          ],
        },
      ],
    },
  ] satisfies ResumeCompany[],
  education: {
    school: 'University of Washington',
    href: 'https://www.washington.edu',
    location: 'Seattle, WA',
    degree: [
      'Bachelor of Science in ',
      link('Informatics', 'https://ischool.uw.edu/programs/informatics'),
      ', Specialization in Human Computer Interaction',
    ] satisfies RichText,
    year: '2022',
    dotColor: brandColors.huskyPurple,
    honors: [
      "Dean's List Scholarship, ",
      link('CSE', 'https://www.cs.washington.edu'),
      ' ',
      link('UbiComp Lab', 'https://ubicomplab.cs.washington.edu'),
      ' Research Assistant, ',
      link('iSchool', 'https://ischool.uw.edu'),
      ' Teaching Assistant',
    ] satisfies RichText,
  },
  skills: [
    {
      name: 'Languages & Frameworks',
      items: [
        'TypeScript / JavaScript, Python, Java, Kotlin, SQL, Bash, GraphQL (',
        link('Apollo', 'https://www.apollographql.com'),
        '), React.js, Redux, Node.js, Flask, ',
        link('LangChain', 'https://www.langchain.com'),
        ', Jest, ',
        link('Playwright', 'https://playwright.dev'),
        ', Android, IaC (',
        link('CDK', aws('cdk/')),
        ', ',
        link('Terraform', 'https://developer.hashicorp.com/terraform'),
        ')',
      ],
    },
    {
      name: 'Tools & Technologies',
      items: [
        'AWS (',
        link('Bedrock AgentCore', aws('bedrock/agentcore/')),
        ', ',
        link('SageMaker', aws('sagemaker/')),
        ', ',
        link('EKS', aws('eks/')),
        ', ',
        link('Neptune', aws('neptune/')),
        ', ',
        link('DynamoDB', aws('dynamodb/')),
        ', ',
        link('AppSync', aws('appsync/')),
        ', ',
        link('IoT Core', aws('iot-core/')),
        ', ',
        link('Elemental', aws('media-services/elemental/')),
        '), PostgreSQL, Redis, ',
        link('Kafka', 'https://kafka.apache.org'),
        ', Docker, Kubernetes, CI/CD, GraphRAG, ',
        link('MCP', 'https://modelcontextprotocol.io'),
        ', REST, MQTT, Figma',
      ],
    },
    {
      name: 'AWS Certifications',
      items: [
        link('Solutions Architect', aws('certification/certified-solutions-architect-associate/')),
        ', ',
        link('Developer', aws('certification/certified-developer-associate/')),
        ', ',
        link('Machine Learning Engineer', aws('certification/certified-machine-learning-engineer-associate/')),
        ' (2026); ',
        link('AI Practitioner', aws('certification/certified-ai-practitioner/')),
        ' (2025)',
      ],
    },
  ] satisfies { name: string; items: RichText }[],
}
