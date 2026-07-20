// ── Vizier Gamification & Motivation Engine ─────────────────────────────────

function initMotivationOverlays(data) {
  // 1. XP & Level Indicator
  const totalXP = data.metadata ? (data.metadata.total_xp ?? 0) : data.nodes
    .filter(n => n.status === 'lit' && n.type !== 'domain' && n.type !== 'milestone' && n.type !== 'center')
    .reduce((sum, n) => {
      if (n.type === 'capstone') return sum + 100;
      if (n.size === 'S') return sum + 10;
      if (n.size === 'M') return sum + 25;
      if (n.size === 'L') return sum + 50;
      return sum + 10;
    }, 0);
  updateLevelBar(totalXP);

  // 2. Streak Flame
  const streak = data.metadata ? (data.metadata.streak ?? { current: 0, best: 0 }) : { current: 0, best: 0 };
  const currentStreakEl = document.getElementById('streak-current');
  const bestStreakEl = document.getElementById('streak-best');
  if (currentStreakEl) currentStreakEl.textContent = streak.current;
  if (bestStreakEl) bestStreakEl.textContent = streak.best;

  // 3. Domain Legend percentages
  const originalNames = {
    'foundations': '01 Foundations',
    'prompting-apis': '02 Prompting & APIs',
    'rag-retrieval': '03 RAG & Retrieval',
    'agents': '04 Agents',
    'multi-agent-mcp': '05 Multi-Agent & MCP',
    'memory-knowledge': '06 Memory & Knowledge',
    'evals-observability': '07 Evals & Observability',
    'safety-security': '08 Safety & Security',
    'production': '09 Production',
    'frontier-capstone': '10 Frontier & Capstone'
  };

  document.querySelectorAll('.leg-row').forEach(row => {
    const domain = row.getAttribute('data-domain');
    if (!domain) return;
    const legName = row.querySelector('.leg-name');
    if (!legName) return;
    
    const domainNodes = data.nodes.filter(n => n.domain === domain && n.type !== 'domain' && n.type !== 'milestone' && n.type !== 'center');
    const total = domainNodes.length;
    const lit = domainNodes.filter(n => n.status === 'lit').length;
    const pct = total > 0 ? Math.round((lit / total) * 100) : 0;
    
    const originalName = originalNames[domain] || legName.textContent;
    legName.innerHTML = `${originalName} <span style="color:var(--muted);float:right;font-family:monospace;font-size:0.62rem;margin-left:8px;">${pct}%</span>`;
  });

  // 4. Badges definitions + trophy shelf modal
  loadTrophyShelf(data);

  // 5. One-time celebration check on load
  const litCapstones = data.nodes.filter(n => n.type === 'capstone' && n.status === 'lit');
  const celebrated = JSON.parse(localStorage.getItem('vizier_celebrated_capstones') || '[]');
  let newCelebration = false;
  
  for (const cap of litCapstones) {
    if (!celebrated.includes(cap.id)) {
      celebrated.push(cap.id);
      localStorage.setItem('vizier_celebrated_capstones', JSON.stringify(celebrated));
      newCelebration = cap;
      break;
    }
  }
  
  if (newCelebration) {
    setTimeout(() => {
      triggerCelebration(nodeColor(newCelebration));
    }, 1500);
  }

  // 6. Update Library View stats & list if initialized
  if (typeof renderLibraryView === 'function') {
    renderLibraryView();
  }
}

function updateLevelBar(xp) {
  const levelNum = Math.floor(xp / 1000) + 1;
  let levelTitle = 'Apprentice';
  if (levelNum === 2) levelTitle = 'Journeyman';
  else if (levelNum === 3) levelTitle = 'Engineer';
  else if (levelNum === 4) levelTitle = 'Architect';
  else if (levelNum >= 5) levelTitle = 'Vizier';

  const xpInLevel = xp % 1000;
  const progressPct = (xpInLevel / 1000) * 100;

  const levelTitleEl = document.getElementById('level-title');
  const xpDisplayEl = document.getElementById('xp-display');
  const levelNumEl = document.getElementById('level-num');
  const progressBarEl = document.getElementById('level-progress-bar');

  if (levelTitleEl) levelTitleEl.textContent = levelTitle;
  if (xpDisplayEl) xpDisplayEl.textContent = `${xpInLevel} / 1000 XP`;
  if (levelNumEl) levelNumEl.textContent = levelNum;
  if (progressBarEl) progressBarEl.style.width = `${progressPct}%`;
}

let badgeDefinitions = null;
function loadTrophyShelf(data) {
  if (badgeDefinitions) {
    updateTrophyShelfUI(data);
    return;
  }
  fetch('badges.json')
    .then(r => r.json())
    .then(badges => {
      badgeDefinitions = badges;
      updateTrophyShelfUI(data);
    })
    .catch(err => console.warn('Failed to load badges.json:', err));
}

function updateTrophyShelfUI(data) {
  if (!badgeDefinitions) return;
  const grid = document.getElementById('trophy-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const litCount = data.nodes.filter(n => n.status === 'lit' && n.type !== 'domain' && n.type !== 'milestone' && n.type !== 'center').length;

  badgeDefinitions.forEach(badge => {
    let unlocked = false;

    if (badge.id === 'first-light') {
      unlocked = litCount >= 1;
    } else if (badge.id === 'century') {
      unlocked = litCount >= 100;
    } else if (badge.id === 'the-rebuild') {
      const rebuildNode = data.nodes.find(n => n.id === 'vizier-v2-redteam-ship');
      unlocked = rebuildNode ? rebuildNode.status === 'lit' : false;
    } else if (badge.id === 'graduation') {
      const gradNode = data.nodes.find(n => n.id === 'graduation');
      unlocked = gradNode ? gradNode.status === 'lit' : false;
    } else if (badge.domain) {
      const domainNodes = data.nodes.filter(n => n.domain === badge.domain && n.type !== 'domain' && n.type !== 'milestone' && n.type !== 'center');
      if (domainNodes.length > 0) {
        unlocked = domainNodes.every(n => n.status === 'lit');
      }
    }

    const card = document.createElement('div');
    card.className = `trophy-card ${unlocked ? 'unlocked' : 'locked'}`;
    
    let borderStyle = '';
    if (unlocked) {
      if (badge.domain) {
        const dColor = domainColors[badge.domain] || '#d4af37';
        borderStyle = `border-color: ${dColor}40; box-shadow: 0 4px 12px ${dColor}15;`;
      } else {
        borderStyle = `border-color: rgba(212, 175, 55, 0.4); box-shadow: 0 4px 12px rgba(212, 175, 55, 0.15);`;
      }
    }
    
    card.setAttribute('style', borderStyle);

    card.innerHTML = `
      <span class="trophy-icon" style="${unlocked ? 'filter: drop-shadow(0 0 6px rgba(212, 175, 55, 0.6));' : ''}">${badge.icon}</span>
      <div class="trophy-title">${badge.title}</div>
      <div class="trophy-desc">${badge.description}</div>
      ${unlocked ? '<div style="position:absolute; bottom:4px; right:6px; font-size:0.5rem; color:#d4af37; font-weight:700;">LIT</div>' : ''}
    `;
    grid.appendChild(card);
  });
}

function triggerCelebration(color) {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 150;
  const baseColor = color || '#3ee2e2';

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 4;
    particles.push({
      x: width / 2,
      y: height / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - Math.random() * 3,
      radius: Math.random() * 4 + 2,
      color: Math.random() > 0.3 ? baseColor : '#ffffff',
      alpha: 1,
      decay: Math.random() * 0.015 + 0.01
    });
  }

  const shockwaves = [
    { r: 10, alpha: 0.8, speed: 6 },
    { r: 20, alpha: 0.6, speed: 8 }
  ];

  function animate() {
    ctx.clearRect(0, 0, width, height);

    let activeShockwaves = false;
    shockwaves.forEach(sw => {
      if (sw.alpha > 0) {
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, sw.r, 0, Math.PI * 2);
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 3;
        ctx.globalAlpha = sw.alpha;
        ctx.stroke();
        sw.r += sw.speed;
        sw.alpha -= 0.02;
        activeShockwaves = true;
      }
    });

    let activeParticles = false;
    particles.forEach(p => {
      if (p.alpha > 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.vx *= 0.98;
        p.alpha -= p.decay;
        activeParticles = true;
      }
    });

    if (activeParticles || activeShockwaves) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }

  animate();
}
