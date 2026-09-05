export type Kind =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects';
export type Entry = {
  id: string;
  title: string;
  organization: string;
  dates: string;
  description: string;
};
export type Section = {
  id: string;
  kind: Kind;
  text: string;
  entries: Entry[];
};
export type Resume = {
  personal: Record<string, string>;
  sections: Section[];
  template: string;
};
export const templates = [
  'modern',
  'classic',
  'minimal',
  'professional',
] as const;
export const kinds: Kind[] = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
];
export const initial: Resume = {
  template: 'modern',
  personal: {
    name: 'Alex Morgan',
    role: 'Product Designer',
    email: 'alex.morgan@example.com',
    phone: '+1 (415) 555-0123',
    location: 'San Francisco, CA',
    website: 'example.com',
  },
  sections: [
    {
      id: 's1',
      kind: 'summary',
      text: 'Thoughtful product designer with 5+ years of experience turning complex challenges into simple, meaningful experiences. Passionate about building products that make everyday life better.',
      entries: [],
    },
    {
      id: 's2',
      kind: 'experience',
      text: '',
      entries: [
        {
          id: 'e1',
          title: 'Senior Product Designer',
          organization: 'Studio North',
          dates: '2022 - Present',
          description:
            'Led end-to-end design for digital products used by over 50,000 people.\nBuilt a design system that reduced design-to-development time by 30%.\nPartnered with product and engineering teams to launch three new products.',
        },
        {
          id: 'e2',
          title: 'Product Designer',
          organization: 'Forma',
          dates: '2019 - 2022',
          description:
            'Designed intuitive web and mobile experiences for early-stage startups.\nConducted user research and translated insights into product improvements.',
        },
      ],
    },
    {
      id: 's3',
      kind: 'education',
      text: '',
      entries: [
        {
          id: 'e3',
          title: 'B.A. in Interaction Design',
          organization: 'California College of the Arts',
          dates: '2015 - 2019',
          description: '',
        },
      ],
    },
    {
      id: 's4',
      kind: 'skills',
      text: 'Product strategy, User research, Interaction design, Prototyping, Figma, Design systems',
      entries: [],
    },
    {
      id: 's5',
      kind: 'projects',
      text: '',
      entries: [
        {
          id: 'e4',
          title: 'Mindful - a daily wellbeing app',
          organization: 'Personal project',
          dates: '2023',
          description:
            'Created a simple, accessible space to build healthier daily habits.',
        },
      ],
    },
  ],
};
export function validResume(x: unknown): x is Resume {
  if (!x || typeof x !== 'object') return false;
  const r = x as Resume;
  return (
    templates.includes(r.template as (typeof templates)[number]) &&
    r.personal &&
    Object.keys(initial.personal).every(
      (k) => typeof r.personal[k] === 'string',
    ) &&
    Array.isArray(r.sections) &&
    r.sections.every(
      (s) =>
        s &&
        typeof s.id === 'string' &&
        kinds.includes(s.kind) &&
        typeof s.text === 'string' &&
        Array.isArray(s.entries) &&
        s.entries.every(
          (e) =>
            e &&
            ['id', 'title', 'organization', 'dates', 'description'].every(
              (k) =>
                typeof (e as unknown as Record<string, unknown>)[k] ===
                'string',
            ),
        ),
    )
  );
}
