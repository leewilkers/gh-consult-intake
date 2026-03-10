/* ═══════════════════════════════════════════════
   CONSULTANT INTAKE – Wizard logic + pre-population
   Adapted from ETHICS_CONSULTATION_INTAKE.html
   Reads client request from localStorage to seed fields.
   ═══════════════════════════════════════════════ */

/* ── State ─────────────────────────────────── */
var STEPS = [
  "What's Being Asked?",
  'Diagnostic Scan',
  'Stakeholder Map',
  'Scope & Timeline',
  'Prior Context',
  'Engagement Type',
  'Assessment Summary'
];
var currentStep = 1;
var visited = new Set([1]);
var selectedUrgency = '';
var selectedEngagement = '';
var wasPreFilled = false;

/* ── Stepper ───────────────────────────────── */
function renderStepper() {
  var wrap = document.getElementById('stepper');
  wrap.textContent = '';
  for (var i = 0; i < STEPS.length; i++) {
    var stepNum = i + 1;
    var ind = E('div', 'step-indicator');
    if (visited.has(stepNum)) ind.classList.add('visited');
    if (stepNum === currentStep) ind.classList.add('active');

    ind.appendChild(E('div', 'step-num', String(stepNum)));
    ind.appendChild(E('span', 'step-label', STEPS[i]));

    if (visited.has(stepNum)) {
      ind.setAttribute('role', 'button');
      ind.setAttribute('tabindex', '0');
      (function(s) {
        ind.addEventListener('click', function() { goToStep(s); });
        ind.addEventListener('keydown', function(event) {
          var key = event.key || event.code;
          if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
            event.preventDefault();
            goToStep(s);
          }
        });
      })(stepNum);
    }
    wrap.appendChild(ind);
    if (i < STEPS.length - 1) wrap.appendChild(E('div', 'step-connector'));
  }
}

/* ── Navigation ────────────────────────────── */
function goToStep(n) {
  if (n < 1 || n > 7) return;
  currentStep = n;
  visited.add(n);

  var panels = document.querySelectorAll('.step-panel');
  for (var i = 0; i < panels.length; i++) {
    panels[i].classList.remove('active');
    if (parseInt(panels[i].getAttribute('data-step')) === n) {
      panels[i].classList.add('active');
    }
  }

  document.getElementById('btn-prev').disabled = (n === 1);
  var nextBtn = document.getElementById('btn-next');
  if (n === 7) {
    nextBtn.style.display = 'none';
    generateSummary();
  } else {
    nextBtn.style.display = '';
    nextBtn.textContent = (n === 6) ? 'Generate Summary' : 'Continue';
  }

  renderStepper();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep() { goToStep(currentStep + 1); }
function prevStep() { goToStep(currentStep - 1); }

/* ── Selectors ─────────────────────────────── */
function setPressedState(selector, el) {
  var options = document.querySelectorAll(selector);
  for (var i = 0; i < options.length; i++) {
    options[i].classList.remove('selected');
    options[i].setAttribute('aria-pressed', 'false');
  }
  el.classList.add('selected');
  el.setAttribute('aria-pressed', 'true');
}

function selectUrgency(el) {
  setPressedState('.urgency-option', el);
  selectedUrgency = el.getAttribute('data-urgency');
}

function selectEngagement(el) {
  setPressedState('#engagement-cards .card-i', el);
  selectedEngagement = el.getAttribute('data-engagement');
}

function selectFromKeyboard(event, el, selectFn) {
  var key = event.key || event.code;
  if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
    event.preventDefault();
    selectFn(el);
  }
}

function handleUrgencyKey(event, el) {
  selectFromKeyboard(event, el, selectUrgency);
}

function handleEngagementKey(event, el) {
  selectFromKeyboard(event, el, selectEngagement);
}

/* ── Dynamic Rows ──────────────────────────── */
function addPrimaryStakeholder() {
  var container = document.getElementById('primary-stakeholders');
  var entry = E('div', 'stakeholder-entry');
  var g1 = E('div', 'field-group');
  g1.appendChild(E('label', '', 'Name / Group'));
  var i1 = document.createElement('input'); i1.type = 'text'; i1.className = 'sh-primary-name'; i1.placeholder = 'Who?';
  g1.appendChild(i1);
  var g2 = E('div', 'field-group');
  g2.appendChild(E('label', '', 'Interest / Stake'));
  var i2 = document.createElement('input'); i2.type = 'text'; i2.className = 'sh-primary-interest'; i2.placeholder = 'What do they care about?';
  g2.appendChild(i2);
  entry.appendChild(g1); entry.appendChild(g2);
  container.appendChild(entry);
}

function addDocument() {
  var container = document.getElementById('key-documents');
  var row = E('div', 'field-row');
  row.style.marginBottom = '0.75rem';
  var g1 = E('div', 'field-group');
  g1.appendChild(E('label', '', 'Document'));
  var i1 = document.createElement('input'); i1.type = 'text'; i1.className = 'doc-name'; i1.placeholder = 'Document name';
  g1.appendChild(i1);
  var g2 = E('div', 'field-group');
  g2.appendChild(E('label', '', 'Location / Status'));
  var i2 = document.createElement('input'); i2.type = 'text'; i2.className = 'doc-location'; i2.placeholder = 'Where to find it';
  g2.appendChild(i2);
  row.appendChild(g1); row.appendChild(g2);
  container.appendChild(row);
}

function addExpert() {
  var container = document.getElementById('expert-resources');
  var row = E('div', 'field-row');
  row.style.marginBottom = '0.75rem';
  var g1 = E('div', 'field-group');
  g1.appendChild(E('label', '', 'Expert'));
  var i1 = document.createElement('input'); i1.type = 'text'; i1.className = 'expert-name'; i1.placeholder = 'Name, domain';
  g1.appendChild(i1);
  var g2 = E('div', 'field-group');
  g2.appendChild(E('label', '', 'Status'));
  var i2 = document.createElement('input'); i2.type = 'text'; i2.className = 'expert-status'; i2.placeholder = 'Consulted? Available?';
  g2.appendChild(i2);
  row.appendChild(g1); row.appendChild(g2);
  container.appendChild(row);
}

/* ── Summary Generation ────────────────────── */
function generateSummary() {
  var c = document.getElementById('summary-container');
  c.textContent = '';

  function block(title) {
    var b = E('div', 'summary-block-i');
    b.appendChild(E('h3', '', title));
    return b;
  }
  function row(label, value) {
    var r = E('div', 'summary-row-i');
    r.appendChild(E('div', 'summary-label-i', label));
    r.appendChild(E('div', 'summary-value-i', value || '\u2014'));
    return r;
  }
  function multilineRow(label, value) {
    if (!value) return row(label, '\u2014');
    var r = E('div', '');
    r.appendChild(E('div', 'summary-label-i', label));
    var note = E('div', 'summary-note-i', value);
    note.style.marginLeft = '0';
    r.appendChild(note);
    return r;
  }
  function checkDot(label, on) {
    var d = E('div', '');
    d.style.display = 'flex';
    d.style.alignItems = 'center';
    d.style.gap = '0.4rem';
    d.style.fontSize = '0.85rem';
    d.style.padding = '0.15rem 0';
    var dot = E('div', '');
    dot.style.width = '8px';
    dot.style.height = '8px';
    dot.style.borderRadius = '50%';
    dot.style.background = on ? 'var(--gold)' : 'var(--stone-200)';
    dot.style.flexShrink = '0';
    d.appendChild(dot);
    d.appendChild(E('span', '', label));
    return d;
  }

  // Block 1: Request
  var b1 = block('1. Request');
  b1.appendChild(multilineRow('Stated Request', v('stated-request')));
  b1.appendChild(multilineRow('Why Now', v('why-now')));
  b1.appendChild(row('Primary Contact', v('primary-name')));
  b1.appendChild(row('Email', v('primary-email')));
  b1.appendChild(row('Decision-Maker', v('decision-maker')));
  b1.appendChild(row('Other Stakeholders', v('other-stakeholders')));
  b1.appendChild(row('Case ID', v('case-id')));
  if (wasPreFilled) b1.appendChild(row('Source', 'Pre-populated from client request'));
  c.appendChild(b1);

  // Block 2: Diagnostic
  var b2 = block('2. Diagnostic Scan');
  var diagItems = [
    { id: 'diag-meta', label: 'Unclear Terms', notes: 'diag-meta-notes' },
    { id: 'diag-complexity', label: 'Competing Values', notes: 'diag-complexity-notes' },
    { id: 'diag-definition', label: 'What Counts?', notes: 'diag-definition-notes' },
    { id: 'diag-downselect', label: 'Options to Weigh', notes: 'diag-downselect-notes' },
    { id: 'diag-perspective', label: 'Different Viewpoints', notes: 'diag-perspective-notes' },
    { id: 'diag-learning', label: 'Open Questions', notes: 'diag-learning-notes' }
  ];
  for (var i = 0; i < diagItems.length; i++) {
    var d = diagItems[i];
    var checked = document.getElementById(d.id).checked;
    b2.appendChild(checkDot(d.label, checked));
    if (checked && v(d.notes)) {
      var note = E('div', 'summary-note-i');
      note.style.marginLeft = '1.5rem';
      note.style.marginBottom = '0.3rem';
      note.textContent = v(d.notes);
      b2.appendChild(note);
    }
  }
  c.appendChild(b2);

  // Block 3: Stakeholders
  var b3 = block('3. Stakeholders');
  var pNames = document.querySelectorAll('.sh-primary-name');
  var pInts = document.querySelectorAll('.sh-primary-interest');
  var anyP = false;
  for (var i = 0; i < pNames.length; i++) {
    if (pNames[i].value.trim()) {
      if (!anyP) { b3.appendChild(E('div', 'summary-label-i', 'Primary')); anyP = true; }
      b3.appendChild(row(pNames[i].value.trim(), pInts[i] ? pInts[i].value.trim() : ''));
    }
  }
  var sNames = document.querySelectorAll('.sh-secondary-name');
  var sInts = document.querySelectorAll('.sh-secondary-interest');
  var anyS = false;
  for (var i = 0; i < sNames.length; i++) {
    if (sNames[i].value.trim()) {
      if (!anyS) { b3.appendChild(E('div', 'summary-label-i', 'Secondary')); anyS = true; }
      b3.appendChild(row(sNames[i].value.trim(), sInts[i] ? sInts[i].value.trim() : ''));
    }
  }
  var mvItems = [
    { id: 'mv-lmic', label: 'LMIC researchers/partners' },
    { id: 'mv-community', label: 'Community members' },
    { id: 'mv-junior', label: 'Junior researchers' },
    { id: 'mv-funders', label: 'Funders/leadership' }
  ];
  var anyMV = false;
  for (var i = 0; i < mvItems.length; i++) {
    if (document.getElementById(mvItems[i].id).checked) {
      if (!anyMV) { b3.appendChild(E('div', 'summary-label-i', 'Missing Voices')); anyMV = true; }
      b3.appendChild(checkDot(mvItems[i].label, true));
    }
  }
  if (v('mv-notes')) {
    var mvn = E('div', 'summary-note-i');
    mvn.style.marginLeft = '1.5rem';
    mvn.textContent = v('mv-notes');
    b3.appendChild(mvn);
  }
  c.appendChild(b3);

  // Block 4: Scope & Timeline
  var b4 = block('4. Scope & Timeline');
  b4.appendChild(multilineRow('In Scope', v('in-scope')));
  b4.appendChild(multilineRow('Out of Scope', v('out-scope')));
  var dates = [
    { id: 'ms-consult', label: 'Initial Consultation' },
    { id: 'ms-draft', label: 'Draft Due' },
    { id: 'ms-final', label: 'Final Delivery' },
    { id: 'ms-deadline', label: 'Decision Deadline' }
  ];
  for (var k = 0; k < dates.length; k++) {
    var dv = v(dates[k].id);
    if (dv) b4.appendChild(row(dates[k].label, dv));
  }
  var urgencyLabels = { urgent: 'Urgent (within 1 week)', standard: 'Standard (2\u20134 weeks)', flexible: 'Flexible (no hard deadline)' };
  b4.appendChild(row('Urgency', urgencyLabels[selectedUrgency] || '\u2014'));
  c.appendChild(b4);

  // Block 5: Prior Context
  var b5 = block('5. Prior Context');
  var pcItems = [
    { id: 'pc-prior', label: 'Prior consultations', notes: 'pc-prior-notes' },
    { id: 'pc-policies', label: 'Existing policies/guidance', notes: 'pc-policies-notes' },
    { id: 'pc-precedents', label: 'Precedents', notes: 'pc-precedents-notes' }
  ];
  for (var k = 0; k < pcItems.length; k++) {
    var pc = pcItems[k];
    if (document.getElementById(pc.id).checked) {
      b5.appendChild(checkDot(pc.label, true));
      var pcn = v(pc.notes);
      if (pcn) {
        var pn = E('div', 'summary-note-i');
        pn.style.marginLeft = '1.5rem';
        pn.style.marginBottom = '0.3rem';
        pn.textContent = pcn;
        b5.appendChild(pn);
      }
    }
  }
  var docNames = document.querySelectorAll('.doc-name');
  var docLocs = document.querySelectorAll('.doc-location');
  var anyDocs = false;
  for (var k = 0; k < docNames.length; k++) {
    if (docNames[k].value.trim()) {
      if (!anyDocs) { b5.appendChild(E('div', 'summary-label-i', 'Documents')); anyDocs = true; }
      b5.appendChild(row(docNames[k].value.trim(), docLocs[k] ? docLocs[k].value.trim() : ''));
    }
  }
  var expNames = document.querySelectorAll('.expert-name');
  var expStats = document.querySelectorAll('.expert-status');
  var anyExp = false;
  for (var k = 0; k < expNames.length; k++) {
    if (expNames[k].value.trim()) {
      if (!anyExp) { b5.appendChild(E('div', 'summary-label-i', 'Experts')); anyExp = true; }
      b5.appendChild(row(expNames[k].value.trim(), expStats[k] ? expStats[k].value.trim() : ''));
    }
  }
  c.appendChild(b5);

  // Block 6: Engagement
  var b6 = block('6. Engagement Type');
  var engLabels = { full: 'Full Consult', quick: 'Quick Guidance', meeting: 'Meeting Facilitation', review: 'Document Review' };
  b6.appendChild(row('Type', engLabels[selectedEngagement] || '\u2014'));
  b6.appendChild(multilineRow('Rationale', v('engagement-rationale')));
  var delItems = [
    { id: 'del-memo', label: 'Guidance memo' },
    { id: 'del-brief', label: 'Synthesis brief' },
    { id: 'del-policy', label: 'Policy skeleton' },
    { id: 'del-meeting', label: 'Meeting facilitation' }
  ];
  var anyDel = false;
  for (var k = 0; k < delItems.length; k++) {
    if (document.getElementById(delItems[k].id).checked) {
      if (!anyDel) { b6.appendChild(E('div', 'summary-label-i', 'Deliverables')); anyDel = true; }
      b6.appendChild(checkDot(delItems[k].label, true));
    }
  }
  if (document.getElementById('del-other').checked && v('del-other-text')) {
    if (!anyDel) b6.appendChild(E('div', 'summary-label-i', 'Deliverables'));
    b6.appendChild(checkDot(v('del-other-text'), true));
  }
  c.appendChild(b6);

  // Block 7: Assessment
  var b7 = block('7. Initial Assessment');
  var problemTypes = [];
  if (document.getElementById('diag-complexity').checked) problemTypes.push('Complexity');
  if (document.getElementById('diag-downselect').checked) problemTypes.push('Options to Weigh');
  if (document.getElementById('diag-meta').checked) problemTypes.push('Unclear Terms');
  if (document.getElementById('diag-definition').checked) problemTypes.push('Definition');
  if (document.getElementById('diag-perspective').checked) problemTypes.push('Multiple-Perspective');
  if (document.getElementById('diag-learning').checked) problemTypes.push('Learning');
  b7.appendChild(row('Primary Problem Type', problemTypes[0] || '\u2014'));
  if (problemTypes.length > 1) b7.appendChild(row('Secondary', problemTypes.slice(1).join(', ')));
  b7.appendChild(multilineRow('Stated Question', v('stated-request')));
  var underlyingParts = [];
  if (v('diag-complexity-notes')) underlyingParts.push(v('diag-complexity-notes'));
  if (v('diag-meta-notes')) underlyingParts.push(v('diag-meta-notes'));
  if (underlyingParts.length) b7.appendChild(multilineRow('Underlying Tensions', underlyingParts.join('\n')));
  var flags = [];
  if (v('diag-learning-notes')) flags.push(v('diag-learning-notes'));
  if (v('mv-notes')) flags.push('Missing voices: ' + v('mv-notes'));
  if (flags.length) b7.appendChild(multilineRow('Red Flags / Unknowns', flags.join('\n')));
  c.appendChild(b7);
}

function v(id) {
  var el = document.getElementById(id);
  if (!el) return '';
  return (el.value || '').trim();
}

/* ── Pre-Fill from Client Request ──────────── */
function prePopulate() {
  var data = loadRequest();
  if (!data || !data.situation) return;

  wasPreFilled = true;

  // Step 1: What's Being Asked
  setVal('stated-request', data.situation);
  setVal('why-now', data.whyNow);
  setVal('primary-name', data.name);
  setVal('primary-email', data.email);
  setVal('other-stakeholders', data.otherPeople);

  // Auto-generate case ID from date + org
  if (data.organization) {
    var now = new Date();
    var caseId = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '_' + data.organization.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
    setVal('case-id', caseId);
  }

  // Step 3: Stakeholder seeds
  var pNames = document.querySelectorAll('.sh-primary-name');
  var pInts = document.querySelectorAll('.sh-primary-interest');
  if (pNames[0] && data.name) pNames[0].value = data.name;

  // Missing voices from affected-not-involved
  if (data.affectedNotInvolved) {
    setVal('mv-notes', data.affectedNotInvolved);
  }

  // Step 4: Urgency
  if (data.urgency) {
    var urgOption = document.querySelector('[data-urgency="' + data.urgency + '"]');
    if (urgOption) selectUrgency(urgOption);
  }
  if (data.decisionDate) setVal('ms-deadline', data.decisionDate);

  // Step 5: Prior Context
  if (data.existingPolicies) {
    document.getElementById('pc-policies').checked = true;
    setVal('pc-policies-notes', data.existingPolicies);
  }
  if (data.documents) {
    var docNames = document.querySelectorAll('.doc-name');
    if (docNames[0]) docNames[0].value = data.documents;
  }

  // Step 6: Engagement type
  if (data.engagementType) {
    var engCard = document.querySelector('[data-engagement="' + data.engagementType + '"]');
    if (engCard) selectEngagement(engCard);
  }

  // Step 2: Diagnostic scan — pre-fill for demo flow
  // Detect enough signal to populate (authorship + consortium keywords)
  var allText = ((data.situation || '') + ' ' + (data.whyNow || '')).toLowerCase();
  if (allText.indexOf('authorship') !== -1 || allText.indexOf('consortium') !== -1) {
    setChecked('diag-meta', true);
    setVal('diag-meta-notes', '"Best practice" = alphabetical order, but requester questions whether this applies given differential contributions.');
    setChecked('diag-complexity', true);
    setVal('diag-complexity-notes', 'HIC leads vs. LMIC norms; differential contribution vs. alphabetical ordering; peer country PIs; country data vs. synthesis credit.');
    setChecked('diag-definition', true);
    setVal('diag-definition-notes', 'What counts as "substantial contribution" for multi-country papers?');
    setChecked('diag-downselect', true);
    setVal('diag-downselect-notes', 'Alphabetical (standard), contribution-based ordering, joint first/senior authorship, portfolio approach (rotate leads), working group authorship.');
    setChecked('diag-perspective', true);
    setVal('diag-perspective-notes', 'Alpine co-PIs, country cheesemaking leads, cave-aging modelers, country milk collection teams, funder, alliance leadership.');
    setChecked('diag-learning', true);
    setVal('diag-learning-notes', 'What did country teams contribute beyond data collection? What are funder expectations on LMIC authorship? How did comparable consortia handle this?');
  }

  // Show pre-fill badges
  showPrefillBadge('prefill-1', 'Pre-filled from client request');
  showPrefillBadge('prefill-3', 'Stakeholders seeded from client request');
  showPrefillBadge('prefill-5', 'Prior context seeded from client request');
}

function showPrefillBadge(containerId, text) {
  var container = document.getElementById(containerId);
  if (!container) return;
  var badge = E('div', 'prefill-badge');
  badge.textContent = '\u2713 ' + text;
  container.appendChild(badge);
}

/* ── Example Data ──────────────────────────── */
function loadExample() {
  // Step 1
  setVal('stated-request', '"There are a lot of things to balance and consider. We are planning to develop a consortium authorship policy and the \'best practice\' we have seen so far is listing names in alphabetical order despite levels of involvement in the work itself."');
  setVal('why-now', 'Publication planning starting for 12+ papers across 5 countries. Need authorship policy before papers get written.');
  setVal('primary-name', 'Jane Doe, Co-PI');
  setVal('primary-email', 'j.doe@globalcheesealliance.org');
  setVal('decision-maker', 'Jane Doe + John Doe');
  setVal('other-stakeholders', '5 country cheesemaking leads, cave-aging modelers, data teams, Dr. A. Whitfield (ethics advisor)');
  setVal('case-id', '2026-03_Cheese_Consortium_Authorship');

  // Step 2
  setChecked('diag-meta', true);
  setVal('diag-meta-notes', '"Best practice" = alphabetical order, but Jane questions whether this applies given differential contributions.');
  setChecked('diag-complexity', true);
  setVal('diag-complexity-notes', '1. HIC leads vs. LMIC norms\n2. Differential contribution vs. alphabetical ordering\n3. Peer country PIs\n4. Country data vs. synthesis credit');
  setChecked('diag-definition', true);
  setVal('diag-definition-notes', 'What counts as "substantial contribution" for multi-country papers?');
  setChecked('diag-downselect', true);
  setVal('diag-downselect-notes', '1. Alphabetical (standard)\n2. Contribution-based ordering\n3. Joint first/senior authorship\n4. Portfolio approach (rotate leads)\n5. Working group authorship');
  setChecked('diag-perspective', true);
  setVal('diag-perspective-notes', 'Alpine co-PIs, 5 country cheesemaking leads, cave-aging modelers, country milk collection teams, Wellcome Trust, Global Artisanal Cheese Alliance leadership');
  setChecked('diag-learning', true);
  setVal('diag-learning-notes', '1. What did country teams contribute beyond data collection?\n2. What are Wellcome Trust expectations on LMIC authorship?\n3. How did BRIDGE Consortium handle their supplement?');

  // Step 3
  var pN = document.querySelectorAll('.sh-primary-name');
  var pI = document.querySelectorAll('.sh-primary-interest');
  if (pN[0]) pN[0].value = 'Jane Doe, Co-PI';
  if (pI[0]) pI[0].value = 'Fair credit, LMIC equity, conflict avoidance';
  if (pN[1]) pN[1].value = 'John Doe, Co-PI & Lead Modeler';
  if (pI[1]) pI[1].value = 'Recognition for analytical work';
  var sN = document.querySelectorAll('.sh-secondary-name');
  var sI = document.querySelectorAll('.sh-secondary-interest');
  if (sN[0]) sN[0].value = '5 Country PIs';
  if (sI[0]) sI[0].value = 'Career advancement, peer recognition';
  if (sN[1]) sN[1].value = 'Country data teams';
  if (sI[1]) sI[1].value = 'Visibility, acknowledgment';
  setChecked('mv-lmic', true);
  setChecked('mv-junior', true);
  setChecked('mv-funders', true);
  setVal('mv-notes', 'Modelers and country data teams not directly consulted. Funder expectations on LMIC authorship unclear.');

  // Step 4
  setVal('in-scope', 'Authorship policy framework for multi-country papers\nOptions for byline format and ordering\nProcess for author confirmation per paper');
  setVal('out-scope', 'Country-led paper authorship (countries decide themselves)\nIndividual paper author lists (policy first, lists later)');
  var stdOption = document.querySelector('[data-urgency="standard"]');
  if (stdOption) selectUrgency(stdOption);
  setVal('ms-deadline', '2026-04-15');

  // Step 5
  setChecked('pc-policies', true);
  setVal('pc-policies-notes', 'ICMJE guidelines, CRediT taxonomy, Wellcome Trust equity requirements');
  setChecked('pc-precedents', true);
  setVal('pc-precedents-notes', 'BRIDGE Consortium 15-article supplement');
  var docN = document.querySelectorAll('.doc-name');
  var docL = document.querySelectorAll('.doc-location');
  if (docN[0]) docN[0].value = 'Consortium MOU (authorship clause)';
  if (docL[0]) docL[0].value = 'Shared drive';
  if (docN[1]) docN[1].value = 'BRIDGE authorship policy';
  if (docL[1]) docL[1].value = 'Reference file';
  var expN = document.querySelectorAll('.expert-name');
  var expS = document.querySelectorAll('.expert-status');
  if (expN[0]) expN[0].value = 'Dr. A. Whitfield, Ethics & partnerships';
  if (expS[0]) expS[0].value = 'Consulted';

  // Step 6
  var fullCard = document.querySelector('[data-engagement="full"]');
  if (fullCard) selectEngagement(fullCard);
  setVal('engagement-rationale', 'Complex multi-stakeholder question with genuine tensions. Multiple competing norms and 12+ publications at stake.');
  setChecked('del-memo', true);
  setChecked('del-brief', true);
  setChecked('del-policy', true);

  // Toggle buttons
  document.getElementById('btn-example').style.display = 'none';
  document.getElementById('btn-clear').style.display = '';
}

function clearForm() {
  var inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="date"], textarea');
  for (var i = 0; i < inputs.length; i++) inputs[i].value = '';
  var checks = document.querySelectorAll('input[type="checkbox"]');
  for (var i = 0; i < checks.length; i++) checks[i].checked = false;
  var urgOpts = document.querySelectorAll('.urgency-option');
  for (var i = 0; i < urgOpts.length; i++) {
    urgOpts[i].classList.remove('selected');
    urgOpts[i].setAttribute('aria-pressed', 'false');
  }
  selectedUrgency = '';
  var engCards = document.querySelectorAll('#engagement-cards .card-i');
  for (var i = 0; i < engCards.length; i++) {
    engCards[i].classList.remove('selected');
    engCards[i].setAttribute('aria-pressed', 'false');
  }
  selectedEngagement = '';
  wasPreFilled = false;

  // Remove prefill badges
  var badges = document.querySelectorAll('.prefill-badge');
  for (var i = 0; i < badges.length; i++) badges[i].remove();

  document.getElementById('btn-example').style.display = '';
  document.getElementById('btn-clear').style.display = 'none';
}

function setVal(id, val) {
  var el = document.getElementById(id);
  if (el) el.value = val || '';
}
function setChecked(id, val) {
  var el = document.getElementById(id);
  if (el) el.checked = val;
}

/* ── Init ──────────────────────────────────── */
document.getElementById('btn-example').addEventListener('click', loadExample);
document.getElementById('btn-clear').addEventListener('click', clearForm);

// Try pre-population from client request first
prePopulate();

// If pre-populated, hide example button
if (wasPreFilled) {
  document.getElementById('btn-example').style.display = 'none';
  document.getElementById('btn-clear').style.display = '';
}

goToStep(1);
