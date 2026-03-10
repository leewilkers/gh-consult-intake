/* ═══════════════════════════════════════════════
   REQUEST FORM – Logic, validation, example data
   ═══════════════════════════════════════════════ */

var selectedEngagement = '';
var selectedUrgency = '';

/* ── Card Selectors ────────────────────────── */
function setPressedState(selector, el) {
  var cards = document.querySelectorAll(selector);
  for (var i = 0; i < cards.length; i++) {
    cards[i].classList.remove('selected');
    cards[i].setAttribute('aria-pressed', 'false');
  }
  el.classList.add('selected');
  el.setAttribute('aria-pressed', 'true');
}

function selectEngagement(el) {
  setPressedState('#engagement-cards .card', el);
  selectedEngagement = el.getAttribute('data-engagement');
}

function selectUrgency(el) {
  setPressedState('#urgency-cards .card', el);
  selectedUrgency = el.getAttribute('data-urgency');
}

function selectFromKeyboard(event, el, selectFn) {
  var key = event.key || event.code;
  if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
    event.preventDefault();
    selectFn(el);
  }
}

function handleEngagementKey(event, el) {
  selectFromKeyboard(event, el, selectEngagement);
}

function handleUrgencyKey(event, el) {
  selectFromKeyboard(event, el, selectUrgency);
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

  if (!saveRequest(data)) {
    msgEl.textContent = 'Unable to save your request in this browser session. Please check storage/privacy settings and try again.';
    msgEl.style.display = 'block';
    msgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  window.location.href = 'review.html';
}

/* ── Example Data (Jane & John Doe) ────────── */
function loadExample() {
  var data = getExampleRequestData();
  document.getElementById('req-situation').value = data.situation;
  document.getElementById('req-why-now').value = data.whyNow;
  document.getElementById('req-name').value = data.name;
  document.getElementById('req-email').value = data.email;
  document.getElementById('req-org').value = data.organization;
  document.getElementById('req-people').value = data.otherPeople;
  document.getElementById('req-affected').value = data.affectedNotInvolved;

  // Select Full Consultation
  var fullCard = document.querySelector('[data-engagement="full"]');
  if (fullCard) selectEngagement(fullCard);

  document.getElementById('req-documents').value = data.documents;
  document.getElementById('req-policies').value = data.existingPolicies;

  // Select Standard urgency
  var stdCard = document.querySelector('[data-urgency="standard"]');
  if (stdCard) selectUrgency(stdCard);

  document.getElementById('req-deadline').value = data.decisionDate;

  // Toggle buttons
  document.getElementById('btn-example').style.display = 'none';
  document.getElementById('btn-clear').style.display = '';
}

function clearForm() {
  var inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="date"], textarea');
  for (var i = 0; i < inputs.length; i++) inputs[i].value = '';

  var cards = document.querySelectorAll('.card.selectable');
  for (var i = 0; i < cards.length; i++) {
    cards[i].classList.remove('selected');
    cards[i].setAttribute('aria-pressed', 'false');
  }
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
