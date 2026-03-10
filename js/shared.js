/* ═══════════════════════════════════════════════
   SHARED UTILITIES – Ethics Consultation Portal
   ═══════════════════════════════════════════════ */

/* ── DOM Helper ────────────────────────────── */
function E(tag, cls, text) {
  var el = document.createElement(tag);
  if (cls) el.className = cls;
  if (text != null) el.textContent = text;
  return el;
}

/* ── LocalStorage Bridge ───────────────────── */
var STORAGE_KEY = 'consultation_request';

function saveRequest(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Failed to save request:', e);
    return false;
  }
}

function loadRequest() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to load request:', e);
    return null;
  }
}

function clearRequest() {
  localStorage.removeItem(STORAGE_KEY);
}

function getExampleRequestData() {
  return {
    situation: 'We are a multi-country artisanal cheese research consortium (5 countries, 12+ planned publications) and need to develop a consortium-wide authorship policy. The core tension is between alphabetical ordering (the standard in our field) and contribution-based credit. Our Alpine-based co-PIs did most of the analytical work, but consortium norms prioritize LMIC first/last authorship. Country cheesemaking leads are peers and we have a very difficult time prioritizing one over another. The cave-aging modelers contributed significantly but their work spans all country papers. We need a policy framework before papers start getting written.',
    whyNow: 'Publication planning is starting for the first wave of papers. Several country teams are drafting manuscripts now. Without a policy, authorship disputes will be handled ad hoc, which risks damaging relationships across the consortium. Our funder (Wellcome Trust) has equity requirements we need to address.',
    name: 'Jane Doe, Co-PI, Cheese Consortium Project',
    email: 'j.doe@globalcheesealliance.org',
    organization: 'Global Artisanal Cheese Alliance',
    otherPeople: 'John Doe (Co-PI, lead cave-aging modeler), 5 country cheesemaking leads, ~12 named co-investigators, Dr. A. Whitfield (ethics advisor), country milk collection teams, Wellcome Trust program officer',
    affectedNotInvolved: 'Junior researchers and milk collectors across 5 country teams who contributed significantly but may not meet traditional authorship criteria. Community dairy workers involved in data collection. Future consortium members who will inherit whatever policy we set.',
    engagementType: 'full',
    documents: 'Internal consortium MOU (has authorship clause), BRIDGE Consortium authorship policy (comparator we found), draft publication plan listing all 12 papers with tentative author lists',
    existingPolicies: 'ICMJE authorship criteria, CRediT contributor taxonomy, Wellcome Trust open access and equity requirements, Parker et al. (2022) fair partnerships framework',
    urgency: 'standard',
    decisionDate: '2026-04-15',
    submittedAt: new Date().toISOString(),
    referenceNumber: generateRefNumber()
  };
}

/* ── Nav Active State ──────────────────────── */
function initNav() {
  var path = window.location.pathname;
  var page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  var links = document.querySelectorAll('.nav-links a');
  for (var i = 0; i < links.length; i++) {
    var href = links[i].getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      links[i].classList.add('active');
    } else {
      links[i].classList.remove('active');
    }
  }
}

/* ── Export Utilities ──────────────────────── */

// CSV export – fields as rows (Field, Value)
function exportCSV(data, filename) {
  var rows = [['Field', 'Value']];
  flattenForExport(data, rows, '');
  var csv = rows.map(function(r) {
    return r.map(function(cell) {
      var s = String(cell || '');
      if (s.indexOf(',') !== -1 || s.indexOf('"') !== -1 || s.indexOf('\n') !== -1) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    }).join(',');
  }).join('\n');
  downloadBlob(csv, filename || 'consultation-report.csv', 'text/csv;charset=utf-8');
}

function flattenForExport(obj, rows, prefix) {
  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    var label = prefix ? prefix + ' > ' + formatLabel(key) : formatLabel(key);
    var val = obj[key];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      flattenForExport(val, rows, label);
    } else if (Array.isArray(val)) {
      rows.push([label, val.join('; ')]);
    } else {
      rows.push([label, val]);
    }
  }
}

function formatLabel(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, function(s) { return s.toUpperCase(); }).trim();
}

// XLSX export via SheetJS (loaded from CDN)
function exportXLSX(sheetsData, filename) {
  if (typeof XLSX === 'undefined') {
    alert('Excel export library not loaded. Downloading CSV instead.');
    if (sheetsData.Submission) exportCSV(sheetsData.Submission, filename.replace('.xlsx', '.csv'));
    return;
  }
  var wb = XLSX.utils.book_new();
  for (var name in sheetsData) {
    if (!sheetsData.hasOwnProperty(name)) continue;
    var data = sheetsData[name];
    var ws;
    if (Array.isArray(data) && Array.isArray(data[0])) {
      ws = XLSX.utils.aoa_to_sheet(data);
    } else if (Array.isArray(data)) {
      ws = XLSX.utils.json_to_sheet(data);
    } else {
      // Object: flatten to Field/Value pairs
      var rows = [['Field', 'Value']];
      flattenForExport(data, rows, '');
      ws = XLSX.utils.aoa_to_sheet(rows);
    }
    // Auto-width columns
    if (ws['!ref']) {
      var range = XLSX.utils.decode_range(ws['!ref']);
      var cols = [];
      for (var c = range.s.c; c <= range.e.c; c++) {
        var maxW = 10;
        for (var r = range.s.r; r <= range.e.r; r++) {
          var cell = ws[XLSX.utils.encode_cell({r: r, c: c})];
          if (cell && cell.v) {
            var len = String(cell.v).length;
            if (len > maxW) maxW = Math.min(len, 60);
          }
        }
        cols.push({wch: maxW + 2});
      }
      ws['!cols'] = cols;
    }
    XLSX.utils.book_append_sheet(wb, ws, name.substring(0, 31));
  }
  XLSX.writeFile(wb, filename || 'consultation-report.xlsx');
}

function downloadBlob(content, filename, mimeType) {
  var blob = new Blob([content], { type: mimeType });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ── Print Helper ──────────────────────────── */
function printPage() {
  window.print();
}

/* ── Reference Number Generator ────────────── */
function generateRefNumber() {
  var now = new Date();
  var year = now.getFullYear();
  var seq = String(Math.floor(Math.random() * 9000) + 1000);
  return 'EC-' + year + '-' + seq;
}

/* ── Date Formatting ───────────────────────── */
function formatDate(dateStr) {
  if (!dateStr) return '';
  var d;
  var isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (isoMatch) {
    // Parse YYYY-MM-DD as local date to avoid UTC timezone shifts.
    d = new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
  } else {
    d = new Date(dateStr);
  }
  if (isNaN(d.getTime())) return dateStr;
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

function todayISO() {
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

/* ── Init ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  initNav();
});
