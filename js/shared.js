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
  var d = new Date(dateStr);
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
