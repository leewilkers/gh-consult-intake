/* ═══════════════════════════════════════════════
   REQUEST FORM – Logic, validation, example data
   ═══════════════════════════════════════════════ */

var selectedEngagement = '';
var selectedUrgency = '';

/* ── Card Selectors ────────────────────────── */
function selectEngagement(el) {
  var cards = document.querySelectorAll('#engagement-cards .card');
  for (var i = 0; i < cards.length; i++) cards[i].classList.remove('selected');
  el.classList.add('selected');
  selectedEngagement = el.getAttribute('data-engagement');
}

function selectUrgency(el) {
  var cards = document.querySelectorAll('#urgency-cards .card');
  for (var i = 0; i < cards.length; i++) cards[i].classList.remove('selected');
  el.classList.add('selected');
  selectedUrgency = el.getAttribute('data-urgency');
}

/* ── Validation ────────────────────────────── */
function validate() {
  var situation = document.getElementById('req-situation').value.trim();
  var name = document.getElementById('req-name').value.trim();
  var email = document.getElementById('req-email').value.trim();

  var errors = [];
  if (!situation) errors.push('Please describe your situation.');
  if (!name) errors.push('Please enter your name.');
  if (!email) errors.push('Please enter your email.');
  if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.push('Please enter a valid email address.');

  return errors;
}

/* ── Submit ─────────────────────────────────── */
function submitRequest() {
  var errors = validate();
  var msgEl = document.getElementById('validation-msg');

  if (errors.length) {
    msgEl.textContent = '';
    for (var i = 0; i < errors.length; i++) {
      if (i > 0) msgEl.appendChild(document.createElement('br'));
      msgEl.appendChild(document.createTextNode(errors[i]));
    }
    msgEl.style.display = 'block';
    msgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  msgEl.style.display = 'none';

  var data = {
    situation:        document.getElementById('req-situation').value.trim(),
    whyNow:           document.getElementById('req-why-now').value.trim(),
    name:             document.getElementById('req-name').value.trim(),
    email:            document.getElementById('req-email').value.trim(),
    organization:     document.getElementById('req-org').value.trim(),
    otherPeople:      document.getElementById('req-people').value.trim(),
    affectedNotInvolved: document.getElementById('req-affected').value.trim(),
    engagementType:   selectedEngagement,
    documents:        document.getElementById('req-documents').value.trim(),
    existingPolicies: document.getElementById('req-policies').value.trim(),
    urgency:          selectedUrgency,
    decisionDate:     document.getElementById('req-deadline').value,
    submittedAt:      new Date().toISOString(),
    referenceNumber:  generateRefNumber()
  };

  saveRequest(data);
  window.location.href = 'review.html';
}

/* ── Example Data (Jane & John Doe) ────────── */
function loadExample() {
  document.getElementById('req-situation').value = 'We are a multi-country artisanal cheese research consortium (5 countries, 12+ planned publications) and need to develop a consortium-wide authorship policy. The core tension is between alphabetical ordering (the standard in our field) and contribution-based credit. Our Alpine-based co-PIs did most of the analytical work, but consortium norms prioritize LMIC first/last authorship. Country cheesemaking leads are peers and we have a very difficult time prioritizing one over another. The cave-aging modelers contributed significantly but their work spans all country papers. We need a policy framework before papers start getting written.';

  document.getElementById('req-why-now').value = 'Publication planning is starting for the first wave of papers. Several country teams are drafting manuscripts now. Without a policy, authorship disputes will be handled ad hoc, which risks damaging relationships across the consortium. Our funder (Wellcome Trust) has equity requirements we need to address.';

  document.getElementById('req-name').value = 'Jane Doe, Co-PI, Cheese Consortium Project';
  document.getElementById('req-email').value = 'j.doe@globalcheesealliance.org';
  document.getElementById('req-org').value = 'Global Artisanal Cheese Alliance';
  document.getElementById('req-people').value = 'John Doe (Co-PI, lead cave-aging modeler), 5 country cheesemaking leads, ~12 named co-investigators, Dr. A. Whitfield (ethics advisor), country milk collection teams, Wellcome Trust program officer';
  document.getElementById('req-affected').value = 'Junior researchers and milk collectors across 5 country teams who contributed significantly but may not meet traditional authorship criteria. Community dairy workers involved in data collection. Future consortium members who will inherit whatever policy we set.';

  // Select Full Consultation
  var fullCard = document.querySelector('[data-engagement="full"]');
  if (fullCard) selectEngagement(fullCard);

  document.getElementById('req-documents').value = 'Internal consortium MOU (has authorship clause), BRIDGE Consortium authorship policy (comparator we found), draft publication plan listing all 12 papers with tentative author lists';
  document.getElementById('req-policies').value = 'ICMJE authorship criteria, CRediT contributor taxonomy, Wellcome Trust open access and equity requirements, Parker et al. (2022) fair partnerships framework';

  // Select Standard urgency
  var stdCard = document.querySelector('[data-urgency="standard"]');
  if (stdCard) selectUrgency(stdCard);

  document.getElementById('req-deadline').value = '2026-04-15';

  // Toggle buttons
  document.getElementById('btn-example').style.display = 'none';
  document.getElementById('btn-clear').style.display = '';
}

function clearForm() {
  var inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="date"], textarea');
  for (var i = 0; i < inputs.length; i++) inputs[i].value = '';

  var cards = document.querySelectorAll('.card.selectable');
  for (var i = 0; i < cards.length; i++) cards[i].classList.remove('selected');
  selectedEngagement = '';
  selectedUrgency = '';

  document.getElementById('btn-example').style.display = '';
  document.getElementById('btn-clear').style.display = 'none';
  document.getElementById('validation-msg').style.display = 'none';
}

/* ── Restore from localStorage ─────────────── */
function restoreForm() {
  var data = loadRequest();
  if (!data) return;

  document.getElementById('req-situation').value = data.situation || '';
  document.getElementById('req-why-now').value = data.whyNow || '';
  document.getElementById('req-name').value = data.name || '';
  document.getElementById('req-email').value = data.email || '';
  document.getElementById('req-org').value = data.organization || '';
  document.getElementById('req-people').value = data.otherPeople || '';
  document.getElementById('req-affected').value = data.affectedNotInvolved || '';
  document.getElementById('req-documents').value = data.documents || '';
  document.getElementById('req-policies').value = data.existingPolicies || '';
  document.getElementById('req-deadline').value = data.decisionDate || '';

  if (data.engagementType) {
    var eCard = document.querySelector('[data-engagement="' + data.engagementType + '"]');
    if (eCard) selectEngagement(eCard);
  }
  if (data.urgency) {
    var uCard = document.querySelector('[data-urgency="' + data.urgency + '"]');
    if (uCard) selectUrgency(uCard);
  }

  // If data exists, show clear button
  if (data.situation) {
    document.getElementById('btn-example').style.display = 'none';
    document.getElementById('btn-clear').style.display = '';
  }
}

/* ── Init ──────────────────────────────────── */
document.getElementById('btn-example').addEventListener('click', loadExample);
document.getElementById('btn-clear').addEventListener('click', clearForm);

// Handle URL params: ?example=true or ?type=quick|full|meeting|review
var params = new URLSearchParams(window.location.search);
if (params.get('example') === 'true') {
  loadExample();
} else {
  restoreForm();
  // Pre-select engagement type from triage landing page
  var typeParam = params.get('type');
  if (typeParam) {
    var typeCard = document.querySelector('[data-engagement="' + typeParam + '"]');
    if (typeCard) selectEngagement(typeCard);
  }
}
