// ── Vizier Library View Engine ──────────────────────────────────────────────

let viewMode = 'graph';
let libSearchQuery = '';
let libStatusFilter = 'all';
let libDomainFilter = 'all';
let libTypeFilter = 'all';
let libRingFilter = 'all';
let libSizeFilter = 'all';
let libSortBy = 'curriculum';
let continueTargetNode = null;

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.switchViewMode = function(mode) {
  viewMode = mode;
  const libView = document.getElementById('library-view');
  const canvasContainer = document.getElementById('canvas-container');
  const topGraph = document.getElementById('top-btn-graph');
  const topLib = document.getElementById('top-btn-library');
  const ctrlGraph = document.getElementById('btn-view-graph');
  const ctrlLib = document.getElementById('btn-view-library');

  if (mode === 'library') {
    if (libView) libView.classList.add('active');
    if (canvasContainer) canvasContainer.style.display = 'none';
    if (topGraph) { topGraph.classList.remove('active'); topGraph.setAttribute('aria-selected', 'false'); }
    if (topLib) { topLib.classList.add('active'); topLib.setAttribute('aria-selected', 'true'); }
    if (ctrlGraph) ctrlGraph.classList.remove('on');
    if (ctrlLib) ctrlLib.classList.add('on');
    renderLibraryView();
  } else {
    if (libView) libView.classList.remove('active');
    if (canvasContainer) canvasContainer.style.display = 'block';
    if (topGraph) { topGraph.classList.add('active'); topGraph.setAttribute('aria-selected', 'true'); }
    if (topLib) { topLib.classList.remove('active'); topLib.setAttribute('aria-selected', 'false'); }
    if (ctrlGraph) ctrlGraph.classList.add('on');
    if (ctrlLib) ctrlLib.classList.remove('on');
  }
};

function setupLibraryControls() {
  const searchInput = document.getElementById('lib-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      libSearchQuery = e.target.value.toLowerCase().trim();
      renderLibraryView();
    });
  }

  const filterToggleBtn = document.getElementById('lib-filter-toggle');
  const filterGrid = document.getElementById('lib-filter-grid');
  if (filterToggleBtn && filterGrid) {
    filterToggleBtn.addEventListener('click', () => {
      filterGrid.classList.toggle('open');
    });
  }

  const statusPills = document.querySelectorAll('.status-pill');
  statusPills.forEach(pill => {
    pill.addEventListener('click', () => {
      statusPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      libStatusFilter = pill.dataset.status;
      renderLibraryView();
    });
  });

  const domPills = document.querySelectorAll('.dom-pill');
  domPills.forEach(pill => {
    pill.addEventListener('click', () => {
      domPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      libDomainFilter = pill.dataset.domain;
      const domainSel = document.getElementById('lib-filter-domain');
      if (domainSel) domainSel.value = libDomainFilter;
      renderLibraryView();
    });
  });

  const domainSel = document.getElementById('lib-filter-domain');
  if (domainSel) domainSel.addEventListener('change', (e) => {
    libDomainFilter = e.target.value;
    domPills.forEach(p => p.classList.toggle('active', p.dataset.domain === libDomainFilter));
    renderLibraryView();
  });

  const typeSel = document.getElementById('lib-filter-type');
  if (typeSel) typeSel.addEventListener('change', (e) => { libTypeFilter = e.target.value; renderLibraryView(); });

  const ringSel = document.getElementById('lib-filter-ring');
  if (ringSel) ringSel.addEventListener('change', (e) => { libRingFilter = e.target.value; renderLibraryView(); });

  const sizeSel = document.getElementById('lib-filter-size');
  if (sizeSel) sizeSel.addEventListener('change', (e) => { libSizeFilter = e.target.value; renderLibraryView(); });

  const sortSel = document.getElementById('lib-sort-by');
  if (sortSel) sortSel.addEventListener('change', (e) => { libSortBy = e.target.value; renderLibraryView(); });

  const btnContinue = document.getElementById('btn-continue-node');
  if (btnContinue) {
    btnContinue.addEventListener('click', (e) => {
      if (continueTargetNode) {
        onNodeClick(e, continueTargetNode);
      }
    });
  }
}

function renderLibraryView() {
  if (!graphData || !graphData.nodes) return;

  const allCurrNodes = graphData.nodes.filter(n => n.type !== 'center' && n.type !== 'domain');

  const total = allCurrNodes.length;
  const litCount = allCurrNodes.filter(n => n.status === 'lit').length;
  const chargingCount = allCurrNodes.filter(n => n.status === 'charging').length;
  const darkCount = total - litCount - chargingCount;

  const litPct = total > 0 ? (litCount / total) * 100 : 0;
  const chargingPct = total > 0 ? (chargingCount / total) * 100 : 0;

  const segLit = document.getElementById('seg-lit');
  const segCharging = document.getElementById('seg-charging');
  const segDark = document.getElementById('seg-dark');
  if (segLit) segLit.style.width = `${litPct}%`;
  if (segCharging) segCharging.style.width = `${chargingPct}%`;
  if (segDark) segDark.style.width = `${Math.max(0, 100 - litPct - chargingPct)}%`;

  const countsEl = document.getElementById('lib-progress-counts');

  continueTargetNode = allCurrNodes.find(n => n.status !== 'lit' && n.type !== 'milestone') || allCurrNodes[0];
  const contTitleEl = document.getElementById('continue-node-title');
  const contMetaEl = document.getElementById('continue-node-meta');
  if (contTitleEl && continueTargetNode) {
    const codeTag = continueTargetNode.code ? `[${continueTargetNode.code}] ` : '';
    contTitleEl.textContent = `${codeTag}${continueTargetNode.label || continueTargetNode.title || continueTargetNode.id}`;
    const metaParts = [
      continueTargetNode.domain ? `Domain: ${continueTargetNode.domain}` : '',
      continueTargetNode.ring ? `Ring ${continueTargetNode.ring}` : '',
      continueTargetNode.type ? `Type: ${continueTargetNode.type}` : '',
      `Status: ${(continueTargetNode.status || 'dark').toUpperCase()}`
    ].filter(Boolean);
    if (contMetaEl) contMetaEl.innerHTML = metaParts.map(m => `<span class="mtag">${m}</span>`).join(' ');
  }

  let filtered = allCurrNodes.filter(n => {
    if (libSearchQuery) {
      const matchCode = (n.code || '').toLowerCase().includes(libSearchQuery);
      const matchSeq = String(n.seq_num || '').includes(libSearchQuery);
      const matchLabel = (n.label || '').toLowerCase().includes(libSearchQuery);
      const matchId = (n.id || '').toLowerCase().includes(libSearchQuery);
      const matchDomain = (n.domain || '').toLowerCase().includes(libSearchQuery);
      const matchTags = n.tags && n.tags.some(t => t.toLowerCase().includes(libSearchQuery));
      const matchCluster = (n.cluster || '').toLowerCase().includes(libSearchQuery);
      if (!matchCode && !matchSeq && !matchLabel && !matchId && !matchDomain && !matchTags && !matchCluster) return false;
    }

    if (libStatusFilter !== 'all') {
      const nStatus = (n.status || 'dark').toLowerCase();
      if (nStatus !== libStatusFilter) return false;
    }

    if (libDomainFilter !== 'all') {
      if ((n.domain || '').toLowerCase() !== libDomainFilter) return false;
    }

    if (libTypeFilter !== 'all') {
      if ((n.type || '').toLowerCase() !== libTypeFilter) return false;
    }

    if (libRingFilter !== 'all') {
      const nRing = String(n.ring || '');
      if (!nRing.includes(libRingFilter)) return false;
    }

    if (libSizeFilter !== 'all') {
      if ((n.size || '').toUpperCase() !== libSizeFilter) return false;
    }

    return true;
  });

  const fLit = filtered.filter(n => n.status === 'lit').length;
  const fCharging = filtered.filter(n => n.status === 'charging').length;
  const fDark = filtered.length - fLit - fCharging;
  const isFiltered = filtered.length !== total;

  if (countsEl) {
    if (isFiltered) {
      countsEl.textContent = `FILTERED (${filtered.length}): ${fLit} LIT · ${fCharging} CHARGING · ${fDark} DARK | OVERALL: ${litCount} LIT · ${chargingCount} CHARGING · ${darkCount} DARK`;
    } else {
      countsEl.textContent = `${litCount} LIT · ${chargingCount} CHARGING · ${darkCount} DARK (${litPct.toFixed(1)}%)`;
    }
  }

  const matchCountEl = document.getElementById('lib-matching-count');
  if (matchCountEl) matchCountEl.textContent = `Showing ${filtered.length} of ${total} nodes`;

  const listEl = document.getElementById('lib-nodes-list');
  if (!listEl) return;

  if (filtered.length === 0) {
    listEl.innerHTML = `<div style="text-align:center; padding:40px; color:var(--muted); font-size:0.85rem;">No curriculum nodes match your selected search or filters.</div>`;
    return;
  }

  const renderRowHtml = (n) => {
    const dotColor = domainColors[n.domain] || '#3ee2e2';
    const nStatus = (n.status || 'dark').toLowerCase();
    const nStatusLabel = nStatus === 'dark' ? 'GHOST' : nStatus.toUpperCase();
    const nVersion = n.version || n.plan_version || '0.1.0';
    const nUpdated = n.updated || n.completed || '2026-07-20';
    const rawRing = n.ring ? String(n.ring) : '1';
    const nRing = rawRing.toLowerCase().startsWith('r') ? rawRing : `R${rawRing}`;
    const nRevisions = n.revisions !== undefined ? n.revisions : 0;

    return `
      <div class="lib-row" data-id="${n.id}" role="button" tabindex="0" aria-label="${escapeHtml(n.label || n.title || n.id)}">
        <div class="lib-row-left">
          <div class="lib-dot" style="background:${dotColor}; color:${dotColor}; box-shadow:0 0 6px ${dotColor};"></div>
          <div class="lib-row-title-wrap">
            <div class="lib-row-title">
              ${n.code ? `<span class="lib-code-badge" style="--dom-color:${dotColor}">#${n.code}</span>` : ''}
              <span class="lib-row-title-text">${escapeHtml(n.label || n.title || n.id)}</span>
            </div>
            <div class="lib-row-sub">
              <span>${(n.domain || 'CORE').toUpperCase()}</span>
              <span>•</span>
              <span>${nRing}</span>
              <span>•</span>
              <span>${n.type || 'concept'}</span>
              ${n.size ? `<span>• ${n.size}</span>` : ''}
              ${nRevisions > 0 ? `<span>• Rev: ${nRevisions}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="lib-row-right">
          <span class="mtag status-badge status-${nStatus}">${nStatusLabel}</span>
          <div class="lib-row-meta-tags">
            <span class="mtag">v${nVersion}</span>
            <span class="mtag date-tag">${nUpdated}</span>
          </div>
        </div>
      </div>
    `;
  };

  if (libSortBy === 'curriculum') {
    let html = '';
    
    domainList.forEach(dom => {
      const domNodes = filtered.filter(n => n.domain === dom.id);
      if (domNodes.length > 0) {
        domNodes.sort((a, b) => (a.seq_num || 0) - (b.seq_num || 0));
        const domLit = domNodes.filter(n => n.status === 'lit').length;
        const domTotal = domNodes.length;

        html += `
          <div class="lib-domain-section-header" style="--dom-color: ${dom.color};">
            <div class="lib-domain-header-left">
              <span class="lib-domain-num-tag" style="--dom-color: ${dom.color}">DOMAIN ${dom.num}</span>
              <span class="lib-domain-header-title">${dom.title}</span>
            </div>
            <span class="lib-domain-header-stats">${domLit} / ${domTotal} LIT</span>
          </div>
          ${domNodes.map(renderRowHtml).join('')}
        `;
      }
    });

    const unassigned = filtered.filter(n => !domainList.some(d => d.id === n.domain));
    if (unassigned.length > 0) {
      html += `
        <div class="lib-domain-section-header" style="--dom-color: #f687b3;">
          <div class="lib-domain-header-left">
            <span class="lib-domain-num-tag" style="--dom-color: #f687b3">MILESTONES</span>
            <span class="lib-domain-header-title">FLOATING MILESTONES & CAPSTONES</span>
          </div>
          <span class="lib-domain-header-stats">${unassigned.length} NODES</span>
        </div>
        ${unassigned.map(renderRowHtml).join('')}
      `;
    }

    listEl.innerHTML = html;
  } else {
    let flatNodes = [...filtered];
    if (libSortBy === 'code') {
      flatNodes.sort((a, b) => (a.seq_num || 0) - (b.seq_num || 0));
    } else if (libSortBy === 'updated') {
      flatNodes.sort((a, b) => new Date(b.updated || b.completed || '2000-01-01') - new Date(a.updated || a.completed || '2000-01-01'));
    } else if (libSortBy === 'revisions') {
      flatNodes.sort((a, b) => (b.revisions || 0) - (a.revisions || 0));
    } else if (libSortBy === 'ring') {
      flatNodes.sort((a, b) => {
        const rA = parseInt(String(a.ring || '99').replace(/\D/g, ''), 10) || 99;
        const rB = parseInt(String(b.ring || '99').replace(/\D/g, ''), 10) || 99;
        return rA - rB;
      });
    } else if (libSortBy === 'alphabetical') {
      flatNodes.sort((a, b) => (a.label || a.id).localeCompare(b.label || b.id));
    }

    listEl.innerHTML = flatNodes.map(renderRowHtml).join('');
  }

  listEl.querySelectorAll('.lib-row').forEach(row => {
    const openRow = (e) => {
      const nodeId = row.dataset.id;
      const targetNode = graphData.nodes.find(n => n.id === nodeId);
      if (targetNode) {
        onNodeClick(e, targetNode);
      }
    };
    row.addEventListener('click', openRow);
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openRow(e);
      }
    });
  });
}
