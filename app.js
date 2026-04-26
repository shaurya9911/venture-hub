/* ================================================================
   app.js — VentureHub 2.0 Frontend
   Pages: Home | Browse | Submit (3-step) | Investors | Dashboard
================================================================ */

// ── Cursor glow ───────────────────────────────────────────────────
document.addEventListener('mousemove', e => {
  const glow = document.getElementById('cursor-glow');
  if (glow) { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }
});

// ── Default data ──────────────────────────────────────────────────
const DEFAULT_STARTUPS = [
  { id: 1, name: 'AgroSense AI', sector: 'AgriTech', stage: 'MVP ready', founder: 'Ravi Kumar', founderEmail: 'ravi@agrosense.ai', funding: 50, interests: 3, interested: false, featured: true, views: 42, location: 'Pune, Maharashtra', teamSize: 6, website: 'https://agrosense.ai', tags: ['AI', 'Farming', 'Mobile'], desc: 'AI-powered crop disease detection using mobile cameras. Farmers photograph leaves and get instant diagnosis with treatment suggestions, reducing crop loss by up to 40%.' },
  { id: 2, name: 'SkillBridge', sector: 'EdTech', stage: 'Early traction', founder: 'Priya Nair', founderEmail: 'priya@skillbridge.in', funding: 30, interests: 7, interested: false, featured: false, views: 88, location: 'Kochi, Kerala', teamSize: 4, website: '', tags: ['Education', 'Rural', 'Vernacular'], desc: 'Vernacular-language micro-learning platform for rural students. Bite-sized 5-minute lessons aligned with NCERT curriculum, accessible on basic Android phones with low bandwidth.' },
  { id: 3, name: 'PayEase', sector: 'FinTech', stage: 'Growth stage', founder: 'Arjun Shah', founderEmail: 'arjun@payease.io', funding: 80, interests: 12, interested: false, featured: true, views: 134, location: 'Mumbai, Maharashtra', teamSize: 12, website: 'https://payease.io', tags: ['UPI', 'BNPL', 'Kirana'], desc: 'UPI-based BNPL for kirana stores. Merchants get instant credit lines and customers get flexible payment options without formal banking history.' },
  { id: 4, name: 'MediTrack', sector: 'HealthTech', stage: 'Idea stage', founder: 'Dr. Sneha Rao', founderEmail: 'sneha@meditrack.health', funding: 40, interests: 5, interested: false, featured: false, views: 55, location: 'Hyderabad, Telangana', teamSize: 3, website: '', tags: ['Health Records', 'Rural', 'Offline-first'], desc: 'Digital health records system for rural clinics. Enables doctors to maintain patient history on mobile devices, with offline support and regional language interface.' },
  { id: 5, name: 'GreenFleet', sector: 'CleanTech', stage: 'MVP ready', founder: 'Vikram Desai', founderEmail: 'vikram@greenfleet.ev', funding: 120, interests: 9, interested: false, featured: true, views: 97, location: 'Bengaluru, Karnataka', teamSize: 8, website: 'https://greenfleet.ev', tags: ['EV', 'Fleet', 'SaaS'], desc: 'EV fleet management SaaS for last-mile delivery companies. Route optimization + battery health monitoring reduces operational costs by 35%.' },
  { id: 6, name: 'NeuralDoc', sector: 'AI / ML', stage: 'Early traction', founder: 'Aisha Patel', founderEmail: 'aisha@neuraldoc.ai', funding: 60, interests: 8, interested: false, featured: false, views: 73, location: 'Chennai, Tamil Nadu', teamSize: 5, website: '', tags: ['NLP', 'Healthcare', 'AI'], desc: 'LLM-powered clinical note assistant for Indian doctors. Converts voice dictation to structured EMR entries in 12 regional languages, cutting documentation time by 60%.' },
];

const DEFAULT_INVESTORS = [
  { id: 1, name: 'Meera Kapoor', firm: 'Bharat Ventures', focus: ['AgriTech', 'HealthTech'], ticket: '10-50L', verified: true, bio: 'Ex-McKinsey. Backing rural-tech founders solving real Bharat problems.' },
  { id: 2, name: 'Sandeep Joshi', firm: 'Delta Peak Capital', focus: ['FinTech', 'AI / ML'], ticket: '50-200L', verified: true, bio: '3x founder. Built and sold two FinTech startups. Now backing the next generation.' },
  { id: 3, name: 'Ananya Singh', firm: 'Angel Network India', focus: ['EdTech', 'CleanTech'], ticket: '5-25L', verified: false, bio: 'Passionate about education and sustainability. First cheque investor.' },
  { id: 4, name: 'Rohan Mehta', firm: 'Independent Angel', focus: ['AI / ML', 'FinTech'], ticket: '10-30L', verified: false, bio: 'Product leader at Flipkart for 6 years. Now writing angel cheques in deep tech.' },
];

// ── State ─────────────────────────────────────────────────────────
let startups     = JSON.parse(localStorage.getItem('vh_startups') || 'null') || DEFAULT_STARTUPS;
let investors    = JSON.parse(localStorage.getItem('vh_investors') || 'null') || DEFAULT_INVESTORS;
let nextId       = Math.max(...startups.map(s => s.id)) + 1;
let nextInvId    = Math.max(...investors.map(i => i.id)) + 1;
let activeFilter = 'All';
let currentStep  = 1;

function save() {
  localStorage.setItem('vh_startups', JSON.stringify(startups));
  localStorage.setItem('vh_investors', JSON.stringify(investors));
}

// ── Page navigation ───────────────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  document.getElementById('page-' + id).classList.add('active');
  const map = { home: 0, browse: 1, submit: 2, investors: 3, dashboard: 4 };
  const tabs = document.querySelectorAll('.tab-btn');
  if (tabs[map[id]]) tabs[map[id]].classList.add('active');

  if (id === 'home')      { updateStats(); renderFeatured(); }
  if (id === 'browse')    renderStartups();
  if (id === 'investors') renderInvestors();
  if (id === 'dashboard') renderDashboard();
}

// ── Stats ─────────────────────────────────────────────────────────
function updateStats() {
  animateCount('stat-startups', startups.length);
  animateCount('stat-interest', startups.reduce((s, x) => s + x.interests, 0));
  document.getElementById('stat-funding').textContent =
    '₹' + startups.reduce((s, x) => s + Number(x.funding), 0) + 'L';
  document.getElementById('count-badge').textContent = startups.length;
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let start = 0;
  const step = Math.ceil(target / 30);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = start;
    if (start >= target) clearInterval(timer);
  }, 25);
}

// ── Featured strip ────────────────────────────────────────────────
function renderFeatured() {
  const featured = startups.filter(s => s.featured).slice(0, 3);
  const strip    = document.getElementById('featured-strip');
  if (!strip) return;
  strip.innerHTML = featured.map(s => buildCard(s, true)).join('');
}

function filterAndGo(sector) {
  activeFilter = sector;
  // Update chips when we get to browse page
  showPage('browse');
  // Update filter chip UI
  setTimeout(() => {
    document.querySelectorAll('.filter-chip').forEach(c => {
      c.classList.toggle('active', c.textContent.trim().includes(sector));
    });
    renderStartups();
  }, 50);
}

// ── Browse / Render ───────────────────────────────────────────────
function setFilter(el, val) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  activeFilter = val;
  renderStartups();
}

function renderStartups() {
  const query = (document.getElementById('search-input')?.value || '').toLowerCase();
  const sort  = document.getElementById('sort-select')?.value || 'newest';

  let filtered = startups.filter(s => {
    const bySector = activeFilter === 'All' || s.sector === activeFilter;
    const bySearch = !query ||
      s.name.toLowerCase().includes(query) ||
      s.desc.toLowerCase().includes(query) ||
      s.sector.toLowerCase().includes(query) ||
      (s.tags || []).some(t => t.toLowerCase().includes(query));
    return bySector && bySearch;
  });

  if (sort === 'popular') filtered.sort((a, b) => b.interests - a.interests);
  else if (sort === 'funding') filtered.sort((a, b) => b.funding - a.funding);
  else filtered.sort((a, b) => b.id - a.id);

  const grid = document.getElementById('startups-grid');
  if (!grid) return;

  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-state"><span class="empty-icon">🔍</span>No startups found matching your criteria.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(s => buildCard(s)).join('');
  updateStats();
}

function buildCard(s, isFeaturedPage = false) {
  const initials = s.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  return `
    <div class="startup-card ${s.featured ? 'featured-card' : ''}" onclick="openModal(${s.id})">
      ${s.featured ? '<div class="sc-featured-tag">⭐ Featured</div>' : ''}
      <div class="sc-header">
        <div class="sc-icon">${initials}</div>
        <div>
          <div class="sc-name">${s.name}</div>
          <div class="sc-meta">
            <span class="sc-tag">${s.sector}</span>
            <span class="sc-tag sc-tag--stage">${s.stage}</span>
          </div>
        </div>
      </div>
      <div class="sc-desc">${s.desc}</div>
      <div class="sc-footer">
        <span class="funding-tag">₹${s.funding}L sought</span>
        <button class="interest-btn ${s.interested ? 'interested' : ''}"
          onclick="event.stopPropagation(); toggleInterest(${s.id})">
          ${s.interested ? '♥' : '♡'} ${s.interested ? 'Interested' : 'Show interest'} (${s.interests})
        </button>
      </div>
    </div>`;
}

function toggleInterest(id) {
  const s = startups.find(x => x.id === id);
  if (!s) return;
  s.interested  = !s.interested;
  s.interests  += s.interested ? 1 : -1;
  save();
  renderStartups();
  renderFeatured();
}

// ── MODAL ─────────────────────────────────────────────────────────
function openModal(id) {
  const s = startups.find(x => x.id === id);
  if (!s) return;

  // Increment views locally
  s.views = (s.views || 0) + 1;
  save();

  const initials = s.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  const tags = [s.sector, s.stage, ...(s.tags || [])].map(t =>
    `<span class="sc-tag">${t}</span>`).join('');

  document.getElementById('modal-content').innerHTML = `
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">
      <div class="sc-icon" style="width:56px;height:56px;font-size:18px;flex-shrink:0;">${initials}</div>
      <div>
        <div class="modal-startup-name">${s.name}</div>
        ${s.location ? `<div style="font-size:12px;color:var(--muted);">📍 ${s.location}</div>` : ''}
      </div>
    </div>
    <div class="modal-tags">${tags}</div>
    <p class="modal-desc">${s.desc}</p>
    <div class="modal-grid">
      <div class="modal-stat">
        <div class="modal-stat-num">₹${s.funding}L</div>
        <div class="modal-stat-lbl">Funding sought</div>
      </div>
      <div class="modal-stat">
        <div class="modal-stat-num">${s.interests}</div>
        <div class="modal-stat-lbl">Investor interests</div>
      </div>
      <div class="modal-stat">
        <div class="modal-stat-num">${s.teamSize || '—'}</div>
        <div class="modal-stat-lbl">Team size</div>
      </div>
      <div class="modal-stat">
        <div class="modal-stat-num">${s.views || 0}</div>
        <div class="modal-stat-lbl">Profile views</div>
      </div>
    </div>
    ${s.founderEmail ? `<div style="font-size:13px;color:var(--muted);margin-bottom:1rem;">👤 <strong style="color:var(--text);">${s.founder}</strong> · ${s.founderEmail}</div>` : ''}
    ${s.website ? `<a href="${s.website}" target="_blank" style="font-size:13px;color:var(--accent);display:block;margin-bottom:1rem;">🌐 ${s.website}</a>` : ''}
    <div class="modal-contact">
      <label>Send a message to the founder</label>
      <textarea id="modal-msg" placeholder="Hi, I'm interested in learning more about your startup..."></textarea>
      <div class="modal-actions">
        <button class="btn-primary" onclick="sendModalMessage(${s.id})" style="flex:1">
          Send Message
        </button>
        <button class="interest-btn ${s.interested ? 'interested' : ''}"
          onclick="toggleInterest(${s.id}); this.textContent = '${!s.interested ? '♥ Interested' : '♡ Show interest'}'"
          style="white-space:nowrap;">
          ${s.interested ? '♥ Interested' : '♡ Show interest'}
        </button>
      </div>
    </div>`;

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function sendModalMessage(id) {
  const msg = document.getElementById('modal-msg').value.trim();
  if (!msg) { alert('Please write a message first.'); return; }
  // In a real app: POST /api/messages
  document.getElementById('modal-msg').value = '';
  const btn = document.querySelector('.modal-actions .btn-primary');
  btn.textContent = '✅ Message sent!';
  btn.style.background = 'var(--green)';
  setTimeout(() => { btn.textContent = 'Send Message'; btn.style.background = ''; }, 2500);
}

// ── MULTI-STEP FORM ───────────────────────────────────────────────
function goStep(n) {
  if (n > currentStep) {
    // Validate before advancing
    if (currentStep === 1) {
      if (!document.getElementById('f-name').value.trim() ||
          !document.getElementById('f-sector').value ||
          !document.getElementById('f-desc').value.trim()) {
        showToast('Please fill all required fields.', 'error');
        return;
      }
    }
    if (currentStep === 2) {
      if (!document.getElementById('f-fund').value) {
        showToast('Please enter the funding amount.', 'error');
        return;
      }
    }
  }

  // Mark steps done/active
  document.querySelectorAll('.step').forEach(el => {
    const s = parseInt(el.dataset.step);
    el.classList.toggle('active', s === n);
    el.classList.toggle('done', s < n);
  });

  // Show/hide form steps
  document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
  document.getElementById('step-' + n).classList.add('active');
  currentStep = n;

  if (n === 3) buildReview();
}

function buildReview() {
  const get = id => document.getElementById(id)?.value?.trim() || '—';
  document.getElementById('review-card').innerHTML = `
    <div class="review-row"><span class="review-label">Startup name</span><span class="review-val">${get('f-name')}</span></div>
    <div class="review-row"><span class="review-label">Sector</span><span class="review-val">${get('f-sector')}</span></div>
    <div class="review-row"><span class="review-label">Stage</span><span class="review-val">${get('f-stage') || 'Idea stage'}</span></div>
    <div class="review-row"><span class="review-label">Funding</span><span class="review-val">₹${get('f-fund')}L</span></div>
    <div class="review-row"><span class="review-label">Founder</span><span class="review-val">${get('f-founder') || 'Anonymous'}</span></div>
    <div class="review-row"><span class="review-label">Location</span><span class="review-val">${get('f-location')}</span></div>
    <div class="review-row"><span class="review-label">Description</span><span class="review-val" style="font-size:12px;color:var(--muted)">${get('f-desc').substring(0,100)}...</span></div>`;
}

function submitStartup() {
  const name    = document.getElementById('f-name').value.trim();
  const sector  = document.getElementById('f-sector').value;
  const desc    = document.getElementById('f-desc').value.trim();
  const funding = document.getElementById('f-fund').value;

  if (!name || !sector || !desc || !funding) {
    showToast('Please fill all required fields.', 'error'); return;
  }

  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  document.getElementById('submit-label').textContent = '⏳ Submitting...';

  // Simulate API call (real: fetch('/api/startups', {...}))
  setTimeout(() => {
    startups.unshift({
      id:           nextId++,
      name,
      sector,
      desc,
      funding:      Number(funding),
      stage:        document.getElementById('f-stage').value,
      founder:      document.getElementById('f-founder').value.trim() || 'Anonymous',
      founderEmail: document.getElementById('f-founder-email').value.trim(),
      location:     document.getElementById('f-location').value.trim(),
      teamSize:     Number(document.getElementById('f-team').value) || 1,
      website:      document.getElementById('f-website').value.trim(),
      tags:         [],
      interests:    0,
      interested:   false,
      featured:     false,
      views:        0,
    });

    save();
    showToast('🎉 Startup submitted! Redirecting...', 'success');
    btn.disabled = false;
    document.getElementById('submit-label').textContent = '🚀 Submit Startup';

    // Reset form
    ['f-name','f-desc','f-fund','f-founder','f-founder-email','f-location','f-team','f-website'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    document.getElementById('f-sector').value = '';
    document.getElementById('f-stage').value  = 'Idea stage';
    document.getElementById('desc-count').textContent = '0';
    goStep(1);

    setTimeout(() => showPage('browse'), 1500);
  }, 800);
}

// Char counter
document.addEventListener('DOMContentLoaded', () => {
  const desc = document.getElementById('f-desc');
  if (desc) {
    desc.addEventListener('input', () => {
      document.getElementById('desc-count').textContent = desc.value.length;
    });
  }
});

function showToast(msg, type) {
  const t = document.getElementById('submit-toast');
  if (!t) return;
  t.textContent = msg; t.className = 'toast ' + type;
  t.style.display = 'block';
  setTimeout(() => { t.style.display = 'none'; }, 3000);
}

// ── INVESTORS PAGE ────────────────────────────────────────────────
function renderInvestors() {
  const grid = document.getElementById('investors-grid');
  if (!grid) return;
  grid.innerHTML = investors.map(inv => {
    const initials = inv.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    const focusTags = (inv.focus || []).map(f => `<span class="inv-tag">${f}</span>`).join('');
    return `
      <div class="investor-card">
        <div class="inv-header">
          <div class="inv-avatar">${initials}</div>
          <div>
            <div class="inv-name">${inv.name}</div>
            <div class="inv-firm">${inv.firm}</div>
          </div>
          ${inv.verified ? '<div class="verified-badge">✓ Verified</div>' : ''}
        </div>
        ${inv.bio ? `<p style="font-size:13px;color:var(--muted);margin-bottom:10px;line-height:1.6;">${inv.bio}</p>` : ''}
        <div class="inv-focus">${focusTags}</div>
        <div class="inv-ticket">Ticket size: <strong>${inv.ticket}</strong></div>
      </div>`;
  }).join('');
}

function toggleInvestorForm() {
  const wrap = document.getElementById('investor-form-wrap');
  wrap.style.display = wrap.style.display === 'none' ? 'block' : 'none';
}

function registerInvestor() {
  const name = document.getElementById('inv-name').value.trim();
  if (!name) { showInvToast('Name is required.', 'error'); return; }

  const focus = [...document.querySelectorAll('.checkbox-group input:checked')].map(el => el.value);

  investors.push({
    id:       nextInvId++,
    name,
    firm:     document.getElementById('inv-firm').value.trim() || 'Independent Angel',
    ticket:   document.getElementById('inv-ticket').value,
    email:    document.getElementById('inv-email').value.trim(),
    focus,
    verified: false,
    bio:      '',
  });

  save();
  showInvToast('✅ Registered as investor!', 'success');
  setTimeout(() => {
    document.getElementById('investor-form-wrap').style.display = 'none';
    renderInvestors();
  }, 1500);
}

function showInvToast(msg, type) {
  const t = document.getElementById('inv-toast');
  if (!t) return;
  t.textContent = msg; t.className = 'toast ' + type;
  t.style.display = 'block';
  setTimeout(() => { t.style.display = 'none'; }, 3000);
}

// ── DASHBOARD ─────────────────────────────────────────────────────
function renderDashboard() {
  // KPIs
  animateCount('kpi-startups', startups.length);
  animateCount('kpi-interests', startups.reduce((s, x) => s + x.interests, 0));
  animateCount('kpi-views', startups.reduce((s, x) => s + (x.views || 0), 0));
  document.getElementById('kpi-funding').textContent =
    '₹' + startups.reduce((s, x) => s + Number(x.funding), 0) + 'L';

  // Sector bar chart
  const sectorCounts = {};
  startups.forEach(s => { sectorCounts[s.sector] = (sectorCounts[s.sector] || 0) + 1; });
  const maxCount = Math.max(...Object.values(sectorCounts), 1);
  const sectorChart = document.getElementById('sector-chart');
  if (sectorChart) {
    sectorChart.innerHTML = Object.entries(sectorCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([sector, count]) => `
        <div class="bar-row">
          <div class="bar-label">${sector}</div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${(count/maxCount)*100}%"></div>
          </div>
          <div class="bar-count">${count}</div>
        </div>`).join('');
  }

  // Stage donut chart (canvas)
  const stageCounts = {};
  startups.forEach(s => { stageCounts[s.stage] = (stageCounts[s.stage] || 0) + 1; });
  drawDonut('stage-donut', stageCounts);
  renderDonutLegend('donut-legend', stageCounts);

  // Top table
  const top = [...startups].sort((a, b) => b.interests - a.interests).slice(0, 6);
  const tbody = document.getElementById('top-table-body');
  if (tbody) {
    tbody.innerHTML = top.map((s, i) => `
      <tr>
        <td><span class="rank-badge rank-${i+1}">${i+1}</span></td>
        <td><strong>${s.name}</strong></td>
        <td><span class="sc-tag" style="font-size:11px">${s.sector}</span></td>
        <td style="color:var(--muted);font-size:12px">${s.stage}</td>
        <td style="color:var(--amber);font-weight:700">₹${s.funding}L</td>
        <td><span style="color:var(--green);font-weight:700">♥ ${s.interests}</span></td>
      </tr>`).join('');
  }
}

function drawDonut(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 100, cy = 100, r = 75, innerR = 45;
  const colors = ['#6c63ff','#43d9ad','#fbbf24','#ff6584','#a855f7','#60a5fa'];
  const total  = Object.values(data).reduce((a, b) => a + b, 0);

  ctx.clearRect(0, 0, 200, 200);
  let startAngle = -Math.PI / 2;

  Object.values(data).forEach((count, i) => {
    const slice = (count / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, startAngle + slice);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    startAngle += slice;
  });

  // Cut inner circle (donut)
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.fillStyle = getComputedStyle(document.documentElement)
    .getPropertyValue('--surface').trim() || '#0f1117';
  ctx.fill();

  // Center text
  ctx.fillStyle = '#f0f2ff';
  ctx.font = 'bold 22px Clash Display, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(total, cx, cy);
}

function renderDonutLegend(id, data) {
  const el = document.getElementById(id);
  if (!el) return;
  const colors = ['#6c63ff','#43d9ad','#fbbf24','#ff6584','#a855f7','#60a5fa'];
  el.innerHTML = Object.entries(data).map(([label, count], i) => `
    <div class="legend-item">
      <div class="legend-dot" style="background:${colors[i % colors.length]}"></div>
      <span>${label} (${count})</span>
    </div>`).join('');
}

// ── INIT ──────────────────────────────────────────────────────────
updateStats();
renderFeatured();

// Keyboard close modal
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
