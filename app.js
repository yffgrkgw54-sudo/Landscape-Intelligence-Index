// Landscape Intelligence Network - Application Logic
// D3.js Force-Directed Network Visualization

// State
let currentView = 'network';
let selectedNode = null;
let filteredEntries = [...entries];
let simulation = null;
let svg = null;
let g = null;

// Filter state
const filters = {
    categories: new Set(Object.keys(CATEGORIES)),
    sources: new Set(Object.keys(SOURCES)),
    sphereInterfaces: new Set(SPHERE_INTERFACES),
    elementFunctions: new Set(ELEMENT_FUNCTIONS),
    indeterminacy: new Set(Object.keys(INDETERMINACY_POSITIONS)),
    temporalPhases: new Set(TEMPORAL_PHASES)
};

// Connection type visibility
const connectionVisibility = {
    thematic: true,
    sphere: false,
    element: false,
    indeterminacy: false,
    citation: true
};

// Color mode
let colorMode = 'category'; // 'category' | 'temporal'

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initVisualization();
    initEventListeners();
    updateStats();
});

// ===== INITIALIZATION =====

function initFilters() {
    // Category checkboxes
    const categoryContainer = document.getElementById('category-filters');
    if (categoryContainer) {
        Object.entries(CATEGORIES).forEach(([key, val]) => {
            const div = document.createElement('div');
            div.className = 'checkbox-item';
            div.innerHTML = `
                <input type="checkbox" id="cat-${key}" checked data-filter="category" data-value="${key}">
                <span class="color-dot" style="background: ${val.color}"></span>
                <span>${val.name}</span>
            `;
            categoryContainer.appendChild(div);
        });
    }

    // Source checkboxes
    const sourceContainer = document.getElementById('source-filters');
    if (sourceContainer) {
        Object.entries(SOURCES).forEach(([key, val]) => {
            const div = document.createElement('div');
            div.className = 'checkbox-item';
            div.innerHTML = `
                <input type="checkbox" id="src-${key}" checked data-filter="source" data-value="${key}">
                <span class="color-dot" style="background: ${val.color}"></span>
                <span>${val.name}</span>
            `;
            sourceContainer.appendChild(div);
        });
    }

    // Indeterminacy checkboxes
    const indeterminacyContainer = document.getElementById('indeterminacy-filters');
    if (indeterminacyContainer) {
        Object.entries(INDETERMINACY_POSITIONS).forEach(([key, val]) => {
            const div = document.createElement('div');
            div.className = 'checkbox-item';
            div.innerHTML = `
                <input type="checkbox" id="ind-${key}" checked data-filter="indeterminacy" data-value="${key}">
                <span class="color-dot" style="background: ${val.color}"></span>
                <span>${val.label}</span>
            `;
            indeterminacyContainer.appendChild(div);
        });
    }

    // Temporal phase checkboxes
    const temporalContainer = document.getElementById('temporal-filters');
    if (temporalContainer) {
        TEMPORAL_PHASES.forEach(phase => {
            const div = document.createElement('div');
            div.className = 'checkbox-item';
            div.innerHTML = `
                <input type="checkbox" id="temp-${phase}" checked data-filter="temporal" data-value="${phase}">
                <span>${phase.replace(/-/g, ' ')}</span>
            `;
            temporalContainer.appendChild(div);
        });
    }
}

function initEventListeners() {
    // Navigation tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const view = e.target.dataset.view;
            switchView(view);
        });
    });

    // Filter checkboxes
    document.querySelectorAll('[data-filter]').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });

    // Connection toggles
    document.querySelectorAll('[data-connection]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.target.dataset.connection;
            connectionVisibility[type] = !connectionVisibility[type];
            e.target.classList.toggle('active', connectionVisibility[type]);
            updateLinks();
        });
    });

    // Color mode
    document.querySelectorAll('[data-color-mode]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            colorMode = e.target.dataset.colorMode;
            document.querySelectorAll('[data-color-mode]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updateNodeColors();
        });
    });

    // Search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Reset filters
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }

    // Add entry button
    const addEntryBtn = document.getElementById('add-entry-btn');
    if (addEntryBtn) {
        addEntryBtn.addEventListener('click', showAddEntryModal);
    }

    // Modal close
    document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    // Detail panel close
    const detailClose = document.querySelector('.detail-close');
    if (detailClose) {
        detailClose.addEventListener('click', () => {
            document.querySelector('.detail-panel').classList.remove('visible');
            selectedNode = null;
            updateNodeSelection();
        });
    }

    // Add entry form
    const addEntryForm = document.getElementById('add-entry-form');
    if (addEntryForm) {
        addEntryForm.addEventListener('submit', handleAddEntry);
    }
}

// ===== VISUALIZATION =====

function initVisualization() {
    const container = document.getElementById('network-canvas');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    svg = d3.select('#network-canvas')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', [0, 0, width, height]);

    // Add zoom
    const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });

    svg.call(zoom);

    g = svg.append('g');

    // Build links
    const links = buildLinks(filteredEntries);

    // Initialize simulation
    simulation = d3.forceSimulation(filteredEntries)
        .force('link', d3.forceLink(links)
            .id(d => d.id)
            .distance(100)
            .strength(0.5))
        .force('charge', d3.forceManyBody()
            .strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(30));

    // Draw links
    const link = g.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('class', d => `link ${d.type}`)
        .attr('stroke-width', d => d.type === 'citation' ? 2 : 1);

    // Draw nodes
    const node = g.append('g')
        .attr('class', 'nodes')
        .selectAll('g')
        .data(filteredEntries)
        .join('g')
        .attr('class', d => `node ${d.isAnchor ? 'anchor' : ''}`)
        .call(drag(simulation));

    node.append('circle')
        .attr('r', d => d.isAnchor ? 12 : 8)
        .attr('fill', d => getNodeColor(d))
        .attr('stroke', d => d.isAnchor ? '#fff' : 'none');

    node.append('title')
        .text(d => d.title);

    // Node click
    node.on('click', (event, d) => {
        event.stopPropagation();
        selectNode(d);
    });

    // Double-click to center
    node.on('dblclick', (event, d) => {
        event.stopPropagation();
        centerOnNode(d);
    });

    // Background click to deselect
    svg.on('click', () => {
        selectedNode = null;
        document.querySelector('.detail-panel').classList.remove('visible');
        updateNodeSelection();
    });

    // Update positions
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
}

function buildLinks(nodes) {
    const links = [];
    const nodeIds = new Set(nodes.map(n => n.id));

    nodes.forEach(node => {
        // Citation/explicit connections
        if (node.connections) {
            node.connections.forEach(targetId => {
                if (nodeIds.has(targetId) && node.id < targetId) {
                    links.push({
                        source: node.id,
                        target: targetId,
                        type: 'citation'
                    });
                }
            });
        }

        // Thematic connections (same category)
        nodes.forEach(other => {
            if (node.id < other.id && node.category === other.category) {
                links.push({
                    source: node.id,
                    target: other.id,
                    type: 'thematic'
                });
            }
        });

        // Sphere interface connections
        nodes.forEach(other => {
            if (node.id < other.id && node.sphereInterface === other.sphereInterface && node.category !== other.category) {
                links.push({
                    source: node.id,
                    target: other.id,
                    type: 'sphere'
                });
            }
        });

        // Element function connections
        nodes.forEach(other => {
            if (node.id < other.id && node.elementFunction === other.elementFunction && node.category !== other.category) {
                links.push({
                    source: node.id,
                    target: other.id,
                    type: 'element'
                });
            }
        });

        // Indeterminacy connections
        nodes.forEach(other => {
            if (node.id < other.id && node.indeterminacy === other.indeterminacy && node.category !== other.category) {
                links.push({
                    source: node.id,
                    target: other.id,
                    type: 'indeterminacy'
                });
            }
        });
    });

    return links;
}

function getNodeColor(node) {
    if (colorMode === 'category') {
        return CATEGORIES[node.category]?.color || '#6b9eb8';
    } else if (colorMode === 'temporal') {
        // Map sortKey to color (logarithmic for deep time)
        const minKey = -4500000000;
        const maxKey = 2025;
        const logMin = Math.log10(Math.abs(minKey) + 1);
        const logMax = Math.log10(Math.abs(maxKey) + 1);
        
        let t;
        if (node.sortKey < 0) {
            const logVal = Math.log10(Math.abs(node.sortKey) + 1);
            t = 1 - (logVal / logMin);
        } else {
            t = 0.9 + (node.sortKey / maxKey) * 0.1;
        }
        
        return d3.interpolateBlues(1 - t);
    }
    return '#6b9eb8';
}

function updateNodeColors() {
    g.selectAll('.node circle')
        .transition()
        .duration(300)
        .attr('fill', d => getNodeColor(d));
}

function updateLinks() {
    g.selectAll('.link')
        .style('display', d => connectionVisibility[d.type] ? null : 'none');
}

function updateNodeSelection() {
    g.selectAll('.node')
        .classed('selected', d => selectedNode && d.id === selectedNode.id);
}

function drag(simulation) {
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
}

// ===== NODE SELECTION =====

function selectNode(node) {
    selectedNode = node;
    updateNodeSelection();
    showDetailPanel(node);
}

function showDetailPanel(node) {
    const panel = document.querySelector('.detail-panel');
    
    document.getElementById('detail-year').textContent = node.year;
    document.getElementById('detail-title').textContent = node.title;
    document.getElementById('detail-location').textContent = node.location;
    document.getElementById('detail-description').textContent = node.description;
    document.getElementById('detail-citation').textContent = node.citation;

    // Codes
    const codesContainer = document.getElementById('detail-codes');
    codesContainer.innerHTML = `
        <span class="code-tag category" style="background: ${CATEGORIES[node.category]?.color}">${CATEGORIES[node.category]?.name}</span>
        <span class="code-tag">${node.sphereInterface}</span>
        <span class="code-tag">${node.elementFunction}</span>
        <span class="code-tag">${node.indeterminacy}</span>
        <span class="code-tag">${node.temporalPhase}</span>
        <span class="code-tag">[${node.source}]</span>
    `;

    // Keywords
    const keywordsContainer = document.getElementById('detail-keywords');
    keywordsContainer.innerHTML = node.keywords.map(k => `<span class="keyword">${k}</span>`).join('');

    // Five criteria
    const criteriaContainer = document.getElementById('detail-criteria');
    if (criteriaContainer && node.fiveCriteria) {
        criteriaContainer.innerHTML = `
            <div class="criteria-item">Closure: ${node.fiveCriteria.closure}/5</div>
            <div class="criteria-item">Metabolic: ${node.fiveCriteria.metabolic}/5</div>
            <div class="criteria-item">Timescale: ${node.fiveCriteria.timescale}/5</div>
            <div class="criteria-item">Pattern: ${node.fiveCriteria.pattern}/5</div>
            <div class="criteria-item">Recognition: ${node.fiveCriteria.recognition}/5</div>
        `;
    }

    panel.classList.add('visible');
}

function centerOnNode(node) {
    const container = document.getElementById('network-canvas');
    const width = container.clientWidth;
    const height = container.clientHeight;

    const transform = d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(1.5)
        .translate(-node.x, -node.y);

    svg.transition()
        .duration(750)
        .call(d3.zoom().transform, transform);
}

// ===== FILTERING =====

function handleFilterChange(e) {
    const filterType = e.target.dataset.filter;
    const value = e.target.dataset.value;
    const checked = e.target.checked;

    switch (filterType) {
        case 'category':
            checked ? filters.categories.add(value) : filters.categories.delete(value);
            break;
        case 'source':
            checked ? filters.sources.add(value) : filters.sources.delete(value);
            break;
        case 'indeterminacy':
            checked ? filters.indeterminacy.add(value) : filters.indeterminacy.delete(value);
            break;
        case 'temporal':
            checked ? filters.temporalPhases.add(value) : filters.temporalPhases.delete(value);
            break;
    }

    applyFilters();
}

function applyFilters() {
    filteredEntries = entries.filter(entry => {
        return filters.categories.has(entry.category) &&
               filters.sources.has(entry.source) &&
               filters.indeterminacy.has(entry.indeterminacy) &&
               filters.temporalPhases.has(entry.temporalPhase);
    });

    updateVisualization();
    updateStats();
}

function resetFilters() {
    filters.categories = new Set(Object.keys(CATEGORIES));
    filters.sources = new Set(Object.keys(SOURCES));
    filters.indeterminacy = new Set(Object.keys(INDETERMINACY_POSITIONS));
    filters.temporalPhases = new Set(TEMPORAL_PHASES);

    document.querySelectorAll('[data-filter]').forEach(cb => {
        cb.checked = true;
    });

    applyFilters();
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();

    if (!query) {
        applyFilters();
        return;
    }

    filteredEntries = entries.filter(entry => {
        const searchText = `${entry.title} ${entry.description} ${entry.keywords.join(' ')} ${entry.location}`.toLowerCase();
        return searchText.includes(query) &&
               filters.categories.has(entry.category) &&
               filters.sources.has(entry.source);
    });

    updateVisualization();
    updateStats();
}

// ===== VIEW SWITCHING =====

function switchView(view) {
    currentView = view;

    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.view === view);
    });

    // Hide all view containers
    document.querySelectorAll('.viz-container, .timeline-container, .radial-container').forEach(el => {
        el.style.display = 'none';
    });

    switch (view) {
        case 'network':
            document.querySelector('.viz-container').style.display = 'block';
            break;
        case 'timeline':
            renderTimeline();
            document.querySelector('.timeline-container').style.display = 'block';
            break;
        case 'radial':
            renderRadial();
            document.querySelector('.radial-container').style.display = 'block';
            break;
    }
}

// ===== TIMELINE VIEW =====

function renderTimeline() {
    const container = document.querySelector('.timeline-content');
    if (!container) return;

    // Group by category
    const grouped = {};
    filteredEntries.forEach(entry => {
        const cat = CATEGORIES[entry.category]?.name || 'Other';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(entry);
    });

    // Sort each group by sortKey
    Object.values(grouped).forEach(arr => {
        arr.sort((a, b) => a.sortKey - b.sortKey);
    });

    // Render
    let html = '';
    Object.entries(grouped).forEach(([category, entries]) => {
        const catKey = Object.keys(CATEGORIES).find(k => CATEGORIES[k].name === category);
        const color = CATEGORIES[catKey]?.color || '#6b9eb8';
        
        html += `<div class="timeline-era">
            <h2 style="border-color: ${color}">${category}</h2>
            ${entries.map(entry => `
                <div class="timeline-entry" data-id="${entry.id}">
                    <div class="timeline-year">${entry.year}</div>
                    <div class="timeline-info">
                        <h3>${entry.title}</h3>
                        <p>${entry.description.substring(0, 150)}...</p>
                    </div>
                    <div class="timeline-category" style="background: ${color}">${entry.source}</div>
                </div>
            `).join('')}
        </div>`;
    });

    container.innerHTML = html;

    // Add click handlers
    container.querySelectorAll('.timeline-entry').forEach(el => {
        el.addEventListener('click', () => {
            const id = parseInt(el.dataset.id);
            const entry = entries.find(e => e.id === id);
            if (entry) showDetailPanel(entry);
        });
    });
}

// ===== RADIAL VIEW =====

function renderRadial() {
    const container = document.getElementById('radial-canvas');
    if (!container) return;

    container.innerHTML = '';

    const width = container.clientWidth;
    const height = container.clientHeight;
    const radius = Math.min(width, height) / 2 - 100;

    const svg = d3.select('#radial-canvas')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', [0, 0, width, height]);

    const g = svg.append('g')
        .attr('transform', `translate(${width/2},${height/2})`);

    // Group by category
    const categories = Object.keys(CATEGORIES);
    const angleStep = (2 * Math.PI) / categories.length;

    categories.forEach((cat, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const catEntries = filteredEntries.filter(e => e.category === cat);
        const color = CATEGORIES[cat].color;

        // Category label
        const labelRadius = radius + 40;
        g.append('text')
            .attr('x', Math.cos(angle) * labelRadius)
            .attr('y', Math.sin(angle) * labelRadius)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .style('font-family', 'var(--font-mono)')
            .style('font-size', '10px')
            .style('fill', color)
            .text(CATEGORIES[cat].name);

        // Nodes
        catEntries.forEach((entry, j) => {
            const nodeRadius = radius * (0.3 + 0.7 * (j / Math.max(catEntries.length, 1)));
            const x = Math.cos(angle) * nodeRadius;
            const y = Math.sin(angle) * nodeRadius;

            g.append('circle')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', entry.isAnchor ? 10 : 6)
                .attr('fill', color)
                .attr('stroke', entry.isAnchor ? '#fff' : 'none')
                .attr('stroke-width', 2)
                .style('cursor', 'pointer')
                .on('click', () => showDetailPanel(entry))
                .append('title')
                .text(entry.title);
        });
    });
}

// ===== UPDATE VISUALIZATION =====

function updateVisualization() {
    if (currentView === 'network') {
        // Clear and rebuild
        g.selectAll('*').remove();
        
        const links = buildLinks(filteredEntries);
        
        // Rebuild simulation
        simulation.nodes(filteredEntries);
        simulation.force('link').links(links);
        simulation.alpha(1).restart();

        // Draw links
        g.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('class', d => `link ${d.type}`)
            .attr('stroke-width', d => d.type === 'citation' ? 2 : 1)
            .style('display', d => connectionVisibility[d.type] ? null : 'none');

        // Draw nodes
        const node = g.append('g')
            .attr('class', 'nodes')
            .selectAll('g')
            .data(filteredEntries)
            .join('g')
            .attr('class', d => `node ${d.isAnchor ? 'anchor' : ''}`)
            .call(drag(simulation));

        node.append('circle')
            .attr('r', d => d.isAnchor ? 12 : 8)
            .attr('fill', d => getNodeColor(d))
            .attr('stroke', d => d.isAnchor ? '#fff' : 'none');

        node.append('title')
            .text(d => d.title);

        node.on('click', (event, d) => {
            event.stopPropagation();
            selectNode(d);
        });

        node.on('dblclick', (event, d) => {
            event.stopPropagation();
            centerOnNode(d);
        });

        simulation.on('tick', () => {
            g.selectAll('.link')
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            g.selectAll('.node')
                .attr('transform', d => `translate(${d.x},${d.y})`);
        });
    } else if (currentView === 'timeline') {
        renderTimeline();
    } else if (currentView === 'radial') {
        renderRadial();
    }
}

// ===== STATS =====

function updateStats() {
    const totalEl = document.getElementById('stat-total');
    const visibleEl = document.getElementById('stat-visible');
    const anchorsEl = document.getElementById('stat-anchors');

    if (totalEl) totalEl.textContent = entries.length;
    if (visibleEl) visibleEl.textContent = filteredEntries.length;
    if (anchorsEl) anchorsEl.textContent = filteredEntries.filter(e => e.isAnchor).length;
}

// ===== ADD ENTRY MODAL =====

function showAddEntryModal() {
    document.getElementById('add-entry-modal').classList.add('visible');
}

function closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => {
        m.classList.remove('visible');
    });
}

function handleAddEntry(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    const newEntry = {
        id: entries.length + 1,
        year: formData.get('year'),
        sortKey: parseFloat(formData.get('sortKey')) || new Date().getFullYear(),
        location: formData.get('location'),
        title: formData.get('title'),
        description: formData.get('description'),
        keywords: formData.get('keywords').split(',').map(k => k.trim()),
        citation: formData.get('citation'),
        category: formData.get('category'),
        source: 'LI',
        sphereInterface: formData.get('sphereInterface'),
        elementFunction: formData.get('elementFunction'),
        indeterminacy: formData.get('indeterminacy'),
        fiveCriteria: {
            closure: parseInt(formData.get('closure')) || 3,
            metabolic: parseInt(formData.get('metabolic')) || 3,
            timescale: parseInt(formData.get('timescale')) || 3,
            pattern: parseInt(formData.get('pattern')) || 3,
            recognition: parseInt(formData.get('recognition')) || 3
        },
        temporalPhase: formData.get('temporalPhase'),
        isAnchor: formData.get('isAnchor') === 'on',
        connections: []
    };

    entries.push(newEntry);
    filteredEntries = [...entries];
    
    closeModals();
    e.target.reset();
    applyFilters();
}

// ===== EXPORT =====

function exportData() {
    const csv = [
        ['ID', 'Year', 'Title', 'Location', 'Category', 'Source', 'Sphere Interface', 'Element Function', 'Indeterminacy', 'Temporal Phase', 'Is Anchor', 'Description', 'Citation'].join(','),
        ...entries.map(e => [
            e.id,
            `"${e.year}"`,
            `"${e.title}"`,
            `"${e.location}"`,
            e.category,
            e.source,
            e.sphereInterface,
            e.elementFunction,
            e.indeterminacy,
            e.temporalPhase,
            e.isAnchor,
            `"${e.description.replace(/"/g, '""')}"`,
            `"${e.citation.replace(/"/g, '""')}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'landscape-intelligence-timeline.csv';
    a.click();
    URL.revokeObjectURL(url);
}
