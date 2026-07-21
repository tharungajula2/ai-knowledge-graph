// ── Vizier Main Application Entry Point ─────────────────────────────────────

function loadData(src) {
  d3.json(src).then(data => {
    graphData = data;
    const currNodesCount = data.nodes.filter(n => n.type !== 'center' && n.type !== 'domain' && n.type !== 'milestone').length;
    
    const stNodes = document.getElementById('st-nodes');
    if (stNodes) stNodes.textContent = currNodesCount;
    const stEdges = document.getElementById('st-edges');
    if (stEdges) stEdges.textContent = data.metadata ? data.metadata.edge_count : data.edges.length;
    
    const badge = document.getElementById('preview-badge');
    const strip = document.getElementById('preview-strip');
    
    const litCount = data.nodes.filter(n => n.status === 'lit' && n.type !== 'center' && n.type !== 'domain' && n.type !== 'milestone').length;
    const totalCount = data.metadata ? (data.metadata.node_count ?? 228) : 228;
    
    const stLit = document.getElementById('st-lit');
    if (stLit) stLit.textContent = `${litCount} / ${totalCount}`;
    const isUniverseComplete = litCount === totalCount || (data.metadata && data.metadata.universe && data.metadata.universe.status === 'complete');

    if (isUniverseComplete) {
      document.body.classList.add('universe-complete');
    } else {
      document.body.classList.remove('universe-complete');
    }

    if (dataMode === 'preview') {
      if (badge) badge.textContent = `VISION — THE LIVING MAP`;
      if (strip) strip.innerHTML = `THE LIVING MAP — Universe 01 · plan v1.0.0 · ${currNodesCount} nodes. The past is locked. The future evolves.`;
    } else {
      if (badge) badge.textContent = `LIVE`;
      if (strip) strip.innerHTML = `LIVE — visitors watch one brain wire itself up in real time.`;
    }

    const chipEl = document.getElementById('day-chip');
    if (chipEl && data.metadata && data.metadata.universe) {
      const u = data.metadata.universe;
      if (isUniverseComplete) {
        chipEl.textContent = `UNIVERSE 01 · COMPLETE`;
      } else {
        chipEl.textContent = `${u.title.split(' — ')[0].toUpperCase()} · ${u.codename.toUpperCase()}`;
      }
    }
    
    renderGraph();
    setupSearch();
    renderLibraryView();
    initStarfield();
    initMotivationOverlays(data);

    const liveEmpty = document.getElementById('live-empty-state');
    if (liveEmpty) {
      liveEmpty.style.display = 'none';
    }

    const params = new URLSearchParams(window.location.search);
    const targetId = params.get('note') || params.get('node');
    if (targetId && graphData && graphData.nodes) {
      const cleanId = targetId.toLowerCase().trim();
      const targetNode = graphData.nodes.find(n => n.id === cleanId || (n.slug && n.slug.toLowerCase() === cleanId));
      if (targetNode) {
        setTimeout(() => {
          onNodeClick({ stopPropagation: () => {} }, targetNode);
        }, 120);
      }
    }
  }).catch(err => {
    console.error('Failed to load', src, err);
  });
}

function setDataMode(mode, reload = true) {
  dataMode = mode;
  const badge   = document.getElementById('preview-badge');
  const strip   = document.getElementById('preview-strip');
  const btnLive = document.getElementById('btn-live');
  const btnPrev = document.getElementById('btn-preview');

  if (mode === 'preview') {
    document.body.classList.add('vision-mode');
    document.body.classList.remove('live-mode');
    if (badge) badge.classList.add('visible');
    if (strip) strip.classList.add('visible');
    if (btnPrev) btnPrev.classList.add('on');
    if (btnLive) btnLive.classList.remove('on');
    if (reload) loadData(PREVIEW_SRC);
  } else {
    document.body.classList.add('live-mode');
    document.body.classList.remove('vision-mode');
    if (badge) badge.classList.remove('visible');
    if (strip) strip.classList.remove('visible');
    if (btnLive) btnLive.classList.add('on');
    if (btnPrev) btnPrev.classList.remove('on');
    if (reload) loadData(LIVE_SRC);
  }
}

function setupSearch() {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');

  if (!input || !results) return;

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (!q || !graphData) { results.style.display = 'none'; return; }

    const matches = graphData.nodes.filter(n =>
      n.label?.toLowerCase().includes(q) ||
      n.domain?.toLowerCase().includes(q) ||
      n.tags?.some(t => t.toLowerCase().includes(q))
    ).slice(0, 18);

    if (!matches.length) { results.style.display = 'none'; return; }

    results.innerHTML = matches.map(n => `
      <div class="si" data-id="${n.id}" role="option">
        <span>${n.label}</span>
        <span class="si-type">${n.type}</span>
      </div>
    `).join('');
    results.style.display = 'block';

    results.querySelectorAll('.si').forEach(el => {
      el.addEventListener('click', () => {
        const node = graphData.nodes.find(n => n.id === el.dataset.id);
        if (node) {
          onNodeClick({ stopPropagation: () => {} }, node);
          results.style.display = 'none';
          input.value = '';
        }
      });
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#search-panel')) results.style.display = 'none';
  });
}

// Global Event Listeners Initializer
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const initMode = urlParams.get('mode') === 'preview' ? 'preview' : 'live';
  setDataMode(initMode, false);
  loadData(initMode === 'live' ? LIVE_SRC : PREVIEW_SRC);

  const btnLive = document.getElementById('btn-live');
  const btnPrev = document.getElementById('btn-preview');
  if (btnLive) btnLive.addEventListener('click', () => setDataMode('live'));
  if (btnPrev) btnPrev.addEventListener('click', () => setDataMode('preview'));

  const btnRings = document.getElementById('btn-rings');
  const btnForce = document.getElementById('btn-force');
  if (btnRings) {
    btnRings.addEventListener('click', () => {
      layoutMode = 'rings';
      btnRings.classList.add('on');
      if (btnForce) btnForce.classList.remove('on');
      const cs = document.getElementById('ctrl-spring');
      const csp = document.getElementById('ctrl-spin');
      if (cs) cs.style.display = 'none';
      if (csp) csp.style.display = 'flex';
      document.body.classList.add('rings-active');
      document.body.classList.remove('galaxy-active');
      simulation.stop();
      if (graphData) renderGraph();
    });
  }
  if (btnForce) {
    btnForce.addEventListener('click', () => {
      layoutMode = 'force';
      btnForce.classList.add('on');
      if (btnRings) btnRings.classList.remove('on');
      const cs = document.getElementById('ctrl-spring');
      const csp = document.getElementById('ctrl-spin');
      if (cs) cs.style.display = 'flex';
      if (csp) csp.style.display = 'none';
      document.body.classList.remove('rings-active');
      document.body.classList.add('galaxy-active');
      if (spinAnimId) { cancelAnimationFrame(spinAnimId); spinAnimId = null; }
      if (graphData) renderGraph();
    });
  }

  ['all', 'smart', 'main', 'none'].forEach(mode => {
    const btn = document.getElementById(`btn-lab-${mode}`);
    if (btn) {
      btn.addEventListener('click', () => {
        labelsMode = mode;
        ['all', 'smart', 'main', 'none'].forEach(m => {
          const b = document.getElementById(`btn-lab-${m}`);
          if (b) b.classList.toggle('on', m === mode);
        });
        updateLabels();
      });
    }
  });

  const slSize = document.getElementById('sl-size');
  if (slSize) {
    slSize.addEventListener('input', () => {
      baseNodeSize = +slSize.value;
      const lblSize = document.getElementById('lbl-size');
      if (lblSize) lblSize.textContent = baseNodeSize + 'px';
      if (nodeSel) {
        nodeSel.selectAll('circle').each(function(d) {
          const el = d3.select(this);
          const isInner = el.attr('fill') !== 'none';
          const r = getR(d);
          el.attr('r', (d.type === 'routine' && isInner) ? r * 0.5 : r);
        });
        nodeSel.selectAll('polygon').each(function(d) {
          const hexRadius = baseNodeSize * 1.5;
          const hx = hexRadius * 0.866;
          const hy = hexRadius * 0.5;
          d3.select(this).attr('points', `0,-${hexRadius} ${hx},-${hy} ${hx},${hy} 0,${hexRadius} -${hx},${hy} -${hx},-${hy}`);
        });
      }
    });
  }

  const slSpin = document.getElementById('sl-spin');
  if (slSpin) {
    slSpin.addEventListener('input', () => {
      spinSpeed = +slSpin.value / 10;
      const lblSpin = document.getElementById('lbl-spin');
      if (lblSpin) lblSpin.textContent = spinSpeed.toFixed(1);
      if (spinAnimId) { cancelAnimationFrame(spinAnimId); spinAnimId = null; }
      if (layoutMode === 'rings') startRingSpin();
    });
  }

  const btnReset = document.getElementById('btn-reset-view');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
      selectedNode = null;
      if (nodeSel) nodeSel.classed('pulsing', false);
      clearHighlight();
      const insp = document.getElementById('insp');
      if (insp) insp.classList.remove('open');
      const ctrlPanel = document.getElementById('ctrl');
      if (ctrlPanel) ctrlPanel.classList.remove('open');
    });
  }

  const menuBtn = document.getElementById('mobile-menu-btn');
  const ctrlPanel = document.getElementById('ctrl');
  if (menuBtn && ctrlPanel) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      ctrlPanel.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (ctrlPanel.classList.contains('open') && !e.target.closest('#ctrl') && !e.target.closest('#mobile-menu-btn')) {
        ctrlPanel.classList.remove('open');
      }
    });
  }

  const slSpring = document.getElementById('sl-spring');
  if (slSpring) {
    slSpring.addEventListener('input', () => {
      linkDistance = +slSpring.value;
      const lblSpring = document.getElementById('lbl-spring');
      if (lblSpring) lblSpring.textContent = linkDistance + 'px';
      if (simulation) simulation.force('link').distance(linkDistance).alphaTarget(0.3).restart();
      setTimeout(() => simulation.alphaTarget(0), 2000);
    });
  }

  const btnTour = document.getElementById('btn-tour');
  if (btnTour) btnTour.addEventListener('click', runTour);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const insp = document.getElementById('insp');
      if (insp && insp.classList.contains('open')) {
        closeInspector();
      }
    }
  });

  const ctrlCloseBtn = document.getElementById('btn-ctrl-close');
  if (ctrlCloseBtn) {
    ctrlCloseBtn.addEventListener('click', () => {
      if (ctrlPanel) ctrlPanel.classList.remove('open');
    });
  }

  const legendToggle = document.getElementById('legend-toggle');
  const legendBody   = document.getElementById('legend-body');
  const legendChevron= document.getElementById('legend-chevron');
  if (legendToggle && legendBody) {
    legendToggle.addEventListener('click', () => {
      const collapsed = legendBody.classList.toggle('collapsed');
      if (legendChevron) legendChevron.classList.toggle('up', !collapsed);
    });
  }

  document.querySelectorAll('.leg-row[data-domain]').forEach(row => {
    row.addEventListener('mouseenter', () => {
      if (graphData) highlightDomain(row.dataset.domain);
    });
    row.addEventListener('mouseleave', () => clearHighlight());
  });

  const dismissBtn = document.getElementById('live-empty-dismiss');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      const overlay = document.getElementById('live-empty-state');
      if (overlay) overlay.style.display = 'none';
    });
  }

  const btnClose = document.getElementById('btn-close');
  if (btnClose) btnClose.addEventListener('click', closeInspector);

  const btnCopy = document.getElementById('btn-copy');
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      if (!selectedNode) return;
      const url = new URL(window.location.href);
      url.searchParams.set('node', selectedNode.id);
      const deepLink = url.toString();
      const label = document.getElementById('btn-copy-label');
      navigator.clipboard?.writeText(deepLink).then(() => {
        if (label) { label.textContent = '✓ Copied!'; }
        setTimeout(() => { if (label) label.textContent = 'Copy Link'; }, 2200);
      }).catch(() => {
        fallbackCopy(deepLink, btnCopy);
      });
    });
  }

  const btnView = document.getElementById('btn-view');
  if (btnView) {
    btnView.addEventListener('click', () => {
      if (selectedNode?.slug || selectedNode?.id) window.open(`notes/${selectedNode.slug || selectedNode.id}.html`, '_blank');
    });
  }

  const trophyModal = document.getElementById('trophy-modal');
  const btnTrophy = document.getElementById('btn-trophy-shelf');
  const btnTrophyClose = document.getElementById('btn-trophy-close');

  if (btnTrophy && trophyModal) {
    btnTrophy.addEventListener('click', () => {
      trophyModal.style.display = 'flex';
      if (graphData) updateTrophyShelfUI(graphData);
    });
  }

  if (btnTrophyClose && trophyModal) {
    btnTrophyClose.addEventListener('click', () => {
      trophyModal.style.display = 'none';
    });
  }

  if (trophyModal) {
    trophyModal.addEventListener('click', (e) => {
      if (e.target === trophyModal) {
        trophyModal.style.display = 'none';
      }
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && layoutMode === 'rings' && spinSpeed > 0 && !spinAnimId) {
      startRingSpin();
    }
  });

  if (typeof setupLibraryControls === 'function') {
    setupLibraryControls();
  }
});
