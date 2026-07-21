// ── Vizier Interactive D3 & Canvas Graph Engine ─────────────────────────────

const W = window.innerWidth, H = window.innerHeight;

// Apply default layout class on load
document.body.classList.add('rings-active');

// ── Canvas Setup ─────────────────────────────────────────────────────────────
const canvasEl = document.getElementById('graph-canvas');
const ctx = canvasEl ? canvasEl.getContext('2d') : null;

function resizeCanvas() {
  if (!canvasEl || !ctx) return;
  const dpr = window.devicePixelRatio || 1;
  canvasEl.width  = window.innerWidth  * dpr;
  canvasEl.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);
  if (graphData && graphData.nodes.length > 1500) drawCanvas();
}
if (canvasEl) {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
}

// ── SVG & D3 Zoom/Force ───────────────────────────────────────────────────────
const svg = d3.select('#graph-svg');
const G   = svg.append('g').attr('class', 'root');

const zoom = d3.zoom()
  .scaleExtent([0.1, 4.0]) // sane zoom limits
  .on('zoom', ev => {
    currentTransform = ev.transform;
    G.attr('transform', ev.transform);
    if (graphData && graphData.nodes.length > 1500) drawCanvas();
    updateLabels();
    
    // Parallax starfield shift
    const starfield = document.getElementById('starfield');
    if (starfield) {
      const px = -ev.transform.x * 0.12;
      const py = -ev.transform.y * 0.12;
      starfield.style.backgroundPosition = `${px}px ${py}px`;
    }
  });
svg.call(zoom);
zoom.translateTo(svg, W / 2, H / 2);

const simulation = d3.forceSimulation()
  .force('link',      d3.forceLink().id(d => d.id).distance(linkDistance))
  .force('charge',    d3.forceManyBody().strength(-150)) // gentler force settle
  .force('center',    d3.forceCenter(W / 2, H / 2))
  .force('collision', d3.forceCollide().radius(d => getR(d) + 5))
  .velocityDecay(0.6); // gentle force settle

function getR(d) {
  let sizeMultiplier = 1.0;
  if (layoutMode === 'rings') {
    const ringOrder = ['center', ...domainsOrdered, 'milestones'];
    const ringIndex = ringOrder.indexOf(d.ring || 'foundations');
    if (ringIndex !== -1) {
      sizeMultiplier = 1.25 - (ringIndex * 0.035);
    }
  }
  
  let baseR = baseNodeSize * 0.8;
  if (d.type === 'center')      baseR = baseNodeSize * 2.2;
  else if (d.type === 'domain')      baseR = baseNodeSize * 1.5;
  else if (d.type === 'milestone')   baseR = baseNodeSize * 1.4;
  else if (d.type === 'capstone')    baseR = baseNodeSize * 1.15;
  else if (d.type === 'synthesis')   baseR = baseNodeSize * 1.0;
  else if (d.type === 'deep-dive')   baseR = baseNodeSize * 0.95;
  else if (d.type === 'build')       baseR = baseNodeSize * 0.9;
  else if (d.type === 'concept')     baseR = baseNodeSize * 0.85;
  else if (d.type === 'frontier')    baseR = baseNodeSize * 0.95;
  
  return baseR * sizeMultiplier;
}

// ── Graph Renderer ────────────────────────────────────────────────────────────
function renderGraph() {
  G.selectAll('*').remove();
  if (spinAnimId) { cancelAnimationFrame(spinAnimId); spinAnimId = null; }

  const nodes = graphData.nodes;
  const edges = graphData.edges;

  const useCanvas = nodes.length > 1500;
  d3.select('#graph-canvas').style('display', useCanvas ? 'block' : 'none');

  // Build adjacency for connection count
  const connCount = {};
  for (const e of edges) {
    connCount[e.source.id ?? e.source] = (connCount[e.source.id ?? e.source] || 0) + 1;
    connCount[e.target.id ?? e.target] = (connCount[e.target.id ?? e.target] || 0) + 1;
  }
  nodes.forEach(n => { n._conn = connCount[n.id] || 0; });

  if (layoutMode === 'rings') {
    assignRingPositions(nodes);
  }

  // ── Ring guides (color-coded per domain) ──────────────────────────────────
  if (layoutMode === 'rings') {
    document.getElementById('graph-svg').closest('body')?.classList.add('rings-active');
    const rg = G.append('g').attr('class', 'ring-guides').attr('transform', `translate(${W/2},${H/2})`);
    
    function hexToRgba(hex, alpha) {
      const r = parseInt(hex.slice(1,3), 16);
      const g = parseInt(hex.slice(3,5), 16);
      const b = parseInt(hex.slice(5,7), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }
    
    domainsOrdered.forEach((dom, index) => {
      const r = ringRadii[dom];
      const color = domainColors[dom] || '#2a7f7f';
      const lbl = `${(index + 1).toString().padStart(2, '0')} ${dom.toUpperCase().replace(/-/g, ' ')}`;

      const prevR = index === 0 ? 80 : ringRadii[domainsOrdered[index - 1]];
      const bandWidth = r - prevR;
      rg.append('circle')
        .attr('class', `ring-guide-band ring-guide-band-${dom}`)
        .attr('r', prevR + bandWidth / 2)
        .attr('fill', 'none')
        .attr('stroke', hexToRgba(color, 0.04))
        .attr('stroke-width', bandWidth);

      rg.append('circle')
        .attr('class', `ring-guide ring-guide-animated ring-guide-${dom}`)
        .attr('r', r)
        .attr('stroke', color)
        .attr('stroke-opacity', 0.32)
        .attr('stroke-dasharray', '4,7')
        .style('animation-delay', `${index * 0.7}s`);

      const LABEL_ANGLE = -Math.PI / 4;
      const tx = (r + 10) * Math.cos(LABEL_ANGLE);
      const ty = (r + 10) * Math.sin(LABEL_ANGLE);

      rg.append('circle')
        .attr('class', `ring-tick ring-tick-${dom}`)
        .attr('r', 2.5)
        .attr('cx', tx)
        .attr('cy', ty)
        .attr('fill', color)
        .attr('fill-opacity', 0.8)
        .attr('filter', 'url(#ring-glow)');

      rg.append('text')
        .attr('class', `ring-label ring-label-${dom}`)
        .attr('x', tx + 8)
        .attr('y', ty + 3)
        .attr('text-anchor', 'start')
        .attr('fill', color)
        .attr('fill-opacity', 0.82)
        .text(lbl);
    });

    const msR = ringRadii.milestones;
    const msColor = '#f687b3';
    const prevR = ringRadii['frontier-capstone'];
    const bandWidth = msR - prevR;
    rg.append('circle')
      .attr('class', 'ring-guide-band ring-guide-band-milestones')
      .attr('r', prevR + bandWidth / 2)
      .attr('fill', 'none')
      .attr('stroke', hexToRgba(msColor, 0.04))
      .attr('stroke-width', bandWidth);
    rg.append('circle')
      .attr('class', 'ring-guide ring-guide-animated ring-guide-milestones')
      .attr('r', msR)
      .attr('stroke', msColor)
      .attr('stroke-opacity', 0.28)
      .attr('stroke-dasharray', '4,7')
      .style('animation-delay', '7s');
    const LABEL_ANGLE = -Math.PI / 4;
    const msTx = (msR + 10) * Math.cos(LABEL_ANGLE);
    const msTy = (msR + 10) * Math.sin(LABEL_ANGLE);
    rg.append('circle')
      .attr('class', 'ring-tick ring-tick-milestones')
      .attr('r', 2.5).attr('cx', msTx).attr('cy', msTy)
      .attr('fill', msColor).attr('fill-opacity', 0.8)
      .attr('filter', 'url(#ring-glow)');
    rg.append('text')
      .attr('class', 'ring-label ring-label-milestones')
      .attr('x', msTx + 8).attr('y', msTy + 3)
      .attr('text-anchor', 'start')
      .attr('fill', msColor)
      .attr('fill-opacity', 0.82)
      .text('11 MILESTONES');
  } else {
    document.getElementById('graph-svg').closest('body')?.classList.remove('rings-active');
  }

  // ── Links ─────────────────────────────────────────────────────────────────
  linkSel = G.append('g').attr('class', 'links')
    .selectAll('line')
    .data(edges)
    .join('line')
    .attr('class', d => {
      const srcNode = nodes.find(n => n.id === (d.source.id ?? d.source));
      const tgtNode = nodes.find(n => n.id === (d.target.id ?? d.target));
      const isLitLit = srcNode && tgtNode && srcNode.status === 'lit' && tgtNode.status === 'lit';
      const isGhostEdge = (srcNode && srcNode.status === 'ghost') || (tgtNode && tgtNode.status === 'ghost');
      
      let classes = 'link';
      if (d.type === 'wiki-link') classes += ' wiki-link';
      else if (isLitLit) classes += ' lit-lit';
      else if (isGhostEdge) classes += ' ghost-edge';
      return classes;
    })
    .attr('stroke', d => d.type === 'wiki-link' ? '#ff9f43' : '#2a7f7f');

  // ── Nodes ─────────────────────────────────────────────────────────────────
  nodeSel = G.append('g').attr('class', 'nodes')
    .selectAll('.node')
    .data(nodes, d => d.id)
    .join('g')
    .attr('class', d => {
      const dDate = new Date();
      const todayStr = `${dDate.getFullYear()}-${String(dDate.getMonth() + 1).padStart(2, '0')}-${String(dDate.getDate()).padStart(2, '0')}`;
      const isTouchedToday = d.completed === todayStr || (d.started === todayStr && (d.status === 'charging' || d.status === 'lit'));
      return `node ${d.type} ${d.status || 'ghost'} ${isTouchedToday ? 'touched-today' : ''}`;
    })
    .style('--node-glow', d => nodeColor(d))
    .on('mouseover', onNodeHover)
    .on('mouseout',  onNodeOut)
    .on('click',     onNodeClick);

  nodeSel.each(function(d) {
    const el = d3.select(this);
    const content = el.append('g').attr('class', 'node-content');
    const r = getR(d);
    const color = nodeColor(d);

    // 1. Vector Halo Aura (replaces CSS drop-shadow, eliminates square bounding box artifacts)
    if (d.status === 'charging' || d.status === 'lit' || d.type === 'center' || d.type === 'domain' || d.type === 'milestone') {
      content.append('circle')
        .attr('class', 'node-halo')
        .attr('r', r * (d.status === 'lit' ? 2.0 : 1.55))
        .attr('fill', color)
        .attr('opacity', d.status === 'lit' ? 0.24 : 0.09)
        .attr('pointer-events', 'none');
    }

    // 2. Premium Charging Orbit Rings (rotating dashed ring & pulsing aura)
    if (d.status === 'charging') {
      content.append('circle')
        .attr('class', 'charging-ring-dash')
        .attr('r', r * 1.55)
        .attr('fill', 'none')
        .attr('stroke', '#f6ad55')
        .attr('stroke-width', 1.2)
        .attr('stroke-dasharray', '3,3')
        .attr('opacity', 0.85);

      content.append('circle')
        .attr('class', 'charging-ring-pulse')
        .attr('r', r * 1.25)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(246, 173, 85, 0.45)')
        .attr('stroke-width', 0.8)
        .attr('opacity', 0.6);
    }

    // 3. Core Node Geometries
    if (d.type === 'milestone') {
      const hexRadius = r;
      const hx = hexRadius * 0.866;
      const hy = hexRadius * 0.5;
      const points = `0,-${hexRadius} ${hx},-${hy} ${hx},${hy} 0,${hexRadius} -${hx},${hy} -${hx},-${hy}`;
      
      content.append('polygon')
        .attr('class', 'node-core')
        .attr('points', points)
        .attr('fill', 'rgba(10, 15, 22, 0.95)')
        .attr('stroke', color)
        .attr('stroke-width', 2.0);
    } else if (d.type === 'capstone') {
      content.append('circle')
        .attr('class', 'node-core-ring')
        .attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 1.8);
      content.append('circle')
        .attr('class', 'node-core')
        .attr('r', r * 0.6)
        .attr('fill', color)
        .attr('stroke', 'none');
    } else if (d.type === 'domain') {
      content.append('circle')
        .attr('class', 'node-core-ring')
        .attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 1.8);
      content.append('circle')
        .attr('class', 'node-core')
        .attr('r', r * 0.4)
        .attr('fill', color)
        .attr('stroke', 'none');
    } else {
      content.append('circle')
        .attr('class', 'node-core')
        .attr('r', r)
        .attr('fill', color)
        .attr('stroke', d.type === 'center' ? 'rgba(62,226,226,.6)' : (d.status === 'charging' ? '#f6ad55' : 'rgba(255,255,255,.2)'))
        .attr('stroke-width', d.type === 'center' ? 2 : (d.status === 'charging' ? 1.5 : 1));
      
      // Inner glowing core pin-point for charging & lit nodes
      if (d.status === 'charging' || d.status === 'lit') {
        content.append('circle')
          .attr('class', 'node-center-pin')
          .attr('r', r * 0.38)
          .attr('fill', d.status === 'lit' ? '#ffffff' : '#fff5e6')
          .attr('opacity', 0.95);
      }
    }
  });

  // ── Labels ──────────────────────────────────────────────────────────────
  labelSel = G.append('g').attr('class', 'labels')
    .selectAll('text')
    .data(nodes, d => d.id)
    .join('text')
    .attr('class', 'node-label')
    .attr('dy', d => getR(d) + 12)
    .text(d => truncLabel(d.label, d.type));

  if (layoutMode === 'rings') {
    positionRings();
    buildSpinCache(nodes);
    startRingSpin();
    updateNebulae();
  } else {
    runForce(nodes, edges);
  }

  runIgnitionAnimation();
  updateLabels();
  applyStartHereGlow();
}

function truncLabel(label, type) {
  if (type === 'center' || type === 'domain') return label;
  return label.length > 22 ? label.slice(0, 20) + '...' : label;
}

// ── Visual Elevation Helpers ──────────────────────────────────────────────────
let frameCount = 0;
let lastFpsUpdate = 0;
function updateFps(timestamp) {
  frameCount++;
  if (!lastFpsUpdate) lastFpsUpdate = timestamp;
  if (timestamp - lastFpsUpdate >= 1000) {
    const fps = Math.round((frameCount * 1000) / (timestamp - lastFpsUpdate));
    const fpsEl = document.getElementById('st-fps');
    if (fpsEl) fpsEl.textContent = fps;
    frameCount = 0;
    lastFpsUpdate = timestamp;
  }
}

function initStarfield() {
  const container = document.getElementById('starfield');
  if (!container) return;
  container.innerHTML = '';
  const starCount = 130;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 1.6 + 0.5;
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const duration = Math.random() * 5 + 3;
    const minOpacity = Math.random() * 0.15;
    const maxOpacity = Math.random() * 0.5 + 0.3;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${top}%`;
    star.style.left = `${left}%`;
    star.style.setProperty('--twinkle-duration', `${duration}s`);
    star.style.setProperty('--star-min-opacity', minOpacity);
    star.style.setProperty('--star-max-opacity', maxOpacity);
    container.appendChild(star);
  }
}

function runIgnitionAnimation() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReduced) return;

  const litNodes = graphData.nodes.filter(n => n.status === 'lit' && n.completed);
  litNodes.sort((a, b) => new Date(a.completed) - new Date(b.completed));

  nodeSel.each(function(d) {
    if (d.status === 'lit' && d.type !== 'center' && d.type !== 'domain') {
      const litIndex = litNodes.findIndex(n => n.id === d.id);
      if (litIndex !== -1) {
        const delay = (litIndex / Math.max(1, litNodes.length)) * 2200;
        const content = d3.select(this).select('.node-content');
        content
          .style('opacity', 0)
          .style('transform', 'scale(0.1)')
          .transition()
          .delay(delay)
          .duration(550)
          .ease(d3.easeBackOut)
          .style('opacity', 1)
          .style('transform', 'scale(1)');
      }
    }
  });
}

function updateNebulae() {
  const nebGroup = G.select('.nebulae-layer');
  if (nebGroup.empty()) return;
  
  if (layoutMode !== 'force' || !graphData) {
    nebGroup.selectAll('*').remove();
    return;
  }

  const centroids = {};
  graphData.nodes.forEach(n => {
    if (n.domain && n.type !== 'center' && n.x !== undefined && n.y !== undefined) {
      if (!centroids[n.domain]) centroids[n.domain] = { sumX: 0, sumY: 0, count: 0 };
      centroids[n.domain].sumX += n.x;
      centroids[n.domain].sumY += n.y;
      centroids[n.domain].count++;
    }
  });

  const nebData = Object.entries(centroids).map(([domain, data]) => ({
    domain,
    x: data.sumX / data.count,
    y: data.sumY / data.count,
    color: domainColors[domain] || '#2a7f7f'
  }));

  nebGroup.selectAll('circle.neb-outer')
    .data(nebData, d => d.domain)
    .join(
      enter => enter.append('circle').attr('class', 'neb-outer')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 240)
        .attr('fill', d => d.color)
        .attr('opacity', 0)
        .attr('filter', 'url(#nebula-blur)')
        .call(enter => enter.transition().duration(1000).attr('opacity', 0.11)),
      update => update.attr('cx', d => d.x).attr('cy', d => d.y),
      exit => exit.transition().duration(600).attr('opacity', 0).remove()
    );

  nebGroup.selectAll('circle.neb-inner')
    .data(nebData, d => `inner-${d.domain}`)
    .join(
      enter => enter.append('circle').attr('class', 'neb-inner')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 90)
        .attr('fill', d => d.color)
        .attr('opacity', 0)
        .attr('filter', 'url(#ring-glow)')
        .call(enter => enter.transition().duration(1000).attr('opacity', 0.18)),
      update => update.attr('cx', d => d.x).attr('cy', d => d.y),
      exit => exit.transition().duration(600).attr('opacity', 0).remove()
    );
}

// ── RINGS positioning ─────────────────────────────────────────────────────────
function assignRingPositions(nodes) {
  const cx = W / 2, cy = H / 2;

  const byRing = {};
  for (const n of nodes) {
    const r = n.ring || 'foundations';
    if (!byRing[r]) byRing[r] = [];
    byRing[r].push(n);
  }

  const center = byRing.center || [];
  center.forEach(n => { n.x = cx; n.y = cy; n.fx = cx; n.fy = cy; });

  domainsOrdered.forEach(dom => {
    const domNodes = byRing[dom] || [];
    if (domNodes.length === 0) return;

    const guides = domNodes.filter(n => n.type === 'domain');
    const normalNodes = domNodes.filter(n => n.type !== 'domain');
    const radius = ringRadii[dom];

    if (guides[0]) {
      const g = guides[0];
      const angle = -Math.PI / 2;
      g.x = cx + radius * Math.cos(angle);
      g.y = cy + radius * Math.sin(angle);
      g.fx = g.x;
      g.fy = g.y;
      g._angle = angle;
      g._radius = radius;
    }

    normalNodes.forEach((n, i) => {
      const startAngle = -Math.PI / 2 + 0.15;
      const angle = startAngle + (2 * Math.PI * (i + 1)) / (normalNodes.length + 1);
      const radiusVar = radius + ((i % 2) ? 6 : -6);
      n.x = cx + radiusVar * Math.cos(angle);
      n.y = cy + radiusVar * Math.sin(angle);
      n.fx = n.x;
      n.fy = n.y;
      n._angle = angle;
      n._radius = radiusVar;
    });
  });

  const outerRings = ['milestones', 'skills', 'routines', 'applications'];
  outerRings.forEach(r => {
    const rNodes = byRing[r] || [];
    if (rNodes.length === 0) return;
    const radius = ringRadii[r] || 920;
    rNodes.forEach((n, i) => {
      const angle = (2 * Math.PI * i) / rNodes.length;
      n.x = cx + radius * Math.cos(angle);
      n.y = cy + radius * Math.sin(angle);
      n.fx = n.x;
      n.fy = n.y;
      n._angle = angle;
      n._radius = radius;
    });
  });
}

function positionRings() {
  nodeSel.attr('transform', d => `translate(${d.x},${d.y})`);
  
  const cx = W / 2, cy = H / 2;
  labelSel
    .attr('x', d => {
      if (d.type === 'center') return d.x;
      const dx = d.x - cx;
      const dy = d.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const cosVal = dx / dist;
      return d.x + (getR(d) + 10) * cosVal;
    })
    .attr('y', d => {
      if (d.type === 'center') return d.y;
      const dx = d.x - cx;
      const dy = d.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const sinVal = dy / dist;
      return d.y + (getR(d) + 10) * sinVal;
    })
    .attr('text-anchor', d => {
      if (d.type === 'center') return 'middle';
      const dx = d.x - cx;
      const dy = d.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const cosVal = dx / dist;
      if (cosVal > 0.17) return 'start';
      if (cosVal < -0.17) return 'end';
      return 'middle';
    })
    .attr('dy', d => {
      if (d.type === 'center') return getR(d) + 12;
      return '0.35em';
    });

  linkSel
    .attr('x1', d => (d.source.x ?? 0))
    .attr('y1', d => (d.source.y ?? 0))
    .attr('x2', d => (d.target.x ?? 0))
    .attr('y2', d => (d.target.y ?? 0));
}

let _spinNodes = [];

function buildSpinCache(nodes) {
  const ringOrder = ['center', ...domainsOrdered, 'milestones', 'skills', 'routines', 'applications'];
  _spinNodes = nodes
    .filter(n => n._angle !== undefined && n.ring !== 'center')
    .map(n => {
      const ri = ringOrder.indexOf(n.ring || 'foundations');
      return {
        d: n,
        dir: (ri % 2 === 0) ? 1 : -1,
        speedMult: 1.0 + (ri * 0.05)
      };
    });
}

function startRingSpin() {
  if (spinSpeed === 0) return;
  const cx = W / 2, cy = H / 2;

  function tick(timestamp) {
    if (document.hidden) {
      spinAnimId = requestAnimationFrame(tick);
      return;
    }

    updateFps(timestamp);
    ringSpin += spinSpeed * 0.0003;

    for (let i = 0; i < _spinNodes.length; i++) {
      const { d, dir, speedMult } = _spinNodes[i];
      const angle = d._angle + ringSpin * dir * speedMult;
      d.x = cx + d._radius * Math.cos(angle);
      d.y = cy + d._radius * Math.sin(angle);
    }

    nodeSel.attr('transform', d => `translate(${d.x},${d.y})`);
    labelSel
      .attr('x', d => {
        if (d.type === 'center') return d.x;
        const dx = d.x - cx, dy = d.y - cy;
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
        return d.x + (getR(d) + 10) * (dx / dist);
      })
      .attr('y', d => {
        if (d.type === 'center') return d.y;
        const dx = d.x - cx, dy = d.y - cy;
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
        return d.y + (getR(d) + 10) * (dy / dist);
      });

    linkSel
      .attr('x1', d => d.source.x ?? 0)
      .attr('y1', d => d.source.y ?? 0)
      .attr('x2', d => d.target.x ?? 0)
      .attr('y2', d => d.target.y ?? 0);

    spinAnimId = requestAnimationFrame(tick);
  }
  spinAnimId = requestAnimationFrame(tick);
}

function runForce(nodes, edges) {
  nodes.forEach(n => { n.fx = null; n.fy = null; });
  simulation.nodes(nodes);
  simulation.force('link').links(edges).distance(linkDistance);
  simulation.alpha(1).restart();

  simulation.on('tick', () => {
    updateFps(performance.now());
    linkSel
      .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
    nodeSel.attr('transform', d => `translate(${d.x},${d.y})`);
    labelSel
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('text-anchor', 'middle')
      .attr('dy', d => getR(d) + 12);
    updateNebulae();
  });
}

function drawCanvas() {
  if (!ctx || !canvasEl) return;
  const { k, x, y } = currentTransform;
  ctx.clearRect(0, 0, canvasEl.width / (window.devicePixelRatio || 1), canvasEl.height / (window.devicePixelRatio || 1));
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);

  if (graphData) {
    for (const e of graphData.edges) {
      const s = e.source, t = e.target;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(t.x, t.y);
      ctx.strokeStyle = 'rgba(42,127,127,0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    for (const n of graphData.nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, getR(n), 0, Math.PI * 2);
      ctx.fillStyle = nodeColor(n);
      ctx.fill();
    }
  }
  ctx.restore();
}

// ── Node Interactions ─────────────────────────────────────────────────────────
function onNodeHover(event, d) {
  hoveredNode = d;
  const tt = document.getElementById('tooltip');
  if (!tt) return;
  document.getElementById('tt-title').textContent = d.label;
  document.getElementById('tt-domain').innerHTML = d.domain ? `Domain: <span>${d.domain}</span>` : '';
  document.getElementById('tt-type').innerHTML   = `Type: <span>${d.type}</span>`;
  document.getElementById('tt-conn').innerHTML   = `Connections: <span>${d._conn || 0}</span>`;
  tt.style.display = 'block';

  if (d.type === 'domain' || (d.domain && d.type !== 'center')) {
    const domId = d.type === 'domain' ? (d.domain || d.id.replace('domain-', '')) : d.domain;
    highlightDomain(domId);
  }
}

function onNodeOut() {
  hoveredNode = null;
  const tt = document.getElementById('tooltip');
  if (tt) tt.style.display = 'none';
  clearHighlight();
}

document.addEventListener('mousemove', ev => {
  const tt = document.getElementById('tooltip');
  if (tt && tt.style.display === 'block') {
    tt.style.left = (ev.clientX + 14) + 'px';
    tt.style.top  = (ev.clientY + 14) + 'px';
  }
});

function highlightDomain(domId) {
  hoveredDomain = domId;
  nodeSel.classed('dimmed',      d => d.domain !== domId && d.type !== 'center' && !(d.type === 'domain'));
  nodeSel.classed('highlighted', d => d.domain === domId || d.id === `domain-${domId}`);
  linkSel.classed('dimmed',      () => true);
  linkSel.classed('highlighted', d => {
    const s = d.source.domain || d.source.id;
    const t = d.target.domain || d.target.id;
    return s === domId || t === domId;
  });

  if (layoutMode === 'rings') {
    G.selectAll('.ring-guide').classed('dimmed', true).classed('highlighted', false);
    G.selectAll('.ring-label').classed('dimmed', true).classed('highlighted', false);
    G.selectAll('.ring-tick').classed('dimmed', true).classed('highlighted', false);
    G.selectAll('.ring-guide-band').classed('dimmed', true);

    G.selectAll(`.ring-guide-${domId}`).classed('dimmed', false).classed('highlighted', true);
    G.selectAll(`.ring-label-${domId}`).classed('dimmed', false).classed('highlighted', true);
    G.selectAll(`.ring-tick-${domId}`).classed('dimmed', false).classed('highlighted', true);
    G.selectAll(`.ring-guide-band-${domId}`).classed('dimmed', false);
  }
}

function clearHighlight() {
  hoveredDomain = null;
  nodeSel.classed('dimmed highlighted', false);
  linkSel.classed('dimmed highlighted', false);

  if (layoutMode === 'rings') {
    G.selectAll('.ring-guide').classed('dimmed highlighted', false);
    G.selectAll('.ring-label').classed('dimmed highlighted', false);
    G.selectAll('.ring-tick').classed('dimmed highlighted', false);
    G.selectAll('.ring-guide-band').classed('dimmed', false);
  }
}

function onNodeClick(event, d) {
  if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
  selectedNode = d;
  if (typeof openInspector === 'function') openInspector(d);

  const ctrlPanel = document.getElementById('ctrl');
  if (ctrlPanel && window.innerWidth <= 768) {
    ctrlPanel.classList.remove('open');
  }

  const [tx, ty] = [d.x || W/2, d.y || H/2];
  const k = currentTransform.k;
  svg.transition().duration(600)
    .call(zoom.transform, d3.zoomIdentity.translate(W/2 - tx * k, H/2 - ty * k).scale(k));

  nodeSel.classed('pulsing', false);
  nodeSel.filter(n => n.id === d.id).classed('pulsing', true);

  const url = new URL(window.location);
  url.searchParams.set('node', d.id);
  window.history.replaceState({}, '', url);

  if (d.type === 'capstone' && d.status === 'lit' && typeof triggerCelebration === 'function') {
    triggerCelebration(nodeColor(d));
  }
}

function closeInspector() {
  const insp = document.getElementById('insp');
  if (insp) insp.classList.remove('open');
  const sp = document.getElementById('search-panel');
  if (sp) sp.style.display = 'flex';
  nodeSel.classed('pulsing', false);
  selectedNode = null;
  clearHighlight();

  const url = new URL(window.location);
  url.searchParams.delete('node');
  window.history.replaceState({}, '', url);
}

svg.on('click', () => {
  closeInspector();
});

function getLabelVisibility(d, mode, k) {
  if (mode === 'none') return false;
  
  const isCore = d.type === 'center' || d.type === 'domain';
  const isMilestone = d.type === 'milestone';
  const isMid = d.type === 'capstone' || d.type === 'synthesis';
  
  if (mode === 'main') {
    return isCore;
  }
  
  if (mode === 'smart') {
    if (k < 0.6) {
      return d.type === 'center';
    } else if (k < 1.3) {
      return isCore;
    } else if (k < 2.2) {
      return isCore || isMilestone;
    } else if (k < 3.2) {
      return isCore || isMilestone || isMid;
    } else {
      return true;
    }
  }
  
  if (k < 0.35) {
    return isCore;
  } else if (k < 0.65) {
    return isCore || isMilestone;
  } else {
    return true;
  }
}

function updateLabels() {
  if (!labelSel || labelSel.empty()) return;
  const k = currentTransform.k;
  labelSel.style('display', d => getLabelVisibility(d, labelsMode, k) ? '' : 'none');
}

function applyStartHereGlow() {
  if (!graphData) return;
  const startNode = graphData.nodes.find(n => n.id === 'map-of-ai');
  if (!startNode || startNode.status === 'lit') return;

  const startNodeG = nodeSel.filter(n => n.id === 'map-of-ai');
  startNodeG.classed('start-here', true);

  const existing = startNodeG.select('.start-here-label');
  if (!existing.empty()) return;
  startNodeG.append('text')
    .attr('class', 'start-here-label')
    .attr('x', 0)
    .attr('y', -getR(startNode) - 14)
    .attr('text-anchor', 'middle')
    .attr('fill', '#f6ad55')
    .attr('font-size', '8px')
    .attr('font-weight', '700')
    .attr('letter-spacing', '0.1em')
    .attr('pointer-events', 'none')
    .attr('paint-order', 'stroke fill')
    .attr('stroke', '#07090c')
    .attr('stroke-width', '3px')
    .text('▶ START HERE');
}

// ── TOUR Mode ─────────────────────────────────────────────────────────────────
let isTourRunning = false;
function runTour() {
  if (isTourRunning) return;
  isTourRunning = true;
  
  const tourBtn = document.getElementById('btn-tour');
  if (tourBtn) {
    tourBtn.classList.add('on');
    tourBtn.innerHTML = `
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      PLAYING
    `;
  }

  svg.transition().duration(4000).ease(d3.easeCubicInOut)
    .call(zoom.transform, d3.zoomIdentity.translate(W/2 - (W/2)*0.35, H/2 - (H/2)*0.35).scale(0.35))
    .transition().delay(1000).duration(5000).ease(d3.easeCubicInOut)
    .on('start', () => {
      const fNode = graphData?.nodes.find(n => n.ring === 'foundations' || n.domain === 'foundations');
      if (fNode) {
        const tx = fNode.x || W/2;
        const ty = fNode.y || H/2;
        svg.transition().duration(5000).ease(d3.easeCubicInOut)
          .call(zoom.transform, d3.zoomIdentity.translate(W/2 - tx*1.65, H/2 - ty*1.65).scale(1.65));
      }
    })
    .transition().delay(5000).duration(5000).ease(d3.easeCubicInOut)
    .on('start', () => {
      const targetNode = graphData?.nodes.find(n => n.ring === 'rag-retrieval' || n.domain === 'rag-retrieval');
      if (targetNode) {
        const tx = targetNode.x || W/2;
        const ty = targetNode.y || H/2;
        svg.transition().duration(5000).ease(d3.easeCubicInOut)
          .call(zoom.transform, d3.zoomIdentity.translate(W/2 - tx*1.45, H/2 - ty*1.45).scale(1.45));
      }
    })
    .transition().delay(5000).duration(3500).ease(d3.easeCubicInOut)
    .on('start', () => {
      svg.transition().duration(3500).ease(d3.easeCubicInOut)
        .call(zoom.transform, d3.zoomIdentity)
        .on('end', () => {
          isTourRunning = false;
          if (tourBtn) {
            tourBtn.classList.remove('on');
            tourBtn.innerHTML = `
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              TOUR
            `;
          }
        });
    });
}
