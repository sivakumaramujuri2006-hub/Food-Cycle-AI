const state = {
  page: 'dashboard',
  audited: false,
  forecastReady: false,
  matchesReady: false,
  routeReady: false,
  sensorTemp: 5.2,
  sensorHumidity: 61,
  simulationComplete: false,
  surplus: 82,
  redistributed: 68,
  diverted: 14,
  routeKm: 5.8,
  routeMin: 18,
  selectedNGO: 'Hope Shelter',
  sensorAlert: false
};

const svg = {
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16v16H4z"/><path d="M8 8h8v8H8z"/></svg>',
  scan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3"/><path d="M7 12h10"/></svg>',
  trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 17l5-5 3 3 7-8"/><path d="M16 7h3v3"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><path d="M3.5 20a5.5 5.5 0 0111 0M16 8a3 3 0 010 6M18 15.5a4.5 4.5 0 013 4.5"/></svg>',
  route: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18h3.2c2.8 0 5.8-2.2 5.8-5V8.5"/></svg>',
  impact: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21C7 16.5 5 13.5 5 10a7 7 0 0114 0c0 3.5-2 6.5-7 11z"/><path d="M12 7v8M9 10h6"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
};

const nav = [
  ['dashboard','Dashboard',svg.grid],
  ['audit','AI Waste Audit',svg.scan],
  ['forecast','Demand Forecast',svg.trend],
  ['matching','Surplus Matching',svg.users],
  ['route','Live Route',svg.route],
  ['impact','Impact',svg.impact]
];

function appShell(content){
  return `<div class="app">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">FC</div>
        <div><div class="brand-title">FoodCycle AI</div><div class="brand-sub">Five Solvers • SIH 2026</div></div>
      </div>
      <div class="nav">${nav.map(([id,label,icon])=>`<button class="${state.page===id?'active':''}" data-nav="${id}"><span class="icon">${icon}</span><span>${label}</span></button>`).join('')}</div>
      <div class="side-bottom">
        <div class="live-pill"><span class="dot"></span>Prototype simulation online</div>
        <div class="footer-note">Demo data is simulated. Food safety and recipient verification remain deployment controls; the prototype does not certify food as safe.</div>
      </div>
    </aside>
    <main class="main">${content}</main>
  </div>`;
}

function topbar(title, eyebrow='FOODCYCLE AI • CLOSED-LOOP FOOD RECOVERY'){
  return `<div class="topbar"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1></div><div class="top-actions"><button class="btn primary" id="simulateBtn"><span style="display:inline-flex;vertical-align:middle;width:16px;margin-right:6px">${svg.play}</span>Live Simulation</button></div></div>`;
}

function kpi(label,value,meta,delta=true){
  return `<div class="card kpi"><div class="kpi-label">${label}</div><div class="kpi-value">${value}</div><div class="kpi-meta ${delta?'delta':''}">${meta}</div></div>`;
}

function dashboard(){
  return appShell(`${topbar('Live Control Tower')}
    <div class="grid kpis">
      ${kpi('Meals planned','1,200','Today • Hostel dining')}
      ${kpi('Meals consumed','1,084','90.3% utilization')}
      ${kpi('Surplus detected',state.surplus,'portions • current cycle')}
      ${kpi('Redistributed',state.redistributed,'portions • matched')}
      ${kpi('Organic diversion',state.diverted+' kg','compost / biogas path')}
      ${kpi('Route efficiency',state.routeKm+' km','optimized delivery route')}
    </div>

    <div class="grid two">
      <section class="card pad">
        <div class="split"><div><div class="section-title">Closed-loop workflow</div><div class="section-sub">One operational chain, from waste detection to final diversion.</div></div><span class="tag green"><span class="dot"></span>Operating</span></div>
        <div class="pipeline">
          ${[['♨','Kitchen','Data'],['⌁','AI Detection','Vision'],['↗','Forecast','Predict'],['✓','Match','Need + time'],['➤','Route','Optimize'],['♲','Recover','NGO / Bio']].map(x=>`<div class="pipe"><div class="pipe-icon">${x[0]}</div><b>${x[1]}</b><small>${x[2]}</small></div>`).join('')}
        </div>
        <div class="callout" style="margin-top:18px"><div class="section-title" style="font-size:13px">Current cycle</div><div class="smalltxt muted" style="margin-top:4px">82 surplus portions detected • 68 assigned to verified recipients • 14 diverted to the inedible-waste pathway.</div></div>
      </section>
      <section class="card pad">
        <div class="split"><div><div class="section-title">IoT storage telemetry</div><div class="section-sub">Simulated sensor feed for the prototype.</div></div><span class="tag ${state.sensorTemp<8?'green':'red'}"><span class="dot"></span>${state.sensorTemp<8?'Normal':'Attention'}</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px">
          <div class="card pad" style="background:#091812"><div class="kpi-label">Temperature</div><div class="kpi-value" style="font-size:24px">${state.sensorTemp.toFixed(1)}°C</div><div class="kpi-meta">Storage telemetry</div></div>
          <div class="card pad" style="background:#091812"><div class="kpi-label">Humidity</div><div class="kpi-value" style="font-size:24px">${state.sensorHumidity}%</div><div class="kpi-meta">Storage telemetry</div></div>
        </div>
        <div class="note" style="margin-top:14px">Prototype safeguard: an out-of-range temperature blocks automatic redistribution and requests manual verification.</div><button class="btn small" style="margin-top:10px" id="sensorTest">${state.sensorAlert?'Restore normal sensor':'Test sensor warning'}</button>
      </section>
    </div>

    <div class="grid two" style="margin-top:16px">
      <section class="card pad">
        <div class="section-title">Live activity</div><div class="section-sub">Latest events in the current simulation.</div>
        <div class="timeline">
          ${[['13:42','AI detected 82 potentially recoverable portions','Waste audit completed'],['13:43','Predictive engine updated surplus estimate','Attendance + menu + history'],['13:44','Recipient matching completed','Need + quantity + distance + time'],['13:45','Delivery route optimized','5.8 km • 18 min'],['13:46','Recovery plan ready','68 portions • 14 kg organic diversion']].map(r=>`<div class="timeline-row"><div class="time">${r[0]}</div><div class="track"><div class="node"></div></div><div class="timeline-copy"><strong>${r[1]}</strong><span>${r[2]}</span></div></div>`).join('')}
        </div>
      </section>
      <section class="card pad">
        <div class="split"><div><div class="section-title">Impact snapshot</div><div class="section-sub">What the current cycle accomplished.</div></div><span class="tag blue">FC-2026-00127</span></div>
        <div style="margin-top:14px">
          <div class="metric-row"><span>Potential surplus</span><strong>${state.surplus} portions</strong></div>
          <div class="metric-row"><span>Recipient allocation</span><strong>${state.redistributed} portions</strong></div>
          <div class="metric-row"><span>Inedible organic stream</span><strong>${state.diverted} kg</strong></div>
          <div class="metric-row"><span>Optimized route</span><strong>${state.routeKm} km</strong></div>
        </div>
        <button class="btn" style="margin-top:12px;width:100%" data-nav="impact">Open traceable impact record →</button>
      </section>
    </div>`);
}

function audit(){
  return appShell(`${topbar('AI Waste Audit','FOODCYCLE AI • COMPUTER VISION')}
    <div class="audit">
      <section class="card pad">
        <div class="split"><div><div class="section-title">Kitchen / cafeteria waste scan</div><div class="section-sub">Prototype computer-vision audit using a controlled demo image.</div></div><span class="tag blue">Demo camera feed</span></div>
        <div class="photo" style="margin-top:14px">
          <div class="overlay-label">CAM-01 • Kitchen return station</div>
          <div class="tray"></div><div class="food one"></div><div class="food two"></div><div class="food three"></div><div class="food four"></div>
          ${state.audited?'<div class="bbox b1"><span>Rice • 3.2 kg</span></div><div class="bbox b2"><span>Vegetables • 0.8 kg</span></div><div class="bbox b3"><span>Curry • 1.4 kg</span></div>':''}
        </div>
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-top:14px"><div class="smalltxt muted">The prototype identifies food categories and estimates waste quantities; it does not certify food safety.</div><button class="btn primary" id="runAudit">${state.audited?'Re-run AI Audit':'Run AI Audit'}</button></div>
      </section>
      <section class="grid" style="align-content:start">
        <section class="card pad center"><div class="score">${state.audited?'5.4':'—'} <span style="font-size:18px;color:#a6c2b6">kg</span></div><div class="score-sub">potentially recoverable food estimate</div><div class="tiny muted" style="margin-top:8px">≈ 82 demo portions at ~66 g recoverable food per portion</div><div style="margin-top:14px"><span class="tag ${state.audited?'green':'blue'}">${state.audited?'Analysis complete':'Awaiting scan'}</span></div></section>
        <section class="card pad">
          <div class="section-title">Classification result</div><div class="section-sub">Used by the downstream matching / diversion logic.</div>
          <div style="margin-top:14px">
            ${[['Rice','3.2 kg','60%'],['Curry','1.4 kg','26%'],['Vegetables','0.8 kg','14%'],['Packaging','0.4 kg','non-food']].map(x=>`<div style="margin-bottom:14px"><div class="metric-row" style="padding-top:0"><span>${x[0]}</span><strong>${x[1]}</strong></div><div class="bar"><span style="width:${x[2]==='non-food'? '8%':x[2]}"></span></div></div>`).join('')}
          </div>
        </section>
        <section class="card pad">
          <div class="section-title">Decision handoff</div><div class="section-sub">The scan feeds the closed-loop decision engine.</div>
          <div class="note" style="margin-top:12px">${state.audited?'82 portions available for the current surplus scenario.':'Run the audit to populate the surplus decision.'}</div>
          <button class="btn" style="margin-top:12px;width:100%" data-nav="matching" ${state.audited?'':'disabled'}>Continue to Smart Matching →</button>
        </section>
      </section>
    </div>`);
}

function forecast(){
  const attendance=420;
  const recommended=385;
  return appShell(`${topbar('Demand Forecast','FOODCYCLE AI • PREDICTIVE ANALYTICS')}
    <section class="card pad">
      <div class="split"><div><div class="section-title">Tomorrow lunch prediction</div><div class="section-sub">Prototype uses attendance, menu and historical consumption signals.</div></div><span class="tag blue">Prototype model</span></div>
      <div class="controls" style="margin-top:16px">
        <div class="field"><label>Expected attendance</label><input id="attendance" type="number" value="${attendance}" min="50" max="2000"></div>
        <div class="field"><label>Menu profile</label><select id="menu"><option>Rice + Dal + Vegetable Curry</option><option>Rice + Sambar + Vegetable Curry</option><option>Rice + Dal + Mixed Veg</option></select></div>
        <div class="field"><label>Historical consumption</label><input id="consumption" type="number" value="91" min="70" max="100"></div>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:14px"><button class="btn primary" id="predictBtn">${state.forecastReady?'Recalculate forecast':'Run Demand Prediction'}</button></div>
    </section>
    <div class="forecast" style="margin-top:16px">
      <section class="card pad">
        <div class="section-title">Consumption history → forecast</div><div class="section-sub">Illustrative training/validation view for the prototype.</div>
        <div class="chart"><div class="bars">${[88,92,90,94,89,91,90].map((v,i)=>`<div class="bar-col"><div class="bar-fill" style="height:${v*1.55}px"></div><div class="bar-label">D${i+1}</div></div>`).join('')}</div><div class="chart-axis"><span>Historical utilization</span><span>Next: ${Math.round(91*0.99)}%</span></div></div>
      </section>
      <section class="card pad">
        <div class="section-title">AI recommendation</div><div class="section-sub">A forecast changes the preparation decision.</div>
        <div style="margin-top:18px"><div class="eyebrow">Recommended preparation</div><div class="score" style="text-align:left;margin-top:2px">${state.forecastReady?recommended:'—'} <span style="font-size:18px;color:#a6c2b6">meals</span></div></div>
        <div style="margin-top:12px"><div class="metric-row"><span>Expected attendance</span><strong>${attendance}</strong></div><div class="metric-row"><span>Estimated surplus</span><strong>${state.forecastReady?12:'—'} meals</strong></div><div class="metric-row"><span>Planning signal</span><strong>${state.forecastReady?'Reduce overproduction':'Awaiting prediction'}</strong></div></div>
        <div class="note" style="margin-top:12px">The UI intentionally labels this as a prototype model rather than claiming production accuracy.</div>
      </section>
    </div>`);
}

function matching(){
  const ngos=[
    {name:'Hope Shelter',need:50,dist:'2.1 km',time:'60 min',cap:50,fit:'94% match'},
    {name:'Community Kitchen',need:20,dist:'3.8 km',time:'45 min',cap:20,fit:'91% match'},
    {name:'Care Centre',need:30,dist:'7.2 km',time:'90 min',cap:30,fit:'76% match'},
    {name:'Neighbourhood Pantry',need:15,dist:'5.4 km',time:'50 min',cap:15,fit:'68% match'},
  ];
  const disabled = state.sensorTemp>=8;
  return appShell(`${topbar('Smart Surplus Matching','FOODCYCLE AI • VERIFIED RECIPIENT MATCHING')}
    <div class="grid two">
      <section class="card pad">
        <div class="split"><div><div class="section-title">Available surplus</div><div class="section-sub">Current recoverable food scenario.</div></div><span class="tag green">${state.surplus} portions</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px"><div class="card pad" style="background:#091812"><div class="kpi-label">Edible / potentially recoverable</div><div class="kpi-value" style="font-size:24px">${state.redistributed} portions</div><div class="kpi-meta">Candidate for redistribution</div></div><div class="card pad" style="background:#091812"><div class="kpi-label">Inedible organic stream</div><div class="kpi-value" style="font-size:24px">${state.diverted} kg</div><div class="kpi-meta">Compost / biogas path</div></div></div>
        <div class="note" style="margin-top:14px">Matching considers recipient need, quantity, distance and time window. Deployment would additionally require verified recipient status and operational food-safety checks.</div>
      </section>
      <section class="card pad">
        <div class="section-title">Decision engine</div><div class="section-sub">The prototype selects a feasible allocation, then hands off to routing.</div>
        <div style="margin-top:14px" class="metric-row"><span>Primary constraint</span><strong>${disabled?'Sensor warning':'Time-to-delivery'}</strong></div>
        <div class="metric-row"><span>Allocation target</span><strong>${disabled?'Manual review':'68 portions'}</strong></div>
        <button class="btn primary" style="width:100%;margin-top:14px" id="matchBtn" ${disabled?'disabled':''}>${state.matchesReady?'Recalculate Match':'Find Recipient Matches'}</button>
      </section>
    </div>
    <section class="card pad" style="margin-top:16px">
      <div class="split"><div><div class="section-title">Verified recipient candidates</div><div class="section-sub">Ranked for the current operational scenario.</div></div><span class="tag ${disabled?'red':'green'}">${disabled?'Automatic allocation blocked':'Matching engine ready'}</span></div>
      <div class="match-grid" style="margin-top:14px">
        ${ngos.map((n,i)=>`<div class="ngocard ${state.matchesReady && i<2?'selected':''}"><div class="ngotop"><div><div class="ngo-name">${n.name}</div><div class="ngo-meta">Need ${n.need} portions • Capacity ${n.cap}</div></div><span class="tag ${i<2?'green':'blue'}">${n.fit}</span></div><div class="smalltxt muted">Distance: <strong>${n.dist}</strong> • Response window: <strong>${n.time}</strong></div><div class="fit">${state.matchesReady&&i===0?'Allocated 50 portions':state.matchesReady&&i===1?'Allocated 18 portions':'Available candidate'}</div></div>`).join('')}
      </div>
      ${state.matchesReady?`<div class="note" style="margin-top:14px"><strong>Allocation confirmed:</strong> 50 portions → Hope Shelter; 18 portions → Community Kitchen; remaining organic material → compost/biogas pathway.</div>`:''}
      <div style="display:flex;justify-content:flex-end;margin-top:14px"><button class="btn" data-nav="route">Continue to Route Optimization →</button></div>
    </section>`);
}

function route(){
  return appShell(`${topbar('Live Route Optimization','FOODCYCLE AI • SMART LOGISTICS')}
    <div class="grid two">
      <section class="card pad"><div class="route-map"><div class="map-legend"><div class="eyebrow" style="margin-bottom:6px">Routing layer</div><div class="legend-row"><span class="legend-line"></span>Optimized path</div><div class="legend-row"><span style="width:8px;height:8px;border:1px solid var(--accent);border-radius:50%"></span>Pickup / recipient</div></div><div class="route-line"></div><div class="route-line two"></div>
        <div class="map-node mn-a"><span>●</span><div class="pinlabel">ABC College Kitchen</div></div>
        <div class="map-node mn-b"><span>1</span><div class="pinlabel">Hope Shelter</div></div>
        <div class="map-node mn-c"><span>2</span><div class="pinlabel">Community Kitchen</div></div>
      </div><div class="footer-note">Prototype map view inspired by the OpenStreetMap-based routing approach listed in the submission. Route geometry is simulated for offline reliability.</div></section>
      <section class="grid" style="align-content:start">
        <section class="card pad"><div class="split"><div><div class="section-title">Optimized route</div><div class="section-sub">Pickup deadline: 30 minutes</div></div><span class="tag green">${state.routeReady?'Ready to dispatch':'Draft route'}</span></div>
          <div style="margin-top:14px"><div class="metric-row"><span>Total distance</span><strong>${state.routeKm} km</strong></div><div class="metric-row"><span>Estimated travel time</span><strong>${state.routeMin} min</strong></div><div class="metric-row"><span>Stops</span><strong>2 recipients</strong></div><div class="metric-row"><span>Allocation</span><strong>68 portions</strong></div></div>
          <div class="note" style="margin-top:12px">The live prototype keeps route data deterministic so the presentation demo remains stable even without an external routing API.</div>
        </section>
        <section class="card pad"><div class="section-title">Recovery handoff</div><div class="section-sub">One final confirmation closes the loop.</div><button class="btn primary" style="width:100%;margin-top:14px" id="confirmRoute">${state.routeReady?'Delivery marked ready':'Confirm optimized route'}</button></section>
      </section>
    </div>`);
}

function impact(){
  return appShell(`${topbar('Traceable Impact','FOODCYCLE AI • MEASURE WHAT YOU RECOVER')}
    <div class="impact-grid">
      ${[['82','surplus portions detected'],['68','portions allocated to recipients'],['14 kg','organic waste diverted'],['5.8 km','optimized route']].map(x=>`<div class="card pad"><div class="impact-num">${x[0]}</div><div class="kpi-label" style="margin-top:5px">${x[1]}</div></div>`).join('')}
    </div>
    <div class="grid two" style="margin-top:16px">
      <section class="card pad center"><div class="section-title">Current cycle recovery ratio</div><div class="section-sub">Based on the prototype scenario.</div><div class="donut" style="margin-top:20px"><div><strong>${Math.round((state.redistributed/state.surplus)*100)}%</strong><span>allocated</span></div></div><div class="smalltxt muted">${state.redistributed} of ${state.surplus} portions routed to redistribution; remaining organic material stays on the resource-recovery pathway.</div></section>
      <section class="card pad"><div class="split"><div><div class="section-title">Traceability record</div><div class="section-sub">FoodCycle ID: FC-2026-00127</div></div><span class="tag green">Closed loop</span></div>
        <table class="table" style="margin-top:14px"><thead><tr><th>Time</th><th>Stage</th><th>Result</th></tr></thead><tbody>
          ${[['13:42','Waste audit','5.4 kg potentially recoverable'],['13:43','Forecast','12 meals estimated surplus'],['13:44','Matching','68 portions assigned'],['13:45','Routing','5.8 km / 18 min'],['13:46','Recovery','NGO + compost/biogas pathways']].map(r=>`<tr><td>${r[0]}</td><td><strong>${r[1]}</strong></td><td>${r[2]}</td></tr>`).join('')}
        </tbody></table>
      </section>
    </div>
    <section class="card pad" style="margin-top:16px"><div class="section-title">Scale-ready operating model</div><div class="section-sub">Matches the scalability direction in the submission.</div><div class="pipeline" style="margin-top:16px">${['Single institution','Campus','City','Multi-city','National network'].map((x,i)=>`<div class="pipe"><div class="pipe-icon">${i+1}</div><b>${x}</b><small>${i===0?'Prototype scope':i===1?'Next deployment':'Scale path'}</small></div>`).join('')}</div></section>`);
}

function render(){
  const root=document.getElementById('app');
  root.innerHTML = ({dashboard, audit, forecast, matching, route, impact}[state.page])();
  document.querySelectorAll('[data-nav]').forEach(btn=>btn.addEventListener('click',()=>{state.page=btn.dataset.nav;render()}));
  document.getElementById('simulateBtn')?.addEventListener('click',startSimulation);
  document.getElementById('runAudit')?.addEventListener('click',()=>{state.audited=true;toast('AI audit complete: 5.4 kg ≈ 82 demo portions.');render();});
  document.getElementById('predictBtn')?.addEventListener('click',()=>{state.forecastReady=true;toast('Demand prediction updated the preparation recommendation.');render();});
  document.getElementById('matchBtn')?.addEventListener('click',()=>{state.matchesReady=true;toast('Recipient matching complete: 68 portions allocated.');render();});
  document.getElementById('confirmRoute')?.addEventListener('click',()=>{state.routeReady=true;toast('Optimized route confirmed and ready for dispatch.');render();});
  document.getElementById('sensorTest')?.addEventListener('click',()=>{state.sensorAlert=!state.sensorAlert;state.sensorTemp=state.sensorAlert?11.8:5.2;toast(state.sensorAlert?'Sensor warning triggered: automatic redistribution blocked.':'Sensor restored: redistribution workflow reopened.');render();});
}

function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2600)}

function startSimulation(){
  const modal=document.createElement('div');modal.className='sim-modal show';modal.id='simModal';modal.innerHTML=`<div class="sim-box card"><div class="sim-head"><div><div class="eyebrow">FOODCYCLE AI • LIVE SIMULATION</div><h2 style="margin:5px 0 0;font-size:22px">One complete food-recovery cycle</h2><div class="section-sub">Deterministic demo flow designed for a stable selector presentation.</div></div><button class="btn small" id="closeSim">Close</button></div><div class="sim-log" id="simLog"></div><div class="progress"><span id="simBar"></span></div><div style="display:flex;justify-content:flex-end;margin-top:14px"><button class="btn primary" id="runAgain">Run again</button></div></div>`;
  document.body.appendChild(modal);
  const steps=[
    ['13:42','AI detected 82 potentially recoverable portions.','ok'],
    ['13:43','Demand model updated the surplus estimate from attendance + menu + history.','ok'],
    ['13:44','68 portions matched to verified recipient candidates.','ok'],
    ['13:45','Route optimized to 5.8 km / 18 min for 2 recipient stops.','ok'],
    ['13:46','14 kg organic remainder routed to compost / biogas pathway.','ok'],
    ['13:47','Cycle closed — impact record FC-2026-00127 updated.','ok']
  ];
  const run=()=>{
    const log=document.getElementById('simLog');const bar=document.getElementById('simBar');log.innerHTML='';bar.style.width='0%';
    steps.forEach((s,i)=>setTimeout(()=>{const row=document.createElement('div');row.className='sim-line';row.innerHTML=`<div class="sim-time">${s[0]}</div><div class="sim-ok">✓</div><div>${s[1]}</div>`;log.appendChild(row);log.scrollTop=log.scrollHeight;bar.style.width=((i+1)/steps.length*100)+'%';if(i===steps.length-1){state.simulationComplete=true;state.audited=true;state.forecastReady=true;state.matchesReady=true;state.routeReady=true;}},420*i));
  };
  document.getElementById('closeSim').onclick=()=>modal.remove();document.getElementById('runAgain').onclick=run;run();
}

render();
