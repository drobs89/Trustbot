// ======================================================
// TRUSTBOT ALPHA — STATIC (Protected, dynamic ID + defaults)
// Auto-stamps today's date (America/New_York) into the identifier
// and sets default address + jurisdiction text globally.
// ======================================================

// Format YYYY-MM-DD in America/New_York
function todayNY() {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric', month: '2-digit', day: '2-digit'
  });
  // en-CA gives YYYY-MM-DD by splitting parts
  const parts = fmt.formatToParts(new Date());
  const y = parts.find(p=>p.type==='year').value;
  const m = parts.find(p=>p.type==='month').value;
  const d = parts.find(p=>p.type==='day').value;
  return `${y}-${m}-${d}`;
}

// Base prefix (kept constant), date appended daily
const TRUSTBOT_ID_PREFIX = "DRR-TRUSTBOT-ALPHA-CEC1-SENTINEL-FCPS1.0";
const TRUSTBOT_IDENTIFIER = `${TRUSTBOT_ID_PREFIX}-${todayNY()}`;

// Owner + confidentiality
const TRUSTBOT_OWNER = "Devon R. Robinson Private Trust";
const TRUSTBOT_CONF = "Confidential & Proprietary — Distribution Restricted";

// -------- Global defaults you asked to lock in ----------
const DEFAULT_MAILING_ADDRESS = "350 Northern Blvd, Albany, NY 12204, Ste 324";
const DEFAULT_JURISDICTION_TEXT =
  "This private trust is organized and administered under common law. Any reference to state or federal systems is solely for administrative purposes and does not confer jurisdiction absent the Trustees’ explicit, written consent.";

// -------------------- Schema ---------------------------
const SCHEMA = {
  version: "0.2",
  defaultJurisdictionMode: "common-law",
  disclaimer: "Educational draft only. Not legal advice. Review with a qualified attorney.",
  trustTypes: [
    {
      id: "revocable",
      label: "Revocable Living Trust",
      template: "revocable",
      fields: [
        { id: "grantorName", label: "Grantor Full Name", type: "text", required: true },
        { id: "trusteeName", label: "Trustee Full Name", type: "text", required: true },
        { id: "beneficiaryName", label: "Primary Beneficiary", type: "text", required: true },
        { id: "establishedDate", label: "Date Established", type: "date", required: true },
        { id: "governingLaw", label: "Governing Law", type: "text", default: "Common Law" },
        { id: "successorTrustee", label: "Successor Trustee", type: "text" },
        { id: "successorBeneficiary", label: "Successor Beneficiary", type: "text" }
      ]
    },
    {
      id: "private_common_law",
      label: "Private Trust (Common Law)",
      template: "commonlaw",
      fields: [
        { id: "settlor", label: "Settlor", type: "text", required: true },
        { id: "trustee", label: "Trustee", type: "text", required: true },
        { id: "beneficiaries", label: "Beneficiaries (comma-separated)", type: "text", required: true },
        { id: "trustName", label: "Trust Name", type: "text", required: true },
        { id: "date", label: "Effective Date", type: "date", required: true },
        { id: "mailingAddress", label: "Mailing Address", type: "text", default: DEFAULT_MAILING_ADDRESS },
        { id: "jurisdiction", label: "Jurisdiction Statement", type: "textarea", default: DEFAULT_JURISDICTION_TEXT }
      ]
    }
  ]
};

// -------------------- Templates ------------------------
function tmplRevocable(a, meta) {
  return `
<header style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color:#333;">
  <div>Identifier: <strong>${meta.id}</strong></div>
  <div>Owner: ${meta.owner}</div>
  <div>${meta.conf}</div>
</header>

<h2 style="text-align:center; text-transform:uppercase; letter-spacing:.08em;">Revocable Living Trust (Draft)</h2>
<p><em>${meta.disclaimer}</em></p>

<div style="border:1px solid #222; padding:1rem; border-radius:8px;">
  <p><strong>Grantor:</strong> ${a.grantorName || ""}</p>
  <p><strong>Trustee:</strong> ${a.trusteeName || ""}</p>
  <p><strong>Primary Beneficiary:</strong> ${a.beneficiaryName || ""}</p>
  <p><strong>Date Established:</strong> ${a.establishedDate || ""}</p>
  <p><strong>Governing Law:</strong> ${a.governingLaw || "Common Law"}</p>
  ${a.successorTrustee ? `<p><strong>Successor Trustee:</strong> ${a.successorTrustee}</p>` : ""}
  ${a.successorBeneficiary ? `<p><strong>Successor Beneficiary:</strong> ${a.successorBeneficiary}</p>` : ""}
</div>

<h3>Article I — Declaration</h3>
<p>The Grantor declares the creation of this Trust as a private arrangement for the benefit of the named Beneficiary(ies).</p>

<hr>
<div class="stamp">
  <div>Generated: ${new Date().toISOString()}</div>
  <div>Fingerprint (SHA256): ${meta.fingerprint}</div>
  <div>Stamp: ${meta.id}</div>
</div>
`;
}

function tmplCommonLaw(a, meta) {
  return `
<header style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color:#333;">
  <div>Identifier: <strong>${meta.id}</strong></div>
  <div>Owner: ${meta.owner}</div>
  <div>${meta.conf}</div>
</header>

<h2 style="text-align:center; text-transform:uppercase; letter-spacing:.08em;">Private Trust (Common Law) — Draft</h2>
<p><em>${meta.disclaimer}</em></p>

<div style="border:1px solid #222; padding:1rem; border-radius:8px;">
  <p><strong>Settlor:</strong> ${a.settlor || ""}</p>
  <p><strong>Trustee:</strong> ${a.trustee || ""}</p>
  <p><strong>Beneficiaries:</strong> ${a.beneficiaries || ""}</p>
  <p><strong>Trust Name:</strong> ${a.trustName || ""}</p>
  <p><strong>Effective Date:</strong> ${a.date || ""}</p>
  ${a.mailingAddress ? `<p><strong>Mailing Address:</strong> ${a.mailingAddress}</p>` : ""}
  <p><strong>Jurisdiction Statement:</strong> ${a.jurisdiction || ""}</p>
</div>

<h3>Article I — Governance</h3>
<p>${DEFAULT_JURISDICTION_TEXT}</p>

<hr>
<div class="stamp">
  <div>Generated: ${new Date().toISOString()}</div>
  <div>Fingerprint (SHA256): ${meta.fingerprint}</div>
  <div>Stamp: ${meta.id}</div>
</div>
`;
}

// -------------------- Helpers -------------------------
async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function printDraft(htmlFragment) {
  const w = window.open("", "_blank");
  const html = `<!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Trust Draft — ${new Date().toISOString()}</title>
    <meta name="trustbot-identifier" content="${TRUSTBOT_IDENTIFIER}">
    <meta name="owner" content="${TRUSTBOT_OWNER}">
    <meta name="confidentiality" content="${TRUSTBOT_CONF}">
    <style>
      body { font-family: Georgia, serif; color:#000; }
      h1,h2,h3 { text-align:center; letter-spacing:.03em; }
      .stamp { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size:.9rem; color:#444; }
      @page { size: A4; margin: 20mm; }
    </style>
  </head>
  <body>
    ${htmlFragment}
    <script>window.onload = () => { window.print(); }</script>
  </body>
  </html>`;
  w.document.open(); w.document.write(html); w.document.close();
}

// -------------------- DOM wiring ----------------------
const idEl = document.getElementById("idStamp");
const ownerEl = document.getElementById("ownerStamp");
const disclaimerEl = document.getElementById("disclaimer");
const typeSel = document.getElementById("trustType");
const dyn = document.getElementById("dynamicFields");
const out = document.getElementById("output");
const btn = document.getElementById("generateBtn");
const pdfBtn = document.getElementById("pdfBtn");

if (idEl) idEl.textContent = TRUSTBOT_IDENTIFIER;
if (ownerEl) ownerEl.textContent = TRUSTBOT_OWNER;
if (disclaimerEl) disclaimerEl.textContent = SCHEMA.disclaimer;

// Populate trust types
if (typeSel) {
  SCHEMA.trustTypes.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.id; opt.textContent = t.label;
    typeSel.appendChild(opt);
  });
}

// Render dynamic fields with defaults
function renderFields() {
  const type = SCHEMA.trustTypes.find(t => t.id === typeSel.value);
  dyn.innerHTML = "";
  (type.fields || []).forEach(f => {
    const wrap = document.createElement("div");
    const req = f.required ? "required" : "";
    const val = (typeof f.default !== "undefined") ? f.default : "";
    let input;
    if (f.type === "textarea") {
      input = `<textarea name="${f.id}" ${req} placeholder="${f.placeholder || ""}">${val}</textarea>`;
    } else {
      input = `<input type="${f.type || "text"}" name="${f.id}" value="${val}" ${req} placeholder="${f.placeholder || ""}" />`;
    }
    wrap.innerHTML = `<label>${f.label}${f.required ? " *" : ""}</label>${input}`;
    dyn.appendChild(wrap);
  });
}
if (typeSel) { typeSel.addEventListener("change", renderFields); renderFields(); }

// Disable PDF until draft exists
if (pdfBtn) pdfBtn.disabled = true;

// Generate draft + enable PDF
if (btn) {
  btn.addEventListener("click", async () => {
    const answers = {};
    dyn.querySelectorAll("input,textarea,select").forEach(el => { answers[el.name] = el.value; });

    const payload = JSON.stringify({ trustType: typeSel.value, answers });
    const fingerprint = await sha256(payload);

    const meta = {
      id: TRUSTBOT_IDENTIFIER,
      owner: TRUSTBOT_OWNER,
      conf: TRUSTBOT_CONF,
      disclaimer: SCHEMA.disclaimer,
      fingerprint
    };

    const type = SCHEMA.trustTypes.find(t => t.id === typeSel.value);
    const html = type.template === "revocable"
      ? tmplRevocable(answers, meta)
      : tmplCommonLaw(answers, meta);

    out.innerHTML = html;
    out.hidden = false;

    if (pdfBtn) { pdfBtn.disabled = false; pdfBtn.onclick = () => printDraft(out.innerHTML); }
  });
}