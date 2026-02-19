export const capabilities = [
  { id: 'explain', name: 'Explain Complex Concepts', category: 'Learn New Things', description: 'Break down complicated topics into understandable parts', level: 'Novice', icon: '📚' },
  { id: 'summarize', name: 'Summarize Long Texts', category: 'Research & Analyze', description: 'Condense articles and reports into key points', level: 'Novice', icon: '📝' },
  { id: 'brainstorm', name: 'Brainstorm Ideas', category: 'Creativity', description: 'Generate creative concepts and angles', level: 'Novice', icon: '💡' },
  { id: 'compare', name: 'Compare Options', category: 'Problem Solving', description: 'Side-by-side evaluation of alternatives', level: 'Competent', icon: '⚖️' },
  { id: 'outline', name: 'Create Outlines', category: 'Creativity', description: 'Develop structured frameworks for projects', level: 'Novice', icon: '📋' },
  { id: 'clarity', name: 'Improve Clarity', category: 'Improve Work', description: 'Make text more understandable and direct', level: 'Novice', icon: '✨' },
  { id: 'draft', name: 'Draft Messages', category: 'Communication', description: 'Compose emails, texts, and communications', level: 'Novice', icon: '✉️' },
  { id: 'analyze', name: 'Analyze Arguments', category: 'Research', description: 'Evaluate logical structure and evidence', level: 'Competent', icon: '🔍' },
  { id: 'detect', name: 'Detect Bias', category: 'Evaluation', description: 'Identify slanted perspectives in content', level: 'Competent', icon: '🎯' },
  { id: 'stories', name: 'Generate Stories', category: 'Creativity', description: 'Create narratives with plot and characters', level: 'Competent', icon: '📖' },
  { id: 'decide', name: 'Make Decisions', category: 'Problem Solving', description: 'Choose between options systematically', level: 'Proficient', icon: '🎲' },
  { id: 'solve', name: 'Solve Problems', category: 'Problem Solving', description: 'Generate and evaluate solutions', level: 'Proficient', icon: '🧩' },
  { id: 'teach', name: 'Teach Step-by-Step', category: 'Learn New Things', description: 'Guide through learning progressively', level: 'Competent', icon: '🎓' },
  { id: 'translate', name: 'Translate Concepts', category: 'Learn New Things', description: 'Apply ideas across different domains', level: 'Competent', icon: '🌐' },
  { id: 'examples', name: 'Provide Examples', category: 'Learn New Things', description: 'Illustrate concepts with concrete instances', level: 'Novice', icon: '💎' },
  { id: 'synthesize', name: 'Synthesize Sources', category: 'Research', description: 'Combine information into cohesive insights', level: 'Proficient', icon: '🔗' },
  { id: 'tone', name: 'Improve Tone', category: 'Improve Work', description: 'Adjust language for emotional impact', level: 'Novice', icon: '🎭' },
  { id: 'habits', name: 'Habit Formation', category: 'Personal', description: 'Design routines for positive behaviors', level: 'Novice', icon: '🌱' },
  { id: 'goals', name: 'Goal Setting', category: 'Personal', description: 'Define and plan personal objectives', level: 'Novice', icon: '🎯' },
  { id: 'optimize', name: 'Optimize Systems', category: 'Problem Solving', description: 'Improve efficiency of processes', level: 'Proficient', icon: '⚡' }
];

export const categories = [
  { id: 'learn', name: 'Learn New Things', color: '#3b82f6' },
  { id: 'research', name: 'Research & Analyze', color: '#8b5cf6' },
  { id: 'creativity', name: 'Creativity', color: '#ec4899' },
  { id: 'problem', name: 'Problem Solving', color: '#f59e0b' },
  { id: 'improve', name: 'Improve Work', color: '#10b981' },
  { id: 'communication', name: 'Communication', color: '#06b6d4' },
  { id: 'evaluation', name: 'Evaluation', color: '#ef4444' },
  { id: 'personal', name: 'Personal', color: '#84cc16' }
];

export const treeData = {
  name: "AI Capabilities",
  children: [
    {
      name: "Learn & Understand",
      children: [
        { name: "Explain Complex Concepts", capability: "explain" },
        { name: "Teach Step-by-Step", capability: "teach" },
        { name: "Provide Examples", capability: "examples" },
        { name: "Translate Concepts", capability: "translate" }
      ]
    },
    {
      name: "Research & Analyze",
      children: [
        { name: "Summarize Texts", capability: "summarize" },
        { name: "Analyze Arguments", capability: "analyze" },
        { name: "Synthesize Sources", capability: "synthesize" },
        { name: "Detect Bias", capability: "detect" }
      ]
    },
    {
      name: "Create & Improve",
      children: [
        { name: "Brainstorm Ideas", capability: "brainstorm" },
        { name: "Create Outlines", capability: "outline" },
        { name: "Generate Stories", capability: "stories" },
        { name: "Improve Clarity", capability: "clarity" },
        { name: "Improve Tone", capability: "tone" }
      ]
    },
    {
      name: "Decide & Solve",
      children: [
        { name: "Compare Options", capability: "compare" },
        { name: "Make Decisions", capability: "decide" },
        { name: "Solve Problems", capability: "solve" },
        { name: "Optimize Systems", capability: "optimize" }
      ]
    },
    {
      name: "Personal Growth",
      children: [
        { name: "Draft Messages", capability: "draft" },
        { name: "Habit Formation", capability: "habits" },
        { name: "Goal Setting", capability: "goals" }
      ]
    }
  ]
};
