// Minimal interactivity + demo data so it works on GitHub Pages

const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// Demo data (replace later with real API)
const jobs = [
  {
    id: "A-1012170",
    customer: "Lewis Williams",
    order: "1012170",
    stage: "Setting",
    status: "With Jewellers",
    urgent: true,
    labels: ["Setting","URGENT"],
    notes: "3-claw micro-prong; sapphire slightly off-centre",
    created_at: "2025-06-25",
  },
  {
    id: "B-1013009",
    customer: "Emily Chen",
    order: "1013009",
    stage: "Polishing",
    status: "Awaiting QC",
    urgent: false,
    labels: ["Repair"],
    notes: "Resize from L to N; hairline scratch on shank",
    created_at: "2025-07-03",
  },
  {
    id: "C-1013185",
    customer: "Jordan Smith",
    order: "1013185",
    stage: "QC",
    status: "In Progress",
    urgent: false,
    labels: ["Setting"],
    notes: "Stone needs re-seat; looseness at 2 o'clock",
    created_at: "2025-08-01",
  }
];

function renderStats() {
  const inProgress = jobs.filter(j => j.status.toLowerCase().includes("progress") || j.status.toLowerCase().includes("jewellers")).length;
  const urgent = jobs.filter(j => j.urgent).length;
  const qc = jobs.filter(j => j.stage.toLowerCase() === "qc").length;
  $("#statInProgress").textContent = inProgress;
  $("#statUrgent").textContent = urgent;
  $("#statQC").textContent = qc;
}

function labelBadge(text){
  const span = document.createElement("span");
  span.className = "label " + (text.toLowerCase()==="urgent" ? "urgent" : (text.toLowerCase()==="setting" ? "setting" : ""));
  span.textContent = text;
  return span;
}

function jobCard(job){
  const tpl = $("#jobCardTemplate").content.cloneNode(true);
  tpl.querySelector(".customer-name").textContent = job.customer;
  tpl.querySelector(".order-num").textContent = "#" + job.order;
  const labels = tpl.querySelector(".labels");
  job.labels.forEach(l => labels.appendChild(labelBadge(l)));
  tpl.querySelector(".badge.stage").textContent = "Stage: " + job.stage;
  tpl.querySelector(".badge.status").textContent = job.status;
  const card = tpl.querySelector(".job-card");
  card.dataset.jobId = job.id;
  card.addEventListener("click", () => showJob(job.id));
  return tpl;
}

function renderJobs(list = jobs){
  const listEl = $("#jobsList");
  listEl.innerHTML = "";
  list.forEach(j => listEl.appendChild(jobCard(j)));
}

function showJob(id){
  const job = jobs.find(j => j.id === id);
  const detail = $("#jobDetail");
  if(!job) return;
  detail.innerHTML = `
    <div class="detail-head">
      <h2 class="detail-title">${job.customer} — <small>#${job.order}</small></h2>
      <div class="actions">
        <button class="btn" id="btnHistory">Stage History</button>
        <button class="btn primary" id="btnIssue">Track Issue</button>
      </div>
    </div>
    <div class="grid">
      <div class="card">
        <h3>Job Overview</h3>
        <div class="kv">
          <div>Job ID</div><div>${job.id}</div>
          <div>Stage</div><div>${job.stage}</div>
          <div>Status</div><div>${job.status}</div>
          <div>Created</div><div>${job.created_at}</div>
        </div>
      </div>
      <div class="card">
        <h3>Notes</h3>
        <p style="margin-top:6px; line-height:1.5">${job.notes}</p>
      </div>
    </div>
  `;
  $("#btnIssue").addEventListener("click", () => openIssueModal(job));
}

function openIssueModal(job){
  const dlg = $("#issueModal");
  $("#issueJobId").value = job.id;
  dlg.showModal();
}

function hookIssueForm(){
  $("#issueSubmit").addEventListener("click", (e) => {
    // Collect values; in a real app you'd POST to your backend
    const payload = {
      jobId: $("#issueJobId").value,
      stage: $("#issueStage").value,
      description: $("#issueDescription").value.trim(),
      created_at: new Date().toISOString()
    };
    console.log("Issue submitted:", payload);
    // Provide simple feedback
    alert("Issue recorded (demo). Check console for payload.");
  });
}

function tabsInit(){
  $$(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.dataset.tab;
      $$(".tabpanel").forEach(p => p.classList.remove("active"));
      $("#"+target).classList.add("active");
    });
  });
}

function searchInit(){
  const input = $("#searchInput");
  input.addEventListener("input", () => {
    const q = input.value.toLowerCase();
    const filtered = jobs.filter(j =>
      j.customer.toLowerCase().includes(q) ||
      j.order.toLowerCase().includes(q) ||
      j.stage.toLowerCase().includes(q) ||
      j.status.toLowerCase().includes(q)
    );
    renderJobs(filtered);
  });
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  tabsInit();
  searchInit();
  renderStats();
  renderJobs();
  hookIssueForm();
});
