/**
 * gen-preview-brain.js
 * Deterministic generator for the VIZIER Day-251 PREVIEW brain dataset.
 * Produces site/brain-index.preview.json with ~500 nodes and 1200-1800 edges.
 * Uses a seeded LCG RNG — reproducible, no LLM, no randomness drift.
 *
 * Run: node tools/site-build/gen-preview-brain.js
 */

'use strict';
const fs = require('fs');
const path = require('path');

// ─── Seeded LCG RNG ──────────────────────────────────────────────────────────
function makeLCG(seed) {
  let s = seed >>> 0;
  return {
    next() {
      s = Math.imul(1664525, s) + 1013904223;
      return (s >>> 0) / 4294967296;
    },
    pick(arr) {
      return arr[Math.floor(this.next() * arr.length)];
    },
    int(min, max) {
      return min + Math.floor(this.next() * (max - min + 1));
    },
    shuffle(arr) {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(this.next() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }
  };
}
const rng = makeLCG(251_991_337);

// ─── Domain config ───────────────────────────────────────────────────────────
const START_DATE = new Date('2026-07-09');

const DOMAINS = [
  { id: 'gut',           label: 'Gut Health',       color: '#68d391', count: 72 },
  { id: 'mind-gut',      label: 'Mind–Gut Axis',    color: '#76e4f7', count: 58 },
  { id: 'nutrition',     label: 'Nutrition',         color: '#f6ad55', count: 55 },
  { id: 'health-core',   label: 'Health Core',      color: '#fc8181', count: 48 },
  { id: 'mind',          label: 'Mind & Thinking',  color: '#b794f4', count: 62 },
  { id: 'body',          label: 'Body & Movement',  color: '#4fd1c5', count: 42 },
  { id: 'communication', label: 'Communication',     color: '#fbd38d', count: 38 },
  { id: 'meta',          label: 'Meta / System',    color: '#a0aec0', count: 35 },
  { id: 'family-os',     label: 'Family OS',        color: '#f687b3', count: 18 },
  { id: 'handyman',      label: 'Mr Handyman',      color: '#d69e2e', count: 14 },
];

// ─── Curated topic lists per domain ─────────────────────────────────────────
const TOPICS = {
  gut: [
    'Short-chain fatty acids and colonocyte energy metabolism',
    'Bile acid signaling and FXR receptor activation',
    'Akkermansia muciniphila and mucin layer integrity',
    'Bifidobacterium longum and IgA secretion',
    'Leaky gut and tight junction proteins ZO-1 and occludin',
    'Dysbiosis patterns in irritable bowel syndrome',
    'Butyrate production from resistant starch fermentation',
    'Mucus layer thickness and microbiome diversity',
    'Gut motility and serotonin in the enteric nervous system',
    'Helicobacter pylori virulence factors and gastric mucosa',
    'Fecal microbiota transplantation efficacy in C. difficile',
    'Polyphenols and Lactobacillus enrichment',
    'Proteobacteria bloom as dysbiosis marker',
    'Colonic pH regulation and microbiome composition',
    'Microbiome in colorectal cancer risk',
    'Zonulin as serum marker of intestinal permeability',
    'FODMAP fermentation and symptom mapping in IBS',
    'Microbial diversity index as metabolic health proxy',
    'Cross-feeding between Bifidobacterium and butyrate producers',
    'Enteroendocrine cell communication and appetite hormones',
    'Paneth cells and crypts of Lieberkühn function',
    'Gram-negative bacteria endotoxin and LPS signaling',
    'Inulin prebiotic effect on gut flora stratification',
    'Gut clock genes and circadian rhythm microbiome shifts',
    'Fasting and gut microbiome diversity restoration',
    'Propionate signaling and hepatic gluconeogenesis',
    'Succinate as microbial metabolite and Th17 cell activation',
    'Hydrogen sulfide in gut: dual role and dose thresholds',
    'Transit time variability and microbiome snapshot stability',
    'Antibiotic perturbation recovery timeline in gut',
    'Fiber type differentiation: soluble vs. insoluble and fermentation',
    'Small intestinal bacterial overgrowth (SIBO) detection',
    'Saccharomyces boulardii as probiotic in diarrhea',
    'Mucosa-associated lymphoid tissue and gut immunity',
    'Bile salt hydrolase activity and cholesterol metabolism',
    'Enterotype clustering and dietary adherence',
    'Gut biofilm formation and chronic dysbiosis',
    'Intestinal alkaline phosphatase and LPS detoxification',
    'Quorum sensing in gut biofilm communities',
    'N-acetylglucosamine and intestinal epithelial repair',
    'Colitis remission and Lactobacillus rhamnosus supplementation',
    'Archaeal methanogens and hydrogen cross-feeding',
    'Ruminococcus champanellensis and cellulose degradation',
    'Gut permeability stress test: lactulose:mannitol ratio',
    'Commensal bacteria training of regulatory T cells',
    'Short bowel syndrome and microbiome adaptation',
    'Cholesterol bile acid conversion and microbiome role',
    'Intestinal stem cell renewal and microbiome signals',
    'Hydrogen breath test for lactose malabsorption',
    'Mucin glycan degraders and barrier function',
    'Prebiotics vs. probiotics: mechanistic distinction',
    'Gut-associated lymphoid tissue (GALT) architecture',
    'Diet-microbiome interaction timescales',
    'Fecal metabolomics and disease biomarker discovery',
    'Oxalate-degrading bacteria and kidney stone risk',
    'Trimethylamine-N-oxide (TMAO) and cardiovascular risk',
    'Flagellin TLR5 activation and gut innate immunity',
    'Goblet cell function and mucus glycoprotein production',
    'Irritable bowel syndrome Rome IV diagnostic criteria',
    'Anti-inflammatory effects of omega-3 in gut epithelium',
    'Microbiota signatures in Parkinson disease',
    'Symbiotic formulations: synbiotics efficacy evidence',
    'Fasting-mimicking diet and microbial reset',
    'Plant-based diet and firmicutes:bacteroidetes ratio',
    'Colonoscopy prep and microbiome perturbation recovery',
    'Viral infection impact on gut microbiome transience',
    'Gut microbiome and response to checkpoint immunotherapy',
    'Butyrate enema in ulcerative colitis remission',
    'Pediatric gut microbiome maturation timeline',
    'Birth mode (C-section vs. vaginal) and microbiome seeding',
    'Breast milk oligosaccharides and infant Bifidobacterium',
  ],
  'mind-gut': [
    'Vagus nerve as bidirectional highway between gut and brain',
    'Serotonin synthesis: 90% in gut enteroendocrine cells',
    'Gut microbiome and HPA axis cortisol regulation',
    'Tryptophan metabolism: kynurenine pathway and depression risk',
    'Germ-free mouse models of anxiety behavior',
    'Lactobacillus rhamnosus and GABA receptor expression',
    'Microbiome-derived metabolites crossing blood-brain barrier',
    'Enteric nervous system as the second brain',
    'Short-chain fatty acids and neuroinflammation modulation',
    'Probiotics in depression: clinical trial meta-analysis',
    'Stress-induced intestinal permeability increase',
    'Gut dysbiosis in autism spectrum disorder evidence',
    'Psychobiotics: definition and clinical classification',
    'Microbiome influence on social behavior in rodent models',
    'IBS and comorbid anxiety prevalence statistics',
    'Diet-induced neuroplasticity via gut microbiome',
    'Polyvagal theory and gut-brain coherence',
    'Glucocorticoid receptor sensitivity and gut inflammation',
    'Neuropeptide Y and gut-brain hunger signaling',
    'Cholecystokinin and satiety signal to brainstem',
    'Butyrate and HDAC inhibition in neuronal gene expression',
    'Microglial activation and gut-derived LPS signaling',
    'Brain-derived neurotrophic factor (BDNF) and gut microbiome',
    'Spore-forming bacteria and enteroendocrine cell activation',
    'Autism gut microbiome: Prevotella reduction patterns',
    'Stress and disruption of mucus-adherent communities',
    'Cytokine storm and depression: gut-mediated pathway',
    'Chronic fatigue syndrome and intestinal permeability',
    'Probiotics and cognitive performance: RCT evidence',
    'Emotional eating and microbiome reward circuitry links',
    'Mindfulness meditation and gut motility regulation',
    'Nocturnal gut motility and sleep microbiome interaction',
    'Fiber and depression: epidemiological linkage',
    'Indole signaling from gut bacteria and mood modulation',
    'Enteroendocrine cell density in IBS vs. healthy controls',
    'Nausea pathways: gut-brain crosstalk in chemotherapy',
    'Xenobiotic metabolism by gut flora and psychiatric meds',
    'SCFA-mediated serotonin release from EC cells',
    'Mind-gut axis therapeutics: current clinical trials',
    'Gut microbiome and Alzheimer disease: emerging evidence',
    'Bifidobacterium infantis and tryptophan availability',
    'Neuroinflammation and gut-derived exosomes',
    'Irritable bowel and panic disorder neural overlap',
    'Gut-derived signals and hypothalamic appetite control',
    'Perceived stress and microbiome alpha-diversity correlation',
    'Diet quality and grey matter volume: mediation analysis',
    'Interoception and gut sensory pathway accuracy',
    'Abdominal breathing and parasympathetic gut modulation',
    'Psychobiotic cocktail in generalized anxiety: pilot RCT',
    'Histamine from gut bacteria and neurological sensitization',
    'Microbiome variability and emotional regulation capacity',
    'Gut serotonin and bone density cross-signaling',
    'Post-infectious IBS and long-term gut-brain remodeling',
    'Fecal transplant effects on recipient mood and cognition',
    'Mediterranean diet and microbiome-mediated antidepressant effect',
    'Gut epithelial stem cell niche and neural crest interaction',
    'Enteric glia and gut-brain interface regulation',
  ],
  nutrition: [
    'Mediterranean diet adherence and all-cause mortality',
    'Glycemic index vs. glycemic load: practical distinction',
    'Omega-3 EPA and DHA anti-inflammatory mechanisms',
    'Processed food ultra-NOVA classification system',
    'Polyphenol bioavailability and colonic transformation',
    'Protein quality: DIAAS score vs. PDCAAS comparison',
    'Time-restricted eating and circadian metabolic alignment',
    'Fermented foods and microbiome diversity increase',
    'Magnesium deficiency prevalence and neurological effects',
    'Vitamin D synthesis pathway and sun exposure thresholds',
    'Iron absorption: heme vs. non-heme and enhancers',
    'Dietary cholesterol and LDL: updated consensus evidence',
    'Resistant starch types RS1-RS4 and gut fermentation',
    'DASH diet and blood pressure: clinical evidence summary',
    'Plant-based protein sources and essential amino acid profiles',
    'Caloric restriction mimetics: rapamycin and metformin',
    'Intermittent fasting protocols: 16:8 vs. 5:2 outcomes',
    'Artificial sweetener impact on gut microbiome',
    'Zinc and immune response: mechanistic pathway',
    'Vitamin K2 MK-7 and arterial calcification prevention',
    'Choline requirements and TMAO production tradeoff',
    'Anti-nutrient lectins: risk vs. benefit in legumes',
    'Cruciferous vegetables and sulforaphane NRF2 pathway',
    'Blood sugar spike mitigation: vinegar preload evidence',
    'Iodine sufficiency and thyroid hormone synthesis',
    'Selenium as antioxidant cofactor in glutathione peroxidase',
    'Calcium absorption: dairy vs. plant-based sources',
    'B12 deficiency risk in vegan populations',
    'Phytate reduction by soaking, sprouting, and fermenting',
    'Food matrix effect on nutrient bioavailability',
    'Saturated fat and cardiovascular disease: meta-analysis update',
    'Dietary fiber intake recommendations and adherence gaps',
    'Nutrient timing for muscle protein synthesis optimization',
    'Carotenoid absorption: fat co-consumption requirement',
    'Whole grain vs. refined grain glycemic impact',
    'Low-carbohydrate diet and LDL particle size shift',
    'Antioxidant supplementation vs. food antioxidants',
    'Sodium intake and cardiovascular outcome dose-response',
    'Personalized nutrition and glycemic variability prediction',
    'Ketogenic diet and brain energy metabolism',
    'Dietary nitrate and endothelial nitric oxide synthase',
    'Fructose metabolism and hepatic lipogenesis',
    'Lactase persistence evolution and dairy tolerance',
    'Food color additive impact on ADHD: current evidence',
    'Bile acid enterohepatic circulation and fat absorption',
    'Plant sterols and LDL cholesterol reduction mechanism',
    'Epigenetic effects of maternal nutrition on offspring',
    'Dietary AGEs (advanced glycation end-products) and aging',
    'Coffee and liver health: cafestol and kahweol diterpenes',
    'Alcohol metabolism and gut microbiome disruption',
    'Ergocalciferol vs. cholecalciferol (D2 vs. D3) efficacy',
    'Flavonoid subclasses and cardiovascular protection',
    'Astaxanthin as marine-derived antioxidant carotenoid',
    'Spermidine autophagy induction and longevity research',
    'Protein leverage hypothesis and appetite regulation',
  ],
  'health-core': [
    'Hallmarks of aging: senescence, proteostasis, epigenetics',
    'Telomere length as biological age marker',
    'mTOR pathway and longevity tradeoffs',
    'Autophagy induction and cellular housekeeping',
    'Hormesis principle: low-dose stress and resilience',
    'Inflammation: acute protective vs. chronic pathological',
    'Mitochondrial biogenesis and exercise adaptation',
    'Reactive oxygen species and redox signaling balance',
    'HbA1c as 3-month glycemic average marker',
    'Blood pressure variability and cardiovascular risk',
    'Sleep debt and cortisol: HPA axis dysregulation',
    'Cold exposure and brown adipose tissue activation',
    'Circadian rhythm disruption and metabolic syndrome',
    'VO2max as strongest predictor of all-cause mortality',
    'Grip strength as proxy for biological age',
    'HOMA-IR calculation and insulin resistance threshold',
    'Sauna frequency and cardiovascular mortality outcomes',
    'Zone 2 training and mitochondrial density',
    'Heart rate variability and autonomic nervous system',
    'Lipid panel interpretation: LDL-P vs. LDL-C distinction',
    'Non-alcoholic fatty liver disease (NAFLD) progression',
    'Visceral vs. subcutaneous adipose tissue risk profiles',
    'ApoB as superior cardiovascular risk marker vs. LDL-C',
    'Cancer hallmarks: Hanahan and Weinberg framework',
    'Inflammation biomarkers: hsCRP, IL-6, fibrinogen',
    'Senolytic drugs dasatinib and quercetin trials',
    'Epigenetic clock (Horvath) and methylation age',
    'IGF-1 axis and cancer/longevity tradeoff',
    'Post-exercise inflammation: recovery window timing',
    'Cortisol awakening response and resilience',
    'Immune senescence and vaccine efficacy decline',
    'Blood glucose continuous monitoring wearable insights',
    'Testosterone decline and sarcopenia in aging men',
    'Estrogen and bone density loss post-menopause',
    'Oxidative phosphorylation efficiency and aging',
    'NAD+ decline and sirtuin activity in aging',
    'Rapamycin longevity extension in mammals',
    'Caloric restriction vs. protein restriction for longevity',
    'Fasting insulin target levels and metabolic health',
    'Uric acid and metabolic syndrome association',
    'Vitamin D deficiency prevalence and immune implications',
    'Thyroid function: TSH, T3, T4 interpretation',
    'Ferritin as iron storage and inflammation indicator',
    'Homocysteine elevation and cardiovascular risk',
    'Complete blood count interpretation basics',
    'Exercise-induced BDNF and neuroplasticity',
    'Heat shock proteins and proteostasis maintenance',
    'mRNA vaccine mechanism and immune memory formation',
    'Whole-body MRI early cancer detection research',
  ],
  mind: [
    'Dual-process theory: System 1 and System 2 thinking',
    'Bayesian updating and belief revision mechanics',
    'Base-rate neglect in probability judgment',
    'Cognitive load theory and working memory limits',
    'Spaced repetition and the spacing effect',
    'Feynman technique: teach it to learn it deeply',
    'Mental model definition and accumulation strategy',
    'Probabilistic thinking vs. binary thinking',
    'Pre-mortem analysis and failure imagination',
    'Inversion: solve problems by thinking backwards',
    'First principles reasoning vs. analogy reasoning',
    'Opportunity cost and tradeoff framing',
    'Dunning-Kruger effect and calibration training',
    'Metacognition: thinking about your thinking',
    'Deliberate practice and expertise acquisition',
    'Chunking and pattern recognition in experts',
    'Sunk cost fallacy and decision irreversibility',
    'Survivorship bias in data and learning',
    'Confirmation bias and active disconfirmation strategy',
    'Anchoring effect in negotiation and estimation',
    'Availability heuristic and recency distortion',
    'Planning fallacy and optimism bias in projects',
    'Second-order thinking and consequence chains',
    'Hanlon\'s razor: malice vs. incompetence attribution',
    'Occam\'s razor and simplicity heuristic',
    'Epistemic humility and calibrated uncertainty',
    'Circle of competence and boundary-setting',
    'Compounding knowledge and incremental learning',
    'Note-taking for understanding vs. for memory',
    'Interleaved practice and contextual interference',
    'Retrieval practice and the testing effect',
    'Elaborative interrogation and deep processing',
    'Working memory capacity individual differences',
    'Sleep and memory consolidation: slow-wave and REM',
    'Executive function: inhibition, shifting, updating',
    'Growth mindset vs. fixed mindset empirical evidence',
    'Flow state conditions and challenge-skill balance',
    'Intrinsic vs. extrinsic motivation undermining effect',
    'Focused vs. diffuse thinking modes',
    'Decision fatigue and choice architecture',
    'Priming effects on subsequent judgment',
    'Illusory correlation in pattern detection',
    'Framing effects on risk perception and choice',
    'Representativeness heuristic and stereotyping',
    'Loss aversion and prospect theory',
    'Time discounting and hyperbolic preferences',
    'Ego depletion model: replication crisis update',
    'Mindful awareness and cognitive defusion',
    'Default mode network and mind-wandering',
    'Neurogenesis in hippocampus and memory formation',
    'Attention control training and distractibility',
    'Working memory training: transfer debate',
    'Cognitive flexibility and shifting between tasks',
    'Narrative self and autobiographical memory construction',
    'Language-thought relationship: Sapir-Whorf hypothesis',
    'Creativity as divergent + convergent thinking balance',
    'Learned helplessness vs. learned optimism',
    'Social comparison and self-esteem dynamics',
    'Emotion regulation strategies: reappraisal vs. suppression',
    'Stress inoculation training and resilience',
    'Psychological safety and team learning',
    'Attribution error: dispositional vs. situational',
  ],
  body: [
    'Progressive overload principle and adaptation',
    'Muscle protein synthesis window: leucine threshold',
    'EPOC and post-exercise calorie burn duration',
    'Type I vs. Type II muscle fiber recruitment',
    'Tendon adaptation to load: slower than muscle',
    'Foam rolling and myofascial release evidence',
    'Sleep and human growth hormone secretion peaks',
    'Cardiovascular drift and cardiac output',
    'Lactate threshold vs. anaerobic threshold distinction',
    'Detraining: cardiovascular vs. strength loss timeline',
    'Periodization: linear vs. undulating models',
    'Rhabdomyolysis risk in extreme exercise',
    'Bone density: weight-bearing exercise and osteoblasts',
    'Postural alignment and thoracic spine mobility',
    'Breathing mechanics and diaphragm activation',
    'Cold-water immersion and inflammation reduction',
    'DOMS mechanism: eccentric damage and repair',
    'Active recovery vs. passive recovery protocols',
    'Static stretching timing: pre vs. post workout effects',
    'Mobility vs. flexibility: functional distinction',
    'Grip strength training and longevity predictors',
    'Resting heart rate trends and aerobic fitness',
    'Non-exercise activity thermogenesis (NEAT) and weight',
    'Cortisol and overtraining syndrome markers',
    'Power output and fast-twitch fiber development',
    'Hypoxic training altitude adaptation mechanisms',
    'Core stability and intra-abdominal pressure regulation',
    'Shoulder impingement and rotator cuff activation',
    'Knee valgus and gluteal activation in squatting',
    'Hamstring vs. quadriceps strength ratio for knee health',
    'Sprint interval training vs. endurance for metabolic health',
    'Body recomposition: simultaneous fat loss and muscle gain',
    'Rate of perceived exertion (RPE) scale validity',
    'Creatine monohydrate and phosphocreatine resynthesis',
    'Eccentric exercise and tendinopathy treatment',
    'Balance training and proprioception in aging',
    'Heat acclimatization and plasma volume expansion',
    'Vo2max trainability and genetic ceiling',
    'Hypertrophy: mechanical tension vs. metabolic stress',
    'Isometric exercises and blood pressure response',
    'Swimming biomechanics and shoulder rotation',
    'Jump training and bone mineral density in youth',
    'Flexibility decline with aging and intervention response',
  ],
  communication: [
    'Nonviolent communication: needs vs. demands framework',
    'Active listening: reflective paraphrasing technique',
    'Persuasion principles: Cialdini\'s six influence factors',
    'Story structure and emotional resonance',
    'Feedback delivery: SBI model (Situation-Behavior-Impact)',
    'Psychological safety in team communication',
    'Conflict resolution: interest-based vs. positional bargaining',
    'Written communication: clarity, brevity, structure',
    'Presentation anxiety management techniques',
    'Socratic questioning in coaching conversations',
    'Emotional intelligence and empathy differentiation',
    'Body language deception indicators: research update',
    'Negotiation BATNA and reservation price concepts',
    'Difficult conversations: prepare-engage-follow-up',
    'Framing messages for different audience mental models',
    'Public speaking: pause, pace, pitch triangle',
    'Email communication: subject line and first sentence',
    'Meeting facilitation and participation equity',
    'Assertiveness training and boundary-setting language',
    'Deep listening vs. evaluative listening distinction',
    'Narrative persuasion and transportation theory',
    'Cross-cultural communication and high vs. low-context',
    'Digital communication asynchrony and latency effects',
    'Apology design: what makes an apology effective',
    'Question types: open vs. closed vs. hypothetical',
    'Trust building in professional relationships',
    'Silence as communication: strategic pausing',
    'Cognitive empathy vs. emotional empathy',
    'Debate vs. dialogue: goals and rules of engagement',
    'Voice quality: resonance, articulation, projection',
    'Metacommunicating: talking about how we communicate',
    'Gossip function: social bonding vs. reputation damage',
    'Small talk function in relationship building',
    'Rapport and mirroring: effectiveness limits',
    'Objection handling in sales and persuasion',
    'Gaslighting recognition and response patterns',
    'Leadership communication in uncertainty',
    'Feedback sandwich critique and alternatives',
  ],
  meta: [
    'Personal knowledge management (PKM) frameworks',
    'Zettelkasten permanent note method',
    'Atomic notes principle and idea isolation',
    'Evergreen notes vs. fleeting notes lifecycle',
    'PARA method: Projects, Areas, Resources, Archive',
    'Second brain concept and exobrain architecture',
    'Weekly review ritual: GTD capture and process',
    'Daily log vs. journal: capture vs. reflect distinction',
    'Habit stacking and implementation intentions',
    'Identity-based habits: who not what',
    'Systems thinking vs. goal-oriented thinking',
    'Digital minimalism and attention management',
    'Time-blocking and deep work scheduling',
    'Decision journal for improving judgment',
    'Learning from failure: post-mortem design',
    'Self-quantification: data collection and insight gap',
    'Automation of repetitive tasks: cost-benefit',
    'Note-linking and emergent insight in PKM',
    'Knowledge decay and spaced review systems',
    'Multi-agent AI systems architecture overview',
    'Context switching cost and batch processing',
    'Energy management vs. time management',
    'Procrastination as emotion regulation failure',
    'Perfectionism and the iterative shipping mindset',
    'Friction reduction in habit formation',
    'Social accountability and commitment devices',
    'Visualization techniques for goal encoding',
    'Morning routine design and evening planning',
    'Information diet and quality curation',
    'Documentation as thinking tool',
    'Feedback loops in personal systems design',
    'Resilience engineering in daily routines',
    'Minimum viable process for sustainable habits',
  ],
  'family-os': [
    'Family meeting ritual: agenda and roles',
    'Shared calendar system for household coordination',
    'Parenting style research: authoritative outcomes',
    'Conflict resolution at home: structured dialogue',
    'Financial household OS: spending review cycles',
    'Relationship maintenance: bids for connection',
    'Chore distribution and fairness perception',
    'Digital device agreements in family setting',
    'Meal planning as household efficiency lever',
    'Emergency protocol family preparedness',
    'Educational scaffolding at home: Vygotsky ZPD',
    'Boundary-setting with extended family members',
    'Weekly family retrospective format',
    'Celebration rituals and memory formation',
    'Caregiver burnout recognition and prevention',
    'Parent-child communication: validation before advice',
    'Allowance systems and financial literacy in children',
    'Sibling conflict mediation techniques',
  ],
  handyman: [
    'Plumbing basics: shutoff valves and leak diagnosis',
    'Electrical safety: circuit breaker identification',
    'Drywall patching and paint feathering technique',
    'HVAC filter replacement schedule and MERV ratings',
    'Tile grouting: mixing ratios and curing time',
    'Wood joinery basics: mortise, tenon, pocket screws',
    'Caulking and weatherstripping for energy efficiency',
    'Power tool safety and maintenance checklist',
    'Home inspection checklist: annual walkthrough items',
    'Drainage slope calculation for outdoor landscaping',
    'Paint primer selection: surface and VOC considerations',
    'Concrete crack repair: epoxy injection method',
    'Door hinge adjustment and sagging diagnosis',
    'Gutter cleaning schedule and downspout inspection',
    'Smoke detector placement and battery replacement',
    'Window glazing compound and seal replacement',
    'Deck staining: surface prep and finish coat timing',
    'Basic plumbing soldering technique',
    'PEX tubing vs. copper: cost and flexibility tradeoffs',
    'Lawn aerification and overseeding timing',
  ],
};

// ─── Skills (inner ring) ─────────────────────────────────────────────────────
const SKILLS = [
  { id: 'skill-write-script',       label: 'Write Script',          status: 'active' },
  { id: 'skill-feynman-note',       label: 'Feynman Note',          status: 'active' },
  { id: 'skill-grounded-research',  label: 'Grounded Research',     status: 'active' },
  { id: 'skill-daily-log',          label: 'Daily Log',             status: 'active' },
  { id: 'skill-weekly-review',      label: 'Weekly Review',         status: 'active' },
  { id: 'skill-citation-format',    label: 'Citation Format',       status: 'active' },
  { id: 'skill-challenge-section',  label: 'Challenge Section',     status: 'active' },
  { id: 'skill-tier-tagging',       label: 'Tier Tagging',          status: 'active' },
  { id: 'skill-telegram-brief',     label: 'Telegram Brief',        status: 'active' },
  { id: 'skill-diagram-gen',        label: 'Diagram Gen',           status: 'active' },
  { id: 'skill-abstention-check',   label: 'Abstention Check',      status: 'active' },
  { id: 'skill-cross-link',         label: 'Cross-Link',            status: 'active' },
  { id: 'skill-draft-email',        label: 'Draft Email',           status: 'active' },
  { id: 'skill-self-review',        label: 'Self Review',           status: 'active' },
  { id: 'skill-embed-search',       label: 'Embed Search',          status: 'active' },
];

// ─── Routines ─────────────────────────────────────────────────────────────────
const ROUTINES = [
  { id: 'routine-micro-learning-push', label: 'Micro-Learning Push',   status: 'active' },
  { id: 'routine-weekly-review',       label: 'Weekly Review',          status: 'active' },
  { id: 'routine-scan-refresh',        label: 'Scan & Refresh',         status: 'active' },
  { id: 'routine-morning-briefing',    label: 'Morning Briefing',       status: 'active' },
  { id: 'routine-oauth-reconsent',     label: 'OAuth Reconsent',        status: 'planned' },
  { id: 'routine-supabase-keepalive',  label: 'Supabase Keepalive',     status: 'active' },
  { id: 'routine-export-brain',        label: 'Export Brain',           status: 'active' },
  { id: 'routine-citation-audit',      label: 'Citation Audit',         status: 'planned' },
];

// ─── Applications (outer ring) ───────────────────────────────────────────────
const APPS = [
  { id: 'app-gmail',       label: 'Gmail',          icon: 'mail',       trustLevel: 'human-approved', inUse: true },
  { id: 'app-calendar',    label: 'Calendar',       icon: 'calendar',   trustLevel: 'human-approved', inUse: true },
  { id: 'app-drive',       label: 'Google Drive',   icon: 'hard-drive', trustLevel: 'read-only',      inUse: true },
  { id: 'app-tasks',       label: 'Tasks',          icon: 'check-square',trustLevel: 'human-approved',inUse: true },
  { id: 'app-telegram',    label: 'Telegram',       icon: 'send',       trustLevel: 'human-approved', inUse: true },
  { id: 'app-supabase',    label: 'Supabase',       icon: 'database',   trustLevel: 'direct',         inUse: true },
  { id: 'app-mcp',         label: 'Custom MCP',     icon: 'network',    trustLevel: 'direct',         inUse: true },
  { id: 'app-gemini',      label: 'Gemini',         icon: 'bot',        trustLevel: 'direct',         inUse: true },
  { id: 'app-groq',        label: 'Groq',           icon: 'zap',        trustLevel: 'direct',         inUse: true },
  { id: 'app-openrouter',  label: 'OpenRouter',     icon: 'shuffle',    trustLevel: 'direct',         inUse: false },
  { id: 'app-europe-pmc',  label: 'Europe PMC',     icon: 'microscope', trustLevel: 'read-only',      inUse: true },
];

// ─── Build nodes ─────────────────────────────────────────────────────────────
const nodes = [];
const edges = [];

// Center node
nodes.push({ id: 'center-vizier', label: 'VIZIER', type: 'center', ring: 'center' });

// Domain nodes
for (const d of DOMAINS) {
  nodes.push({ id: `domain-${d.id}`, label: d.label, type: 'domain', ring: 'knowledge', domain: d.id, color: d.color });
  edges.push({ source: 'center-vizier', target: `domain-${d.id}`, type: 'domain-core' });
}

// Skills
for (const s of SKILLS) {
  nodes.push({ id: s.id, label: s.label, type: 'skill', ring: 'skills', status: s.status });
  edges.push({ source: 'center-vizier', target: s.id, type: 'skill-core' });
}

// Routines
for (const r of ROUTINES) {
  nodes.push({ id: r.id, label: r.label, type: 'routine', ring: 'routines', status: r.status });
  edges.push({ source: 'center-vizier', target: r.id, type: 'routine-core' });
}

// Applications
for (const a of APPS) {
  nodes.push({ id: a.id, label: a.label, type: 'application', ring: 'applications', icon: a.icon, trustLevel: a.trustLevel, inUse: a.inUse });
  edges.push({ source: 'center-vizier', target: a.id, type: 'app-core' });
}

// ─── Note nodes ──────────────────────────────────────────────────────────────
const noteTypes = ['feynman', 'knowledge'];
const tiers = [1, 1, 2, 2, 3, 4]; // Weighted toward 1–2

let dayOffset = 0;
const totalDays = 251;

for (const domain of DOMAINS) {
  const topicPool = rng.shuffle([...TOPICS[domain.id]]);
  const count = domain.count;

  for (let i = 0; i < count; i++) {
    const topic = topicPool[i % topicPool.length];
    // Unique enough with domain + index
    const slug = `${domain.id}-note-${String(i + 1).padStart(3, '0')}`;
    const noteId = `note-${slug}`;
    const noteType = rng.pick(noteTypes);
    const tier = rng.pick(tiers);

    // Spread dates across 251 days (domain-weighted density mimics real journal growth)
    dayOffset = (dayOffset + rng.int(0, 3)) % totalDays;
    const noteDate = new Date(START_DATE);
    noteDate.setDate(noteDate.getDate() - (totalDays - dayOffset - 1));

    nodes.push({
      id: noteId,
      label: topic,
      type: noteType,
      ring: 'knowledge',
      domain: domain.id,
      tier: tier,
      tags: [domain.id, noteType, `tier-${tier}`],
      date: noteDate.toISOString().slice(0, 10),
      slug: slug,
    });

    // Domain→note containment edge
    edges.push({ source: `domain-${domain.id}`, target: noteId, type: 'containment' });

    // Skill usage edges (skill used to create this note)
    const skillUser = rng.pick(SKILLS.slice(0, 8));
    edges.push({ source: skillUser.id, target: noteId, type: 'used-by' });
  }
}

// ─── Cross-domain wiki-links ──────────────────────────────────────────────────
// Build an index of note nodes per domain for efficient linking
const notesByDomain = {};
for (const n of nodes) {
  if (n.ring === 'knowledge' && n.type !== 'domain') {
    if (!notesByDomain[n.domain]) notesByDomain[n.domain] = [];
    notesByDomain[n.domain].push(n.id);
  }
}

// Cross-link rules: which domains should link to which
const crossLinkRules = [
  ['gut',          'mind-gut',      0.45],
  ['gut',          'nutrition',     0.40],
  ['gut',          'health-core',   0.30],
  ['mind-gut',     'mind',          0.40],
  ['mind-gut',     'gut',           0.45],
  ['mind-gut',     'nutrition',     0.25],
  ['mind-gut',     'health-core',   0.20],
  ['nutrition',    'gut',           0.40],
  ['nutrition',    'health-core',   0.35],
  ['nutrition',    'body',          0.25],
  ['health-core',  'gut',           0.25],
  ['health-core',  'body',          0.30],
  ['health-core',  'nutrition',     0.30],
  ['mind',         'mind-gut',      0.30],
  ['mind',         'meta',          0.35],
  ['mind',         'communication', 0.25],
  ['body',         'health-core',   0.30],
  ['body',         'nutrition',     0.25],
  ['communication','mind',          0.25],
  ['communication','family-os',     0.30],
  ['meta',         'mind',          0.35],
  ['family-os',    'communication', 0.30],
  ['family-os',    'meta',          0.20],
];

for (const [fromDomain, toDomain, prob] of crossLinkRules) {
  const fromNotes = notesByDomain[fromDomain] || [];
  const toNotes   = notesByDomain[toDomain]   || [];
  if (!fromNotes.length || !toNotes.length) continue;

  for (const fromId of fromNotes) {
    if (rng.next() < prob) {
      const toId = rng.pick(toNotes);
      // Avoid self-links and duplicates (lightweight check)
      if (fromId !== toId) {
        edges.push({ source: fromId, target: toId, type: 'wiki-link' });
      }
    }
  }
}

// ─── Routine → Skill edges ────────────────────────────────────────────────────
const routineSkillMap = {
  'routine-micro-learning-push': ['skill-feynman-note', 'skill-grounded-research', 'skill-telegram-brief'],
  'routine-weekly-review':       ['skill-weekly-review', 'skill-self-review'],
  'routine-scan-refresh':        ['skill-embed-search', 'skill-abstention-check'],
  'routine-morning-briefing':    ['skill-telegram-brief', 'skill-daily-log'],
  'routine-export-brain':        ['skill-cross-link', 'skill-tier-tagging'],
  'routine-citation-audit':      ['skill-citation-format', 'skill-tier-tagging'],
};
for (const [routineId, skillIds] of Object.entries(routineSkillMap)) {
  for (const skillId of skillIds) {
    edges.push({ source: routineId, target: skillId, type: 'routine-skill' });
  }
}

// ─── App → Routine edges ─────────────────────────────────────────────────────
const appRoutineMap = {
  'app-telegram':  ['routine-micro-learning-push', 'routine-morning-briefing'],
  'app-gmail':     ['routine-morning-briefing'],
  'app-calendar':  ['routine-morning-briefing', 'routine-weekly-review'],
  'app-supabase':  ['routine-supabase-keepalive', 'routine-scan-refresh'],
  'app-europe-pmc':['routine-scan-refresh'],
  'app-gemini':    ['routine-micro-learning-push', 'routine-scan-refresh'],
};
for (const [appId, routineIds] of Object.entries(appRoutineMap)) {
  for (const routineId of routineIds) {
    edges.push({ source: appId, target: routineId, type: 'app-routine' });
  }
}

// ─── Deduplicate edges ────────────────────────────────────────────────────────
const edgeSet = new Set();
const uniqueEdges = [];
for (const e of edges) {
  const key = `${e.source}||${e.target}||${e.type}`;
  if (!edgeSet.has(key)) {
    edgeSet.add(key);
    uniqueEdges.push(e);
  }
}

// ─── Build domain stats ───────────────────────────────────────────────────────
const domainStats = {};
for (const n of nodes) {
  if (n.ring === 'knowledge' && n.domain && n.type !== 'domain') {
    domainStats[n.domain] = (domainStats[n.domain] || 0) + 1;
  }
}

// ─── Output ───────────────────────────────────────────────────────────────────
const output = {
  nodes,
  edges: uniqueEdges,
  metadata: {
    generated_at: new Date().toISOString(),
    preview: true,
    day: 251,
    label: 'Day-251 Vision (PREVIEW — illustrative, not real entries)',
    node_count: nodes.length,
    edge_count: uniqueEdges.length,
    domain_stats: domainStats,
  }
};

const outPath = path.join(__dirname, '../../site/brain-index.preview.json');
fs.writeFileSync(outPath, JSON.stringify(output, null, 2));

console.log(`✅ GATE 1: Preview brain written to site/brain-index.preview.json`);
console.log(`   Nodes: ${nodes.length}  |  Edges: ${uniqueEdges.length}`);
console.log(`   Domain breakdown:`, domainStats);

// Validate gate
const valid = (nodes.length >= 480 && nodes.length <= 520) && (uniqueEdges.length >= 1000);
if (!valid) {
  console.error(`❌ GATE 1 FAILED: Nodes=${nodes.length} (need 480-520), Edges=${uniqueEdges.length} (need ≥1000)`);
  process.exit(1);
} else {
  console.log(`✅ GATE 1 PASSED`);
}
