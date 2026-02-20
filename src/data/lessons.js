export const LESSONS = [
  {
    id: 1,
    slug: 'partnership-calibrator',
    title: 'The Partnership Calibrator',
    step: 'Step 1: Adopt the right mental model',
    layer: 'Foundation',
    xp: 100,
    icon: '🤝',
    color: '#6366f1',
    zpd: {
      easy: 'Match 4 of 8 scenarios correctly',
      medium: 'Match 6 of 8 scenarios correctly',
      hard: 'Match 7+ of 8 scenarios with no hints'
    },
    objective: 'Identify the appropriate AI mental model (Tool, Thinking Partner, Editor, Critic, Generator) for different tasks.',
    pitfall: 'Treating AI as a magic oracle for all problems, or as just a search engine.',
    metacognition: 'Which mental model did I default to, and was it the most effective choice?',
    gameType: 'partnership-calibrator'
  },
  {
    id: 2,
    slug: 'goal-forge',
    title: 'Goal Forge',
    step: 'Step 2: Define success with a goal statement',
    layer: 'Foundation',
    xp: 100,
    icon: '⚒️',
    color: '#8b5cf6',
    zpd: {
      easy: 'Create a goal statement with 2 of 3 components',
      medium: 'Reach 70+ quality score with all 3 components',
      hard: 'Reach 85+ quality score with specificity bonus'
    },
    objective: 'Construct clear goal statements using "I need ___, for ___, by ___" framework.',
    pitfall: 'Vague goals like "make this better" or "help me write something."',
    metacognition: 'Would someone else understand my goal without additional explanation?',
    gameType: 'goal-forge'
  },
  {
    id: 3,
    slug: 'spec-lab',
    title: 'SPEC Lab',
    step: 'Step 3: Specify prompts using SPEC',
    layer: 'Foundation',
    xp: 100,
    icon: '🧪',
    color: '#a855f7',
    zpd: {
      easy: 'Fill 3 of 4 SPEC slots correctly',
      medium: 'Complete all 4 slots with correct categorization',
      hard: 'Complete with clean preview on first try'
    },
    objective: 'Break down prompts into Situation, Purpose, Expectations, and Constraints (SPEC).',
    pitfall: 'Writing prompts as single long sentences without clear structure.',
    metacognition: 'Which SPEC component was I missing in my last prompt?',
    gameType: 'spec-lab'
  },
  {
    id: 4,
    slug: 'the-chunker',
    title: 'The Chunker',
    step: 'Step 4: Reduce cognitive load by chunking',
    layer: 'Foundation',
    xp: 100,
    icon: '🧱',
    color: '#d946ef',
    zpd: {
      easy: 'Identify optimal chunk count for 2 of 4 tasks',
      medium: 'Optimize 3 of 4 tasks correctly',
      hard: 'Optimize all 4 tasks with no overload warnings'
    },
    objective: 'Divide complex tasks into optimal cognitive chunks to prevent overload.',
    pitfall: 'Asking AI to do everything at once, or breaking tasks into too many fragments.',
    metacognition: 'Is this task causing cognitive overload for me or the AI?',
    gameType: 'the-chunker'
  },
  {
    id: 5,
    slug: 'workflow-sorter',
    title: 'Workflow Sorter',
    step: 'Step 5: Classify one-shot vs staged',
    layer: 'Foundation',
    xp: 100,
    icon: '🔀',
    color: '#ec4899',
    zpd: {
      easy: 'Correctly classify 5 of 10 tasks',
      medium: 'Classify 7 of 10 with streak bonus',
      hard: 'Classify 8+ with 5-in-a-row streak multiplier'
    },
    objective: 'Determine whether a task should be completed in one prompt or staged across multiple.',
    pitfall: 'Using one-shot for complex deliverables or over-staging simple tasks.',
    metacognition: 'Am I trying to do too much in a single prompt?',
    gameType: 'workflow-sorter'
  },
  {
    id: 6,
    slug: 'the-interrogator',
    title: 'The Interrogator',
    step: 'Step 6: Build a repeatable intake form',
    layer: 'Synthesis',
    xp: 125,
    icon: '❓',
    color: '#f43f5e',
    zpd: {
      easy: 'Select 4 of 6 most important questions',
      medium: 'Achieve 75+ quality score with 6 questions',
      hard: 'Perfect score with optimal question selection'
    },
    objective: 'Identify and prioritize essential context questions for any AI task.',
    pitfall: 'Jumping into execution without gathering necessary context first.',
    metacognition: 'What question, if answered, would make the output significantly better?',
    gameType: 'the-interrogator'
  },
  {
    id: 7,
    slug: 'speed-draft-arena',
    title: 'Speed Draft Arena',
    step: 'Step 7: Execute a first draft with format and audience',
    layer: 'Synthesis',
    xp: 125,
    icon: '⚡',
    color: '#f97316',
    zpd: {
      easy: 'Assemble 3 correct block types in time',
      medium: 'Assemble 4 correct block types',
      hard: 'Assemble all 5 blocks with time bonus'
    },
    objective: 'Rapidly construct effective prompts by selecting appropriate components.',
    pitfall: 'Over-engineering the first draft—perfectionism kills momentum.',
    metacognition: 'Is my draft "good enough" to evaluate, or am I over-polishing?',
    gameType: 'speed-draft-arena'
  },
  {
    id: 8,
    slug: 'the-crucible',
    title: 'The Crucible',
    step: 'Step 8: Evaluate output using a rubric',
    layer: 'Synthesis',
    xp: 125,
    icon: '🔥',
    color: '#f59e0b',
    zpd: {
      easy: 'Match 10 of 16 rubric items correctly',
      medium: 'Match 12 of 16 with 70+ score',
      hard: 'Match 14+ with expert-level agreement'
    },
    objective: 'Assess AI outputs systematically using Accuracy, Clarity, Tone, and Completeness.',
    pitfall: 'Gut-feeling evaluation without structured criteria.',
    metacognition: 'What specific rubric dimension is this output weakest on?',
    gameType: 'the-crucible'
  },
  {
    id: 9,
    slug: 'the-refinery',
    title: 'The Refinery',
    step: 'Step 9: Iterate with targeted refinements',
    layer: 'Synthesis',
    xp: 125,
    icon: '⚗️',
    color: '#eab308',
    zpd: {
      easy: 'Reach 60 purity with 3 rounds',
      medium: 'Reach 80 purity before rounds expire',
      hard: 'Perfect 100 purity with no wrong choices'
    },
    objective: 'Apply iterative refinement strategies to improve AI outputs.',
    pitfall: 'Abandoning outputs that could be fixed with targeted tweaks.',
    metacognition: 'What single change would have the biggest impact on quality?',
    gameType: 'the-refinery'
  },
  {
    id: 10,
    slug: 'claim-detector',
    title: 'Claim Detector',
    step: 'Step 10: Verify facts with confidence labels',
    layer: 'Synthesis',
    xp: 125,
    icon: '🕵️',
    color: '#84cc16',
    zpd: {
      easy: 'Label 5 of 8 claims correctly',
      medium: 'Label 6 of 8 with hallucination detection',
      hard: 'Perfect 8/8 in under 45 seconds'
    },
    objective: 'Assess factual claims with appropriate confidence levels (HIGH/MED/LOW).',
    pitfall: 'Accepting AI outputs as truth without verification.',
    metacognition: 'What would convince me this claim is correct or incorrect?',
    gameType: 'claim-detector'
  },
  {
    id: 11,
    slug: 'the-distillery',
    title: 'The Distillery',
    step: 'Step 11: Summarize into sentence, bullets, actions',
    layer: 'Synthesis',
    xp: 150,
    icon: '🏺',
    color: '#22c55e',
    zpd: {
      easy: 'Place 6 of 15 fragments correctly',
      medium: 'Complete all 3 zones with minimum correct',
      hard: 'All 5 bullets + 3 actions placed optimally'
    },
    objective: 'Extract and structure key information into digestible formats.',
    pitfall: 'Over-summarizing and losing critical context or nuance.',
    metacognition: 'If I had to explain this in one sentence, what would it be?',
    gameType: 'the-distillery'
  },
  {
    id: 12,
    slug: 'the-reconciler',
    title: 'The Reconciler',
    step: 'Step 12: Synthesize conflicting sources',
    layer: 'Synthesis',
    xp: 150,
    icon: '⚖️',
    color: '#10b981',
    zpd: {
      easy: 'Find 2 of 3 conflicts correctly',
      medium: 'Find all 3 conflicts with majority correct picks',
      hard: 'Perfect conflict resolution with uncertainty flags'
    },
    objective: 'Identify discrepancies between sources and determine which is more accurate.',
    pitfall: 'Ignoring contradictions or accepting the first source encountered.',
    metacognition: 'What evidence would resolve this conflict definitively?',
    gameType: 'the-reconciler'
  },
  {
    id: 13,
    slug: 'idea-funnel',
    title: 'Idea Funnel',
    step: 'Step 13: Brainstorm then converge',
    layer: 'Creation',
    xp: 175,
    icon: '🌪️',
    color: '#14b8a6',
    zpd: {
      easy: 'Create 2 valid clusters with names',
      medium: 'Select top 3 ideas matching 1 expert pick',
      hard: 'Match 2+ of top 3 to expert selections'
    },
    objective: 'Generate diverse ideas, cluster them, and converge on the best options.',
    pitfall: 'Stopping at the first acceptable idea or never converging.',
    metacognition: 'Have I generated enough variety before starting to judge?',
    gameType: 'idea-funnel'
  },
  {
    id: 14,
    slug: 'the-shapeshifter',
    title: 'The Shapeshifter',
    step: 'Step 14: Draft for different audiences',
    layer: 'Creation',
    xp: 175,
    icon: '🎭',
    color: '#06b6d4',
    zpd: {
      easy: 'Identify the error in 2 of 4 transformations',
      medium: 'Identify 3 of 4 errors correctly',
      hard: 'Perfect 4/4 error detection'
    },
    objective: 'Adapt content for different audiences and registers while preserving meaning.',
    pitfall: 'Using the same tone and complexity for every audience.',
    metacognition: 'Would my intended audience understand this without confusion?',
    gameType: 'the-shapeshifter'
  },
  {
    id: 15,
    slug: 'red-pen-room',
    title: 'Red Pen Room',
    step: 'Step 15: Improve work with rubric and change log',
    layer: 'Creation',
    xp: 175,
    icon: '🖊️',
    color: '#0ea5e9',
    zpd: {
      easy: 'Judge 6 of 10 changes correctly',
      medium: 'Judge 8 of 10 with expert alignment',
      hard: 'Match expert judgment on 9+ changes'
    },
    objective: 'Evaluate edits to determine if they preserve intent or drift from meaning.',
    pitfall: 'Accepting all changes blindly or rejecting changes due to ego.',
    metacognition: 'What changed, and was the original meaning preserved?',
    gameType: 'red-pen-room'
  },
  {
    id: 16,
    slug: 'decision-arena',
    title: 'Decision Arena',
    step: 'Step 16: Compare options with a decision table',
    layer: 'Creation',
    xp: 175,
    icon: '🏟️',
    color: '#3b82f6',
    zpd: {
      easy: 'Complete matrix within 30 points of optimal',
      medium: 'Within 15 points with recommendation',
      hard: 'Within 5 points with excellent justification'
    },
    objective: 'Make systematic comparisons across multiple criteria using decision matrices.',
    pitfall: 'Deciding based on a single factor or gut feeling without analysis.',
    metacognition: 'Which criteria matter most, and have I weighted them correctly?',
    gameType: 'decision-arena'
  },
  {
    id: 17,
    slug: 'the-decomposer',
    title: 'The Decomposer',
    step: 'Step 17: Decompose complex problems into steps',
    layer: 'Strategy',
    xp: 200,
    icon: '💣',
    color: '#6366f1',
    zpd: {
      easy: 'Defuse bomb with correct step count',
      medium: 'Defuse with correct order (1 attempt)',
      hard: 'Defuse on first try with optimal decomposition'
    },
    objective: 'Break complex tasks into dependent sub-steps with proper sequencing.',
    pitfall: 'Attempting complex tasks without planning or breaking them too finely.',
    metacognition: 'What is the smallest next action that unblocks progress?',
    gameType: 'the-decomposer'
  },
  {
    id: 18,
    slug: 'skeptics-gauntlet',
    title: "Skeptic's Gauntlet",
    step: 'Step 18: Run an adversarial review',
    layer: 'Strategy',
    xp: 200,
    icon: '🛡️',
    color: '#8b5cf6',
    zpd: {
      easy: 'Identify and label 3 of 8 issues correctly',
      medium: 'Identify 4 of 8 with correct labels',
      hard: 'Perfect 5+ identification and labeling'
    },
    objective: 'Critically evaluate AI outputs for errors, bias, hallucinations, and assumptions.',
    pitfall: 'Trusting AI outputs without scrutiny or accepting outputs due to convenience.',
    metacognition: 'What would make me doubt this output, and should I?',
    gameType: 'skeptics-gauntlet'
  },
  {
    id: 19,
    slug: 'relay-race',
    title: 'Relay Race',
    step: 'Step 19: Orchestrate a multi-role workflow',
    layer: 'Strategy',
    xp: 200,
    icon: '🏃',
    color: '#a855f7',
    zpd: {
      easy: 'Complete all 3 stations in 3 attempts',
      medium: 'Complete in 2 attempts with good choices',
      hard: 'Complete in 1 attempt with perfect choices'
    },
    objective: 'Coordinate multiple AI roles (Researcher, Writer, QA) in a staged workflow.',
    pitfall: 'Trying to do everything with one prompt or failing to hand off correctly.',
    metacognition: 'Who is best suited for this sub-task, and what do they need?',
    gameType: 'relay-race'
  },
  {
    id: 20,
    slug: 'the-vault',
    title: 'The Vault',
    step: 'Step 20: Build a reusable prompt pack and test harness',
    layer: 'Strategy',
    xp: 200,
    icon: '🏦',
    color: '#d946ef',
    zpd: {
      easy: 'Complete 1 template correctly',
      medium: 'Complete 3 of 5 templates',
      hard: 'Complete all 5 templates with validation'
    },
    objective: 'Create reusable prompt templates with placeholder systems and test cases.',
    pitfall: 'Starting from scratch every time or saving prompts without documentation.',
    metacognition: 'Would this template work for a slightly different use case?',
    gameType: 'the-vault'
  }
];

export const getLessonBySlug = (slug) => LESSONS.find(l => l.slug === slug);
export const getLessonsByLayer = (layer) => LESSONS.filter(l => l.layer === layer);
export const getCompletedLessons = (completedIds) => LESSONS.filter(l => completedIds.includes(l.id));
