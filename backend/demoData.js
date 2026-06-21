export const demoLeads = [
  {
    id: "lead-1",
    name: "Sarah Jenkins",
    company: "Apex Global Tech",
    email: "sjenkins@apexglobal.io",
    phone: "+1-555-0143",
    industry: "Software & SaaS",
    notes: "Attended our Q2 Webinar. Expressed active interest in our enterprise API scaling options. Has direct budget authority. Requesting pricing for 50 seats.",
    status: "Qualified",
    aiScore: 88,
    aiCategory: "Hot",
    aiProbability: 82,
    aiReasoning: [
      "Prospect requested seat-based pricing details directly.",
      "Has direct decision-making power and budget control.",
      "Apex Global fits our primary enterprise SaaS buyer persona."
    ],
    createdAt: "2026-05-10T08:30:00Z",
    updatedAt: "2026-05-10T08:30:00Z"
  },
  {
    id: "lead-2",
    name: "Marcus Aurelius",
    company: "Rome Logistics Corp",
    email: "m.aurelius@romelogistics.com",
    phone: "+39-06-4455-901",
    industry: "Logistics & Supply Chain",
    notes: "Reached out via LinkedIn. Looking to automate scheduling and dispatch. Currently using manual spreadsheets. Budget not yet approved, seeking demonstration first.",
    status: "New",
    aiScore: 65,
    aiCategory: "Warm",
    aiProbability: 55,
    aiReasoning: [
      "Explicit interest in automated scheduling to replace spreadsheets.",
      "Budget approval is pending, which may delay sales cycle.",
      "Logistics vertical has high conversion history but long onboarding times."
    ],
    createdAt: "2026-06-15T14:22:00Z",
    updatedAt: "2026-06-15T14:22:00Z"
  },
  {
    id: "lead-3",
    name: "David Kim",
    company: "BioHealth Innovations",
    email: "david.kim@biohealth.org",
    phone: "+1-415-882-9900",
    industry: "Healthcare & Biotech",
    notes: "Downloaded the whitepaper on AI compliance. Out of office till next week. Standard follow-up scheduled. Organization is a non-profit hospital cluster.",
    status: "Nurturing",
    aiScore: 35,
    aiCategory: "Cold",
    aiProbability: 20,
    aiReasoning: [
      "Generic content download (whitepaper) rather than active inquiry.",
      "Organization is a non-profit hospital cluster, which has complex procurement.",
      "Currently out of office, slow engagement response expected."
    ],
    createdAt: "2026-06-01T10:15:00Z",
    updatedAt: "2026-06-01T10:15:00Z"
  },
  {
    id: "lead-4",
    name: "Elena Rostova",
    company: "Nordic FinTech Solutions",
    email: "elena.r@nordicfintech.se",
    phone: "+46-8-123-4567",
    industry: "Financial Services",
    notes: "Referred by existing client. Needs SOC2 compliant hosting and secure DB replication immediately. Scheduled call for this Tuesday.",
    status: "Contacted",
    aiScore: 92,
    aiCategory: "Hot",
    aiProbability: 88,
    aiReasoning: [
      "Direct referral from a highly trusted existing customer.",
      "Has urgent, specific compliance requirements (SOC2, secure replication).",
      "Meeting already scheduled for next Tuesday."
    ],
    createdAt: "2026-06-18T09:00:00Z",
    updatedAt: "2026-06-18T09:00:00Z"
  },
  {
    id: "lead-5",
    name: "Thomas Mueller",
    company: "Bavaria Auto group",
    email: "t.mueller@bavaria-motors.de",
    phone: "+49-89-9876-543",
    industry: "Automotive",
    notes: "Cold outbound response. Interested in analytics features but worried about data privacy laws in the EU (GDPR). Needs detailed compliance doc sent.",
    status: "Nurturing",
    aiScore: 58,
    aiCategory: "Warm",
    aiProbability: 48,
    aiReasoning: [
      "Outbound lead responding with interest in analytics capabilities.",
      "Data privacy (GDPR) concerns present an objection that must be resolved.",
      "Requires compliance documentation before any commercial discussion."
    ],
    createdAt: "2026-05-20T11:45:00Z",
    updatedAt: "2026-05-20T11:45:00Z"
  },
  {
    id: "lead-6",
    name: "Aisha Rahman",
    company: "Zeta E-Commerce",
    email: "aisha@zeta-retail.com",
    phone: "+971-4-500-1122",
    industry: "E-Commerce & Retail",
    notes: "Completed pilot phase. Extremely happy with the conversion analytics reports. Sent contract proposal for annual premium tier. Awaiting final signature.",
    status: "Qualified",
    aiScore: 95,
    aiCategory: "Hot",
    aiProbability: 95,
    aiReasoning: [
      "Pilot successfully completed with positive product feedback.",
      "Annual premium tier contract proposal sent.",
      "Awaiting signature; execution probability is near-certain."
    ],
    createdAt: "2026-04-12T16:00:00Z",
    updatedAt: "2026-04-12T16:00:00Z"
  },
  {
    id: "lead-7",
    name: "John Doe",
    company: "Initech Solutions",
    email: "jdoe@initech.com",
    phone: "+1-800-555-0199",
    industry: "Professional Services",
    notes: "Testing tool. Asked if there is a discount for multi-year contracts. Basic notes, low engagement. No replies to our last 3 email followups.",
    status: "Contacted",
    aiScore: 28,
    aiCategory: "Cold",
    aiProbability: 15,
    aiReasoning: [
      "No reply to the last three consecutive follow-up emails.",
      "Low engagement history, possibly evaluating competitors or tire-kicking.",
      "Discounts requested early, indicating high price sensitivity."
    ],
    createdAt: "2026-03-01T12:00:00Z",
    updatedAt: "2026-03-01T12:00:00Z"
  },
  {
    id: "lead-8",
    name: "Emily Watson",
    company: "Bright Minds Academy",
    email: "e.watson@brightminds.edu",
    phone: "+1-617-555-2244",
    industry: "Education",
    notes: "Looking for free trial expansion for student projects. No current corporate budget. Standard response sent regarding academic tier restrictions.",
    status: "Closed-Lost",
    aiScore: 12,
    aiCategory: "Cold",
    aiProbability: 0,
    aiReasoning: [
      "Status is Closed-Lost, lead is unqualified.",
      "No corporate budget available, seeking free tier academic expansions.",
      "Academic requirements do not match our B2B commercial profile."
    ],
    createdAt: "2026-05-02T10:00:00Z",
    updatedAt: "2026-06-02T10:00:00Z"
  },
  {
    id: "lead-9",
    name: "Carlos Santana",
    company: "Guadalajara Agrotech",
    email: "csantana@guad-agrotech.mx",
    phone: "+52-33-3122-8877",
    industry: "Agriculture & Food",
    notes: "Inquired through website contact form. Looking for farm sensor telemetry storage. High data volume, custom schemas. Requesting a custom technical demo.",
    status: "New",
    aiScore: 72,
    aiCategory: "Warm",
    aiProbability: 62,
    aiReasoning: [
      "Inbound request with specific, high-volume telemetry requirements.",
      "Needs custom technical demo, indicating high level of buy-in requirement.",
      "Agrotech sector holds high potential but requires specialized solution engineering."
    ],
    createdAt: "2026-06-20T08:12:00Z",
    updatedAt: "2026-06-20T08:12:00Z"
  },
  {
    id: "lead-10",
    name: "Olivia Vance",
    company: "Vance Real Estate",
    email: "olivia@vancerealestate.com",
    phone: "+1-212-555-8833",
    industry: "Real Estate",
    notes: "Signed standard service contract. Initial database migrated. Account handed over to Customer Success team. Up and running.",
    status: "Closed-Won",
    aiScore: 100,
    aiCategory: "Hot",
    aiProbability: 100,
    aiReasoning: [
      "Deal is Closed-Won and service contract is signed.",
      "Migration is complete and lead is fully onboarded.",
      "Handed off to Customer Success team."
    ],
    createdAt: "2026-05-15T09:00:00Z",
    updatedAt: "2026-06-10T15:30:00Z"
  },
  {
    id: "lead-11",
    name: "Li Wei",
    company: "Shenzhen Heavy Industries",
    email: "wei.li@szheavy.cn",
    phone: "+86-755-8888-9999",
    industry: "Manufacturing",
    notes: "Interested in plant machinery predictive maintenance integration. Wants to pilot in one warehouse. Budget confirmed at $15k for the pilot.",
    status: "Contacted",
    aiScore: 81,
    aiCategory: "Hot",
    aiProbability: 75,
    aiReasoning: [
      "Confirmed budget of $15,000 for initial pilot program.",
      "Clear use-case defined: predictive maintenance integration.",
      "Successful pilot could lead to full-scale multi-plant deployment."
    ],
    createdAt: "2026-06-10T13:40:00Z",
    updatedAt: "2026-06-10T13:40:00Z"
  },
  {
    id: "lead-12",
    name: "Robert O'Connor",
    company: "Dublin Green Energy",
    email: "roconnor@dublingreen.ie",
    phone: "+353-1-496-0120",
    industry: "Energy & Utilities",
    notes: "Inquired about data aggregation speed. Wants comparison chart vs competitors. Scheduled discovery call for next Thursday.",
    status: "Contacted",
    aiScore: 68,
    aiCategory: "Warm",
    aiProbability: 58,
    aiReasoning: [
      "Discovery call successfully scheduled.",
      "Prospect requesting competitive product comparison details.",
      "Energy vertical holds high budget but long compliance-driven sales cycles."
    ],
    createdAt: "2026-06-17T15:00:00Z",
    updatedAt: "2026-06-17T15:00:00Z"
  },
  {
    id: "lead-13",
    name: "Patricia Smith",
    company: "Smith & Partners Legal",
    email: "patricia.smith@smithlegal.co.uk",
    phone: "+44-20-7946-0958",
    industry: "Professional Services",
    notes: "Outbound lead, responded to marketing email. Interested in client onboarding module. Budget is tight, requested payment plans.",
    status: "New",
    aiScore: 50,
    aiCategory: "Warm",
    aiProbability: 40,
    aiReasoning: [
      "Responded to outbound email, proving active interest.",
      "Expressed budget tightness and requested installment options.",
      "Legal firm onboarding needs are straightforward, easy to support."
    ],
    createdAt: "2026-06-19T10:00:00Z",
    updatedAt: "2026-06-19T10:00:00Z"
  },
  {
    id: "lead-14",
    name: "Kenji Sato",
    company: "Kyoto Robotics",
    email: "k.sato@kyotorobotics.co.jp",
    phone: "+81-75-343-9876",
    industry: "Manufacturing",
    notes: "Looking to replace legacy warehouse management platform. Stated our API is missing custom RPC endpoints. Technical team reviewing.",
    status: "Nurturing",
    aiScore: 45,
    aiCategory: "Warm",
    aiProbability: 35,
    aiReasoning: [
      "High-value target but has custom RPC engineering requirements.",
      "Currently pending review by engineering team.",
      "High replacement intent as they are actively deprecating legacy software."
    ],
    createdAt: "2026-05-28T16:50:00Z",
    updatedAt: "2026-05-28T16:50:00Z"
  },
  {
    id: "lead-15",
    name: "Fatima Al-Sudairi",
    company: "Riyadh Retail Group",
    email: "fatima@riyadhretail.com.sa",
    phone: "+966-11-404-1234",
    industry: "E-Commerce & Retail",
    notes: "Met at Trade Show. Highly interested in inventory sync latency. Requested detailed documentation and API specs. Followed up twice.",
    status: "Contacted",
    aiScore: 78,
    aiCategory: "Hot",
    aiProbability: 70,
    aiReasoning: [
      "Met in person at trade show, establishing high initial relationship trust.",
      "Very specific technical concern: inventory sync latency.",
      "Multiple follow-ups completed; prospect remains responsive."
    ],
    createdAt: "2026-06-05T09:12:00Z",
    updatedAt: "2026-06-05T09:12:00Z"
  },
  {
    id: "lead-16",
    name: "Gabriel Silva",
    company: "Sao Paulo FinTech Hub",
    email: "gsilva@spfintech.com.br",
    phone: "+55-11-3004-5000",
    industry: "Financial Services",
    notes: "Pilot canceled due to lack of standard sandbox environments for testing compliance. Re-engagement unlikely.",
    status: "Closed-Lost",
    aiScore: 15,
    aiCategory: "Cold",
    aiProbability: 0,
    aiReasoning: [
      "Status is Closed-Lost.",
      "Pilot was actively cancelled due to core product gaps (testing sandboxes).",
      "Re-engagement potential is flagged as highly unlikely."
    ],
    createdAt: "2026-04-01T11:00:00Z",
    updatedAt: "2026-05-15T14:00:00Z"
  },
  {
    id: "lead-17",
    name: "Sanjay Gupta",
    company: "Mumbai Telecom Labs",
    email: "s.gupta@mumbaitelecom.in",
    phone: "+91-22-2200-1100",
    industry: "Telecommunications",
    notes: "Interested in using Sales Copilot for low-latency call detail record scoring. Technical evaluation has started. Looking for SLAs.",
    status: "Contacted",
    aiScore: 76,
    aiCategory: "Hot",
    aiProbability: 68,
    aiReasoning: [
      "Technical evaluation actively underway by client engineers.",
      "Clear, high-throughput enterprise use-case (call records).",
      "Demanding SLAs (Service Level Agreements) indicate serious buyer intent."
    ],
    createdAt: "2026-06-12T14:00:00Z",
    updatedAt: "2026-06-12T14:00:00Z"
  },
  {
    id: "lead-18",
    name: "Chloe Dupont",
    company: "Parisian Luxury Goods",
    email: "c.dupont@parisluxury.fr",
    phone: "+33-1-4268-5300",
    industry: "E-Commerce & Retail",
    notes: "Expressed interest in mobile push notification metrics. Not the core decision maker. Waiting for manager approval to proceed.",
    status: "New",
    aiScore: 40,
    aiCategory: "Warm",
    aiProbability: 30,
    aiReasoning: [
      "Lead contact is an influencer, not the final decision maker.",
      "Currently waiting on managerial sign-off to proceed to a demo.",
      "Company matches high-tier fashion retail segment profile."
    ],
    createdAt: "2026-06-20T11:00:00Z",
    updatedAt: "2026-06-20T11:00:00Z"
  },
  {
    id: "lead-19",
    name: "William Vance",
    company: "Vance Partners LLC",
    email: "wvance@vancepartners.com",
    phone: "+1-206-555-4929",
    industry: "Professional Services",
    notes: "Contract finalized. Pilot setup fee and first invoice paid. Project kicking off next Monday. Closing deal.",
    status: "Closed-Won",
    aiScore: 100,
    aiCategory: "Hot",
    aiProbability: 100,
    aiReasoning: [
      "Deal is Closed-Won and fully executed.",
      "First invoice and pilot setup fees are paid.",
      "Project kickoff meeting scheduled for next Monday."
    ],
    createdAt: "2026-05-18T10:15:00Z",
    updatedAt: "2026-06-19T16:00:00Z"
  },
  {
    id: "lead-20",
    name: "Jane Smith",
    company: "TechNexus Systems",
    email: "jsmith@technexus.io",
    phone: "+1-415-555-1212",
    industry: "Software & SaaS",
    notes: "Spoke to sales rep. Evaluating competitors. Primary concern is real-time syncing. Sending comparison dashboard to address issues.",
    status: "Contacted",
    aiScore: 60,
    aiCategory: "Warm",
    aiProbability: 50,
    aiReasoning: [
      "Evaluating competing platforms in active comparison cycles.",
      "Concerned about real-time sync capabilities.",
      "Responding to sales rep queries."
    ],
    createdAt: "2026-06-20T09:30:00Z",
    updatedAt: "2026-06-20T09:30:00Z"
  }
];
