/* ═══════════════════════════════════════════════
   REVIEW PAGE – Simulated AI context surfacing
   AI supports, not replaces. Surfaces raw materials
   for the consultant: documents, papers, concepts.
   ═══════════════════════════════════════════════ */

/* ── Content Database ──────────────────────────
   Keyed by topic keywords detected in request text.
   Each topic contributes concepts, drive docs,
   frameworks, and literature. The system merges
   results from all matching topics.
   ─────────────────────────────────────────────── */

var TOPIC_DB = {

  authorship: {
    keywords: ['authorship', 'author', 'byline', 'publication', 'credit', 'co-author', 'first author', 'last author'],
    concepts: [
      { term: 'Authorship vs. Acknowledgment', note: 'Request references contribution levels — the boundary between authorship and acknowledgment is often contested in multi-site studies.' },
      { term: 'Alphabetical vs. Contribution-Based Ordering', note: 'Two competing norms. Request explicitly names this tension.' },
      { term: 'Group/Consortium Authorship', note: '"for the [Consortium]" byline model. Common in large collaborations but journal policies vary.' },
      { term: 'CRediT Taxonomy', note: 'Contributor Roles Taxonomy — 14 defined roles. May help disaggregate contributions without changing author order.' }
    ],
    drive: [
      { title: 'MAP-FGS Authorship Guidance Memo', type: 'Prior Consultation', date: '2026-01', desc: 'Consortia authorship policy developed for the MAP-FGS project. Addressed similar multi-country, multi-PI dynamics.', match: 'High' },
      { title: 'BRIDGE Consortium Supplement Policy', type: 'Reference Document', date: '2024-08', desc: '15-article supplement with explicit authorship framework. Includes rotating first-author model.', match: 'High' },
      { title: 'ICMJE Criteria Quick Reference', type: 'Policy Document', date: '2023-06', desc: '4 criteria for authorship. Internal reference copy with annotations from prior consultations.', match: 'Medium' }
    ],
    frameworks: [
      { name: 'ICMJE Authorship Criteria (2023 revision)', scope: 'International — journal policy', desc: 'Four requirements: substantial contribution, drafting/revising, final approval, accountability. Widely adopted but criticized for not addressing power dynamics.', relevance: 'High' },
      { name: 'CRediT Contributor Roles Taxonomy', scope: 'International — publisher standard', desc: '14 contributor roles (Conceptualization, Data Curation, Formal Analysis, etc.). Increasingly required by journals. Complements but does not replace authorship decisions.', relevance: 'High' },
      { name: 'COPE Authorship Guidelines', scope: 'International — publisher ethics', desc: 'Committee on Publication Ethics guidance on authorship disputes, gift authorship, and ghost authorship.', relevance: 'Medium' }
    ],
    literature: [
      { cite: 'Hedt-Gauthier BL, et al. "Academic collaboration and global health: a call for a new model." BMJ Global Health, 2019;4(4):e001759.', excerpt: 'Argues current authorship practices disadvantage LMIC researchers. Proposes structural reforms for equitable credit in global health partnerships.', tag: 'Equity' },
      { cite: 'Smith E, et al. "Authorship ethics in a collaborative era." Research Ethics, 2020;16(1-2):1-18.', excerpt: 'Reviews consortium authorship models across 12 large research collaborations. Finds no single model avoids all tensions — portfolio approaches perform best.', tag: 'Models' },
      { cite: 'Parker M, et al. "Fair research partnerships and the moral foundations of global health." Bull WHO, 2023;101(1):63-71.', excerpt: 'Framework for fair partnerships including authorship. Emphasizes process (who decides) over formula (what rule).', tag: 'Framework' },
      { cite: 'Rohwer A, et al. "Authorship practices in African health research partnerships." Research Integrity and Peer Review, 2022;7:5.', excerpt: 'Study of authorship practices in African health research partnerships. Documents gap between stated norms (equity) and actual practices (HIC-first).', tag: 'Evidence' }
    ]
  },

  equity: {
    keywords: ['equity', 'lmic', 'hic', 'fairness', 'fair', 'justice', 'power', 'colonial', 'decoloni'],
    concepts: [
      { term: 'HIC/LMIC Power Dynamics', note: 'Request names HIC co-PIs doing analytical work while LMIC norms expect first/last positions. Classic tension in global health partnerships.' },
      { term: 'Research Equity Requirements', note: 'Funder mentioned (Wellcome Trust) has explicit equity expectations. These may create obligations beyond standard practice.' },
      { term: 'Capacity vs. Credit', note: 'Data collection teams contributed significantly but may not meet traditional authorship criteria. Raises question of whether criteria themselves are equitable.' }
    ],
    drive: [
      { title: 'TFGH Fair Partnership Principles', type: 'Internal Policy', date: '2025-03', desc: 'Organizational principles for equitable research partnerships. Section 4 addresses publication equity.', match: 'Medium' },
      { title: 'Wellcome Trust Equity Requirements Summary', type: 'Funder Policy', date: '2025-11', desc: 'Compiled summary of Wellcome equity requirements relevant to consortium projects.', match: 'Medium' }
    ],
    frameworks: [
      { name: 'COHRED Fair Research Contracting', scope: 'International — research governance', desc: 'Checklist for equitable research agreements including IP, data ownership, and publication rights.', relevance: 'Medium' },
      { name: 'Research Fairness Initiative (RFI)', scope: 'International — institutional standard', desc: 'Reporting standard for research institutions to demonstrate equitable partnership practices.', relevance: 'Low' }
    ],
    literature: [
      { cite: 'Boshoff N. "Neo-colonialism and research collaboration in Central Africa." Scientometrics, 2009;81(2):413-434.', excerpt: 'Quantitative analysis of authorship patterns in North-South collaborations. First/last author positions held by HIC researchers in 68% of cases studied.', tag: 'Evidence' },
      { cite: 'Irani E, et al. "Authorship equity in global health." Global Health Action, 2023;16(1):2186730.', excerpt: 'Practical recommendations for institutions and consortia to operationalize authorship equity. Includes decision flowchart.', tag: 'Practical' }
    ]
  },

  consortium: {
    keywords: ['consortium', 'multi-country', 'multi-site', 'collaborative', 'partnership', 'network'],
    concepts: [
      { term: 'Consortium-Level vs. Country-Level Papers', note: 'Request distinguishes these. Different authorship rules may apply to each category.' },
      { term: 'Portfolio Approach', note: 'Rotating lead authorship across publications. Distributes credit over time rather than per-paper.' },
      { term: 'Publication Planning', note: '12+ papers planned. Early policy avoids ad hoc disputes. Policy before papers, not after.' }
    ],
    drive: [
      { title: 'NCI Cohort Consortium Model (reference)', type: 'External Reference', date: '2022-04', desc: 'Example of a large multi-site consortium with formalized authorship policy. Referenced as comparator.', match: 'Low' }
    ],
    frameworks: [
      { name: 'Global Code of Conduct for Research in Resource-Poor Settings', scope: 'International — research ethics', desc: 'Addresses equitable partnerships including data sharing, authorship, and capacity building obligations.', relevance: 'Medium' }
    ],
    literature: [
      { cite: 'Okwaro FM, Geissler PW. "In/dependent collaborations: perceptions and experiences of African scientists in transnational HIV research." Medical Anthropology Quarterly, 2015;29(4):492-511.', excerpt: 'Qualitative study of how African scientists experience authorship and credit in multi-site collaborations. Identifies hidden labor that goes unrecognized.', tag: 'Qualitative' }
    ]
  },

  consent: {
    keywords: ['consent', 'informed consent', 'permission', 'assent', 'opt-in', 'opt-out'],
    concepts: [
      { term: 'Informed Consent Models', note: 'Different consent approaches carry different ethical weight — individual opt-in, community consent, opt-out with notification.' },
      { term: 'Consent Documentation', note: 'Form design, language, and process matter as much as the signature. Cultural context shapes what "informed" means.' }
    ],
    drive: [
      { title: 'Consent Template Library (FACE)', type: 'Template', date: '2025-08', desc: 'Collection of consent form templates used across FACE consultations. Multiple languages and contexts.', match: 'Medium' },
      { title: 'WHO Consent Guidance Summary', type: 'Reference', date: '2025-05', desc: 'Internal summary of WHO guidance on informed consent in public health research contexts.', match: 'Medium' }
    ],
    frameworks: [
      { name: 'Belmont Report (1979)', scope: 'US — foundational', desc: 'Respect for persons, beneficence, justice. The bedrock framework for human subjects protection.', relevance: 'High' },
      { name: 'CIOMS International Ethical Guidelines (2016)', scope: 'International — research ethics', desc: 'Guidelines for biomedical research involving human subjects. Guideline 9 covers informed consent specifically.', relevance: 'High' }
    ],
    literature: [
      { cite: 'Mandava A, et al. "The quality of informed consent: mapping the landscape." Journal of Medical Ethics, 2012;38(6):356-365.', excerpt: 'Systematic review of empirical studies on informed consent quality. Finds significant gap between what is disclosed and what is understood.', tag: 'Review' }
    ]
  },

  community: {
    keywords: ['community', 'stakeholder', 'engagement', 'participation', 'affected', 'vulnerable', 'beneficiar'],
    concepts: [
      { term: 'Missing Voices', note: 'Request identifies people affected but not currently in the conversation. Standard flag for ethics review.' },
      { term: 'Stakeholder Mapping', note: 'Multiple groups with competing interests. Structured mapping helps ensure no perspective is overlooked.' }
    ],
    drive: [
      { title: 'Stakeholder Engagement Best Practices (FACE)', type: 'Guide', date: '2025-06', desc: 'Internal guide for identifying and engaging stakeholders in ethics consultations.', match: 'Low' }
    ],
    frameworks: [
      { name: 'IAP2 Spectrum of Public Participation', scope: 'International — engagement model', desc: 'Inform → Consult → Involve → Collaborate → Empower. Helps calibrate the appropriate level of engagement.', relevance: 'Medium' }
    ],
    literature: []
  },

  mda: {
    keywords: ['mda', 'mass drug', 'ntd', 'neglected tropical', 'filariasis', 'schistosomiasis', 'helminth', 'deworming'],
    concepts: [
      { term: 'NTD Research Ethics', note: 'NTD research in endemic settings raises specific questions about community consent, benefit-sharing, and power dynamics.' },
      { term: 'Disease-Specific Context', note: 'Lymphatic filariasis programs have specific operational contexts that shape ethical considerations (MDA campaigns, sentinel site monitoring).' }
    ],
    drive: [
      { title: 'MDA Ethics Review Notes', type: 'Prior Work', date: '2025-12', desc: 'Working notes from prior engagement on ethical issues in mass drug administration programs.', match: 'Medium' },
      { title: 'WHO NTD Ethics Framework Summary', type: 'Reference', date: '2025-10', desc: 'Summary of WHO guidance relevant to ethical issues in NTD research and intervention programs.', match: 'Low' }
    ],
    frameworks: [
      { name: 'WHO NTD Roadmap 2021-2030', scope: 'International — programmatic', desc: 'Strategic targets for NTD elimination. Frames the research context for NTD consortium work.', relevance: 'Low' }
    ],
    literature: [
      { cite: 'Pratt B, Loff B. "Equity in research partnerships for NTDs." Am J Trop Med Hyg, 2014;90(5):803-810.', excerpt: 'Analyzes research partnership equity specifically in NTD context. Argues NTD partnerships face unique challenges due to reliance on endemic country infrastructure.', tag: 'NTD-specific' }
    ]
  }
};

/* ── Topic Detection ───────────────────────── */
function detectTopics(text) {
  var lowerText = (text || '').toLowerCase();
  var matched = [];
  for (var topic in TOPIC_DB) {
    if (!TOPIC_DB.hasOwnProperty(topic)) continue;
    var keywords = TOPIC_DB[topic].keywords;
    for (var i = 0; i < keywords.length; i++) {
      if (lowerText.indexOf(keywords[i]) !== -1) {
        matched.push(topic);
        break;
      }
    }
  }
  return matched;
}

/* ── Merge Results ─────────────────────────── */
function mergeResults(topics) {
  var seen = { concepts: {}, drive: {}, frameworks: {}, literature: {} };
  var results = { concepts: [], drive: [], frameworks: [], literature: [] };

  for (var i = 0; i < topics.length; i++) {
    var t = TOPIC_DB[topics[i]];
    if (!t) continue;
    mergeList(t.concepts, results.concepts, seen.concepts, 'term');
    mergeList(t.drive, results.drive, seen.drive, 'title');
    mergeList(t.frameworks, results.frameworks, seen.frameworks, 'name');
    mergeList(t.literature, results.literature, seen.literature, 'cite');
  }
  return results;
}

function mergeList(source, target, seen, key) {
  if (!source) return;
  for (var i = 0; i < source.length; i++) {
    var id = source[i][key];
    if (!seen[id]) {
      seen[id] = true;
      target.push(source[i]);
    }
  }
}

/* ── Render Functions ──────────────────────── */

function renderRequestSummary(data) {
  var c = document.getElementById('request-summary-content');
  c.textContent = '';

  var engLabels = { full: 'Full Consultation', quick: 'Quick Guidance', meeting: 'Meeting Facilitation', review: 'Document Review' };
  var urgLabels = { urgent: 'Urgent', standard: 'Standard (2-4 weeks)', flexible: 'Flexible' };

  addRow(c, 'Requester', data.name);
  addRow(c, 'Organization', data.organization);
  addRow(c, 'Email', data.email);
  if (data.otherPeople) addRow(c, 'Key People', data.otherPeople);
  addRow(c, 'Engagement Type', engLabels[data.engagementType] || 'Not specified');
  addRow(c, 'Urgency', urgLabels[data.urgency] || 'Not specified');
  if (data.decisionDate) addRow(c, 'Decision Date', formatDate(data.decisionDate));

  var hr = document.createElement('hr');
  hr.className = 'divider';
  c.appendChild(hr);

  var sitLabel = E('div', 'text-xs text-muted', 'Situation described:');
  sitLabel.style.marginBottom = '0.35rem';
  sitLabel.style.fontWeight = '600';
  c.appendChild(sitLabel);

  var sitText = E('div', '', data.situation);
  sitText.style.fontSize = '0.875rem';
  sitText.style.lineHeight = '1.6';
  sitText.style.whiteSpace = 'pre-wrap';
  c.appendChild(sitText);

  if (data.whyNow) {
    var whyLabel = E('div', 'text-xs text-muted mt-2', 'Why now:');
    whyLabel.style.fontWeight = '600';
    whyLabel.style.marginBottom = '0.35rem';
    c.appendChild(whyLabel);
    var whyText = E('div', '', data.whyNow);
    whyText.style.fontSize = '0.875rem';
    whyText.style.lineHeight = '1.6';
    whyText.style.whiteSpace = 'pre-wrap';
    c.appendChild(whyText);
  }
}

function addRow(container, label, value) {
  if (!value) return;
  var row = E('div', 'summary-row');
  row.appendChild(E('div', 'summary-label', label));
  row.appendChild(E('div', 'summary-value', value));
  container.appendChild(row);
}

function renderConcepts(concepts) {
  var c = document.getElementById('concepts-list');
  c.textContent = '';
  for (var i = 0; i < concepts.length; i++) {
    var item = concepts[i];
    var div = E('div', '');
    div.style.padding = '0.6rem 0';
    if (i > 0) div.style.borderTop = '1px solid var(--border-light)';

    var termEl = E('div', '');
    termEl.style.fontWeight = '600';
    termEl.style.fontSize = '0.9rem';
    termEl.style.color = 'var(--ink)';
    termEl.style.marginBottom = '0.2rem';
    termEl.textContent = item.term;
    div.appendChild(termEl);

    var noteEl = E('div', 'text-small text-light', item.note);
    noteEl.style.lineHeight = '1.5';
    div.appendChild(noteEl);

    c.appendChild(div);
  }
}

function renderDrive(docs) {
  var c = document.getElementById('drive-list');
  c.textContent = '';

  if (docs.length === 0) {
    c.appendChild(E('div', 'text-small text-muted', 'No prior consultations or internal documents matched this request.'));
    return;
  }

  for (var i = 0; i < docs.length; i++) {
    var doc = docs[i];
    var div = E('div', '');
    div.style.padding = '0.75rem 0';
    if (i > 0) div.style.borderTop = '1px solid var(--border-light)';

    var header = E('div', 'flex items-center justify-between gap-1');
    var titleEl = E('div', '');
    titleEl.style.fontWeight = '600';
    titleEl.style.fontSize = '0.9rem';
    titleEl.textContent = doc.title;
    header.appendChild(titleEl);

    var matchBadge = E('span', 'badge ' + (doc.match === 'High' ? 'badge-high' : doc.match === 'Medium' ? 'badge-medium' : 'badge-low'), doc.match);
    header.appendChild(matchBadge);
    div.appendChild(header);

    var meta = E('div', 'text-xs text-muted mt-1');
    meta.textContent = doc.type + ' \u00b7 ' + doc.date;
    div.appendChild(meta);

    var descEl = E('div', 'text-small text-light mt-1', doc.desc);
    descEl.style.lineHeight = '1.5';
    div.appendChild(descEl);

    c.appendChild(div);
  }
}

function renderFrameworks(frameworks) {
  var c = document.getElementById('frameworks-list');
  c.textContent = '';

  for (var i = 0; i < frameworks.length; i++) {
    var fw = frameworks[i];
    var div = E('div', '');
    div.style.padding = '0.75rem 0';
    if (i > 0) div.style.borderTop = '1px solid var(--border-light)';

    var header = E('div', 'flex items-center justify-between gap-1');
    var nameEl = E('div', '');
    nameEl.style.fontWeight = '600';
    nameEl.style.fontSize = '0.9rem';
    nameEl.textContent = fw.name;
    header.appendChild(nameEl);

    var relBadge = E('span', 'badge ' + (fw.relevance === 'High' ? 'badge-high' : fw.relevance === 'Medium' ? 'badge-medium' : 'badge-low'), fw.relevance);
    header.appendChild(relBadge);
    div.appendChild(header);

    var scope = E('div', 'text-xs text-muted mt-1', fw.scope);
    div.appendChild(scope);

    var descEl = E('div', 'text-small text-light mt-1', fw.desc);
    descEl.style.lineHeight = '1.5';
    div.appendChild(descEl);

    c.appendChild(div);
  }
}

function renderLiterature(papers) {
  var c = document.getElementById('literature-list');
  c.textContent = '';

  for (var i = 0; i < papers.length; i++) {
    var paper = papers[i];
    var div = E('div', '');
    div.style.padding = '0.75rem 0';
    if (i > 0) div.style.borderTop = '1px solid var(--border-light)';

    var header = E('div', 'flex items-center gap-1');
    var tagEl = E('span', 'badge badge-navy', paper.tag);
    tagEl.style.flexShrink = '0';
    header.appendChild(tagEl);
    div.appendChild(header);

    var citeEl = E('div', 'text-small mt-1');
    citeEl.style.fontWeight = '500';
    citeEl.style.lineHeight = '1.5';
    citeEl.textContent = paper.cite;
    div.appendChild(citeEl);

    var excerptEl = E('div', 'text-small text-light mt-1', paper.excerpt);
    excerptEl.style.lineHeight = '1.5';
    excerptEl.style.fontStyle = 'italic';
    div.appendChild(excerptEl);

    c.appendChild(div);
  }
}

/* ── Triage Sidebar ────────────────────────── */
function renderTriage(data, topics, results) {

  // Engagement suggestion
  var engEl = document.getElementById('triage-engagement');
  engEl.textContent = '';
  var suggested = suggestEngagement(data, topics, results);

  var engName = E('div', '', suggested.type);
  engName.style.fontFamily = 'var(--font-heading)';
  engName.style.fontSize = '1.15rem';
  engName.style.marginBottom = '0.4rem';
  engEl.appendChild(engName);

  var confBar = E('div', 'confidence-bar');
  var confFill = E('div', 'confidence-fill confidence-fill-high');
  confFill.style.width = '0%';
  confBar.appendChild(confFill);
  engEl.appendChild(confBar);

  var confLabel = E('div', 'text-xs text-muted mt-1', suggested.confidence + '% confidence');
  engEl.appendChild(confLabel);

  var rationale = E('div', 'text-small text-light mt-2', suggested.rationale);
  rationale.style.lineHeight = '1.5';
  engEl.appendChild(rationale);

  // Animate confidence bar
  setTimeout(function() { confFill.style.width = suggested.confidence + '%'; }, 100);

  document.getElementById('sidebar-triage').style.display = '';

  // Complexity
  var compEl = document.getElementById('triage-complexity');
  compEl.textContent = '';
  var complexity = assessComplexity(data, topics, results);

  var compLevel = E('div', 'flex items-center gap-1 mb-2');
  var compDots = '';
  for (var i = 0; i < 3; i++) {
    var dot = E('div', '');
    dot.style.width = '12px';
    dot.style.height = '12px';
    dot.style.borderRadius = '50%';
    dot.style.background = i < complexity.level ? 'var(--amber)' : 'var(--border-light)';
    compLevel.appendChild(dot);
  }
  var compLabel = E('span', 'text-small', ' ' + complexity.label);
  compLabel.style.fontWeight = '600';
  compLabel.style.marginLeft = '0.3rem';
  compLevel.appendChild(compLabel);
  compEl.appendChild(compLevel);

  for (var i = 0; i < complexity.reasons.length; i++) {
    var reason = E('div', 'text-small text-light');
    reason.style.padding = '0.2rem 0 0.2rem 1rem';
    reason.style.borderLeft = '2px solid var(--border-light)';
    reason.style.marginBottom = '0.35rem';
    reason.textContent = complexity.reasons[i];
    compEl.appendChild(reason);
  }
  document.getElementById('sidebar-complexity').style.display = '';

  // Timeline
  var timeEl = document.getElementById('triage-timeline');
  timeEl.textContent = '';
  var urgLabels = { urgent: 'Urgent (within 1 week)', standard: '2-4 weeks (Standard)', flexible: 'Flexible timeline' };
  var timeText = E('div', 'text-small', urgLabels[data.urgency] || 'Not specified');
  timeText.style.fontWeight = '500';
  timeEl.appendChild(timeText);
  if (data.decisionDate) {
    var dateText = E('div', 'text-xs text-muted mt-1', 'Decision needed by ' + formatDate(data.decisionDate));
    timeEl.appendChild(dateText);
  }
  document.getElementById('sidebar-timeline').style.display = '';

  // Next Steps
  var nextEl = document.getElementById('triage-next');
  nextEl.textContent = '';
  var steps = [
    'Request received and preliminary context surfaced.',
    'A consultant will review these materials and contact you within 2 business days.',
    'Initial scoping conversation to confirm engagement type and scope.'
  ];
  for (var i = 0; i < steps.length; i++) {
    var step = E('div', 'flex gap-1 mb-2');
    step.style.alignItems = 'flex-start';
    var num = E('div', 'text-xs');
    num.style.width = '18px';
    num.style.height = '18px';
    num.style.borderRadius = '50%';
    num.style.background = 'var(--navy-wash)';
    num.style.color = 'var(--navy)';
    num.style.display = 'flex';
    num.style.alignItems = 'center';
    num.style.justifyContent = 'center';
    num.style.fontWeight = '700';
    num.style.flexShrink = '0';
    num.style.marginTop = '2px';
    num.textContent = String(i + 1);
    step.appendChild(num);
    step.appendChild(E('div', 'text-small text-light', steps[i]));
    nextEl.appendChild(step);
  }
  document.getElementById('sidebar-next').style.display = '';
}

function suggestEngagement(data, topics, results) {
  // Simple heuristic based on signals
  var signals = {
    multipleStakeholders: (data.otherPeople || '').split(',').length > 3,
    missingVoices: !!data.affectedNotInvolved,
    manyTopics: topics.length >= 3,
    manyFrameworks: results.frameworks.length >= 4,
    priorWork: results.drive.some(function(d) { return d.match === 'High'; }),
    clientRequested: data.engagementType
  };

  // If client picked one, use it but adjust confidence
  if (signals.clientRequested === 'full' || (signals.multipleStakeholders && signals.manyTopics)) {
    return {
      type: 'Full Consultation',
      confidence: 85,
      rationale: 'Multiple stakeholders with competing interests, several applicable frameworks, and complexity indicators suggest a structured multi-phase engagement.'
    };
  }
  if (signals.clientRequested === 'quick') {
    return {
      type: 'Quick Guidance',
      confidence: signals.manyTopics ? 55 : 78,
      rationale: signals.manyTopics
        ? 'Client requested quick guidance, but the number of issues flagged may warrant a fuller engagement. Discuss in scoping call.'
        : 'Clear question with existing precedent. A focused written response should address this.'
    };
  }
  if (signals.clientRequested === 'meeting') {
    return { type: 'Meeting Facilitation', confidence: 72, rationale: 'Client requests facilitated discussion. Review materials suggest structured dialogue would benefit from a prepared framework.' };
  }
  if (signals.clientRequested === 'review') {
    return { type: 'Document Review', confidence: 75, rationale: 'Targeted review of existing materials. Scope should be confirmed in initial conversation.' };
  }

  // Default
  return { type: 'Full Consultation', confidence: 70, rationale: 'Based on the number of stakeholders and issues flagged, a structured consultation is recommended. Confirm in scoping call.' };
}

function assessComplexity(data, topics, results) {
  var score = 0;
  var reasons = [];

  if ((data.otherPeople || '').split(',').length > 3) { score++; reasons.push('Multiple stakeholder groups with distinct interests'); }
  if (data.affectedNotInvolved) { score++; reasons.push('Affected parties not yet at the table'); }
  if (topics.length >= 3) { score++; reasons.push(topics.length + ' overlapping ethical domains identified'); }
  if (results.frameworks.length >= 4) { reasons.push(results.frameworks.length + ' applicable frameworks — potential for conflicting guidance'); }
  if (results.drive.some(function(d) { return d.match === 'High'; })) { reasons.push('Prior related consultation exists — check for transferable guidance'); }

  var level = Math.min(score + 1, 3);
  var labels = { 1: 'Low', 2: 'Moderate', 3: 'High' };

  // Ensure at least 2 reasons
  if (reasons.length < 2) reasons.push('Review surfaced materials to calibrate');

  return { level: level, label: labels[level], reasons: reasons.slice(0, 4) };
}

/* ── Staggered Reveal ──────────────────────── */
function revealSection(sectionId, loadingId, contentId, delay) {
  setTimeout(function() {
    var section = document.getElementById(sectionId);
    section.classList.add('visible');

    setTimeout(function() {
      document.getElementById(loadingId).style.display = 'none';
      document.getElementById(contentId).style.display = '';
    }, delay > 0 ? 800 : 0);  // typing dots visible for 800ms
  }, delay);
}

/* ── Export ─────────────────────────────────── */
function downloadReport() {
  var data = loadRequest();
  if (!data) return;

  var allText = (data.situation || '') + ' ' + (data.whyNow || '') + ' ' + (data.otherPeople || '') + ' ' + (data.existingPolicies || '') + ' ' + (data.documents || '') + ' ' + (data.affectedNotInvolved || '');
  var topics = detectTopics(allText);
  var results = mergeResults(topics);

  var sheets = {};

  // Submission tab
  sheets['Submission'] = [
    ['Field', 'Value'],
    ['Reference', data.referenceNumber || ''],
    ['Submitted', data.submittedAt || ''],
    ['Requester', data.name],
    ['Email', data.email],
    ['Organization', data.organization],
    ['Situation', data.situation],
    ['Why Now', data.whyNow],
    ['Other People', data.otherPeople],
    ['Affected Not Involved', data.affectedNotInvolved],
    ['Engagement Type', data.engagementType],
    ['Documents', data.documents],
    ['Existing Policies', data.existingPolicies],
    ['Urgency', data.urgency],
    ['Decision Date', data.decisionDate]
  ];

  // Concepts tab
  var conceptRows = [['Concept', 'Note']];
  for (var i = 0; i < results.concepts.length; i++) {
    conceptRows.push([results.concepts[i].term, results.concepts[i].note]);
  }
  sheets['Concepts Flagged'] = conceptRows;

  // Frameworks tab
  var fwRows = [['Framework', 'Scope', 'Description', 'Relevance']];
  for (var i = 0; i < results.frameworks.length; i++) {
    var fw = results.frameworks[i];
    fwRows.push([fw.name, fw.scope, fw.desc, fw.relevance]);
  }
  sheets['Frameworks'] = fwRows;

  // Literature tab
  var litRows = [['Citation', 'Excerpt', 'Tag']];
  for (var i = 0; i < results.literature.length; i++) {
    var p = results.literature[i];
    litRows.push([p.cite, p.excerpt, p.tag]);
  }
  sheets['Literature'] = litRows;

  // Internal Documents tab
  var driveRows = [['Title', 'Type', 'Date', 'Description', 'Match']];
  for (var i = 0; i < results.drive.length; i++) {
    var d = results.drive[i];
    driveRows.push([d.title, d.type, d.date, d.desc, d.match]);
  }
  sheets['Internal Documents'] = driveRows;

  exportXLSX(sheets, 'Consultation_Review_' + (data.referenceNumber || 'report') + '.xlsx');
}

/* ── Page Init ─────────────────────────────── */
function initReview() {
  var data = loadRequest();

  if (!data || !data.situation) {
    document.getElementById('no-data').style.display = '';
    document.getElementById('main-content').style.display = 'none';
    return;
  }

  document.getElementById('main-content').style.display = '';
  document.getElementById('no-data').style.display = 'none';

  // Show reference number
  var refEl = document.getElementById('ref-number');
  if (data.referenceNumber) refEl.textContent = data.referenceNumber;

  // Render request summary immediately
  renderRequestSummary(data);

  // Detect topics from all text fields
  var allText = (data.situation || '') + ' ' + (data.whyNow || '') + ' ' + (data.otherPeople || '') + ' ' + (data.existingPolicies || '') + ' ' + (data.documents || '') + ' ' + (data.affectedNotInvolved || '');
  var topics = detectTopics(allText);
  var results = mergeResults(topics);

  // Staggered reveal: concepts → drive → frameworks → literature
  revealSection('scan-concepts', 'loading-concepts', 'content-concepts', 600);
  setTimeout(function() { renderConcepts(results.concepts); }, 1200);

  revealSection('scan-drive', 'loading-drive', 'content-drive', 2000);
  setTimeout(function() { renderDrive(results.drive); }, 2600);

  revealSection('scan-frameworks', 'loading-frameworks', 'content-frameworks', 3400);
  setTimeout(function() { renderFrameworks(results.frameworks); }, 4000);

  revealSection('scan-literature', 'loading-literature', 'content-literature', 4800);
  setTimeout(function() { renderLiterature(results.literature); }, 5400);

  // Show actions after all sections
  setTimeout(function() {
    document.getElementById('scan-actions').classList.add('visible');
  }, 6000);

  // Update status badge
  setTimeout(function() {
    var badge = document.getElementById('badge-status');
    badge.textContent = 'Complete';
    badge.className = 'badge badge-low';
  }, 5800);

  // Triage sidebar (appears alongside first scan section)
  setTimeout(function() {
    renderTriage(data, topics, results);
  }, 1500);
}

document.addEventListener('DOMContentLoaded', initReview);
