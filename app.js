(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var form = $('regForm'), submitBtn = $('submitBtn'), formError = $('formError');
  var SENT_KEY = 'nb_registration_sent'; // sirf flag, koi personal data nahi
  var busy = false;

  function show(id) {
    ['welcome', 'formScreen', 'success'].forEach(function (s) { $(s).hidden = (s !== id); });
    window.scrollTo(0, 0);
    if (id === 'success') $('success').focus();
  }

  // Move-in date: aaj se 1 saal pehle se 1 saal baad tak
  var d = new Date(), pad = function (n) { return ('0' + n).slice(-2); };
  var iso = function (dt) { return dt.getFullYear() + '-' + pad(dt.getMonth() + 1) + '-' + pad(dt.getDate()); };
  var past = new Date(d); past.setFullYear(d.getFullYear() - 1);
  var future = new Date(d); future.setFullYear(d.getFullYear() + 1);
  $('moveIn').min = iso(past); $('moveIn').max = iso(future);

  ['mobile', 'ownerMobile'].forEach(function (id) {
    $(id).addEventListener('input', function (e) { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10); });
  });

  $('backBtn').addEventListener('click', function () { show('welcome'); });
  $('startBtn').addEventListener('click', function () { show('formScreen'); $('fullName').focus(); });

  ['flatNo', 'vehicleNo'].forEach(function (id) {
    $(id).addEventListener('input', function (e) { e.target.value = e.target.value.toUpperCase(); });
  });

  var rules = [
    ['fullName', function (v) { return v.trim().length >= 2 ? '' : 'Apna poora naam likhein.'; }],
    ['flatNo', function (v) { return v.trim() ? '' : 'Flat number likhein.'; }],
    ['mobile', function (v) { return /^[6-9]\d{9}$/.test(v) ? '' : 'Sahi 10 digit mobile number daalein.'; }],
    ['email', function (v) { return !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Sahi email address daalein.'; }],
    ['moveIn', function (v) { return v ? '' : 'Move-in date chunein.'; }],
    ['ownerName', function (v) { return v.trim().length >= 2 ? '' : 'Owner ka naam likhein.'; }],
    ['ownerMobile', function (v) { return /^[6-9]\d{9}$/.test(v) ? '' : 'Owner ka sahi 10 digit mobile number daalein.'; }],
    ['members', function (v) { var n = Number(v); return v && n >= 1 && n <= 20 && Number.isInteger(n) ? '' : 'Family members 1 se 20 ke beech likhein.'; }]
  ];

  var bar = $('bar'), reqIds = rules.map(function (r) { return r[0]; });
  function progress() {
    var done = rules.filter(function (r) { return r[0] !== 'email' && r[1]($(r[0]).value) === ''; }).length + ($('consent').checked ? 1 : 0);
    bar.style.width = Math.round(done / (reqIds.length - 1 + 1) * 100) + '%';
  }
  form.addEventListener('input', progress);
  form.addEventListener('change', progress);
  rules.forEach(function (r) {
    $(r[0]).addEventListener('blur', function () {
      if (!this.value && r[0] !== 'email') return; // khali field par abhi error nahi
      var m = r[1](this.value); $(r[0] + '-err').textContent = m; this.setAttribute('aria-invalid', m ? 'true' : 'false');
    });
  });

  function validate() {
    var first = null;
    rules.forEach(function (r) {
      var el = $(r[0]), msg = r[1](el.value);
      $(r[0] + '-err').textContent = msg;
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg && !first) first = el;
    });
    var c = $('consent');
    $('consent-err').textContent = c.checked ? '' : 'Aage badhne ke liye declaration accept karna zaroori hai.';
    if (!c.checked && !first) first = c;
    if (first) first.focus();
    return !first;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy) return;
    formError.hidden = true;
    if (localStorage.getItem(SENT_KEY) &&
        !confirm('Is phone se registration pehle hi submit ho chuka hai. Kya aap dobara submit karna chahte hain?')) return;
    if (!validate()) return;

    busy = true; submitBtn.disabled = true; submitBtn.textContent = 'Submit ho raha hai...';
    var body = new URLSearchParams(new FormData(form)).toString();

    var ctl = new AbortController(), t = setTimeout(function () { ctl.abort(); }, 20000);
    fetch('/', { signal: ctl.signal, method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
      .then(function (res) {
        if (!res.ok) { var er = new Error('HTTP ' + res.status); er.status = res.status; throw er; }
        try { localStorage.setItem(SENT_KEY, String(Date.now())); } catch (x) {}
        form.reset();
        show('success'); // success sirf tab dikhta hai jab server ne OK bola
      })
      .catch(function (err) {
        console.error('Registration submit failed:', err);
        formError.textContent = 'Submit nahi ho paaya' + (err.status ? ' (error ' + err.status + ')' : '') + '. Internet check karke dobara try karein. Aapki details abhi bhi form mein hain.';
        formError.hidden = false;
      })
      .finally(function () {
        clearTimeout(t);
        busy = false; submitBtn.disabled = false; submitBtn.textContent = 'Submit Registration';
        progress();
      });
  });
})();
