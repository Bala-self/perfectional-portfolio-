#!/usr/bin/env python3
"""Build the personalized portfolio ID card and its offline editor.

The card uses the portfolio's navy / paper / blue system on a 1024 x 1440 artboard.
The front contains only the local profile portrait; the back contains only four facts.
"""
import base64, json, pathlib

SRC = pathlib.Path(__file__).parent
OUT = SRC.parent

# ---------------------------------------------------------------- design tokens
C, H = 1024.0, 1440.0
d = C / 300
M = 22 * d                       # side margin        75.09
PLATE_R = 18 * d                 # plate radius       61.44
EDGE_R = 59.44
PAL = dict(bg='#0F1E33', ink='#F4F1EA', muted='#B9C4D4', line='#304766',
           accent='#8CA4FF', frame='#102746', ghost='#27405F')

SANS = 'Card Sans, Archivo, system-ui, sans-serif'
MONO = 'Card Mono, ui-monospace, Consolas, monospace'

# ---------------------------------------------------------------- card defaults
FIELDS = [
    # key        label                svg id       default
    ('based_in', 'Based in', 'b-based-in', 'Chennai, Tamil Nadu'),
    ('availability', 'Availability', 'b-availability', 'Immediate joiner'),
    ('open_to', 'Open to', 'b-open-to', 'Full-time · On-site, India'),
    ('email', 'Email', 'b-email', 'balakrishnan.code@email.com'),
]

# ---------------------------------------------------------------- fonts
def font_css():
    sans = base64.b64encode((SRC / 'fonts/archivo-latin-wdth-normal-DY7AcnAa.woff2').read_bytes()).decode()
    mono = base64.b64encode((SRC / 'fonts/ibm-plex-mono-latin-500-normal-DSY6xOcd.woff2').read_bytes()).decode()
    return (
        "@font-face{font-family:'Card Sans';font-style:normal;font-weight:100 900;"
        f"font-stretch:62% 125%;src:url(data:font/woff2;base64,{sans}) format('woff2-variations');}}"
        "@font-face{font-family:'Card Mono';font-style:normal;font-weight:500;"
        f"src:url(data:font/woff2;base64,{mono}) format('woff2');}}"
    )

def defs(p):
    """p = 'f' | 'b' so both faces can live in one HTML document."""
    return f"""  <defs>
    <clipPath id="{p}-plate"><rect width="{C}" height="{H}" rx="{PLATE_R}"/></clipPath>
  </defs>"""

# ---------------------------------------------------------------- photo module

def photo_defs():
    return f"""  <defs>
    <clipPath id="f-photo"><rect width="{C:.2f}" height="{H:.2f}" rx="{PLATE_R:.2f}"/></clipPath>
  </defs>"""

def photo_body():
    return f"""  <g clip-path="url(#f-photo)">
    <rect width="{C:.2f}" height="{H:.2f}" fill="{PAL['frame']}"/>
    <image id="f-photo-img" x="0" y="0" width="{C:.2f}" height="{H:.2f}"
           preserveAspectRatio="xMidYMid slice" href="../assets/images/certificates/Confident%20Navy%20Suit%20Studio%20Portrait.png"/>
  </g>"""

# ---------------------------------------------------------------- front face
def front():
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{C:.0f}" height="{H:.0f}"
     viewBox="0 0 {C:.0f} {H:.0f}" id="svg-front" role="img" aria-label="Profile image">
  <style>{font_css()}</style>
{defs('f')}{photo_defs()}
{photo_body()}
  <rect x="2" y="2" width="{C-4}" height="{H-4}" rx="{EDGE_R}" fill="none"
        stroke="rgba(255,255,255,0.18)" stroke-width="4"/>
</svg>
"""

# ---------------------------------------------------------------- back face
def back():
    LBL, VAL, vy = 8.5 * d, 11.5 * d, 14 * d
    BACK_INK, BACK_MUTED, BACK_LINE, BACK_BLUE = '#0F1E33', '#64748B', '#D6DCE5', '#1F44E0'
    rows = [(170, 'Based in', 'b-based-in', 'Chennai, Tamil Nadu', M),
            (170, 'Availability', 'b-availability', 'Immediate joiner', C / 2 + 4 * d),
            (290, 'Open to', 'b-open-to', 'Full-time · On-site, India', M),
            (385, 'Email', 'b-email', 'balakrishnan.code@email.com', M)]
    fields = '\n'.join(
        f"""    <text x="{x:.2f}" y="{y*d:.2f}" font-family="{MONO}" font-weight="500"
          font-size="{LBL:.2f}" fill="{BACK_MUTED}">{lbl}</text>
    <text id="{fid}" x="{x:.2f}" y="{y*d+vy:.2f}" font-family="{SANS}" font-weight="600"
          font-size="{VAL:.2f}" fill="{BACK_INK}">{val}</text>"""
        for y, lbl, fid, val, x in rows)

    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{C:.0f}" height="{H:.0f}"
     viewBox="0 0 {C:.0f} {H:.0f}" id="svg-back" role="img" aria-label="Profile details">
  <style>{font_css()}</style>
{defs('b')}
  <g clip-path="url(#b-plate)">
    <rect width="{C}" height="{H}" rx="{PLATE_R}" fill="#F4F1EA"/>
    <rect x="2" y="2" width="{C-4}" height="{H-4}" rx="{EDGE_R}" fill="none"
          stroke="rgba(15,30,51,0.16)" stroke-width="4"/>
    <rect width="20" height="{H}" fill="{BACK_BLUE}"/>
    <path d="M{C-430} 0H{C}V{410}C{C-180} 350 {C-260} 150 {C-430} 0Z" fill="#1F44E0" opacity="0.08"/>
  </g>
{fields}
</svg>
"""

# ---------------------------------------------------------------- live page
HTML = r"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Profile card — live</title>
<style>
  :root{--paper:#f4f1ea;--ink:#0f1e33;--muted:#64748b;--rule:#d6dce5;--accent:#1f44e0;
        --sans:"Card Sans",Archivo,system-ui,sans-serif;--mono:"Card Mono",ui-monospace,Consolas,monospace;}
  @font-face{font-family:'Card Sans';font-style:normal;font-weight:100 900;font-stretch:62% 125%;
    src:url(data:font/woff2;base64,@@SANS@@) format('woff2-variations');}
  @font-face{font-family:'Card Mono';font-style:normal;font-weight:500;
    src:url(data:font/woff2;base64,@@MONO@@) format('woff2');}
  *{box-sizing:border-box}
  body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.55 var(--sans);
       -webkit-font-smoothing:antialiased}
  .wrap{max-width:1080px;margin:0 auto;padding:28px 20px 64px}
  header.top{display:flex;flex-wrap:wrap;gap:8px 20px;align-items:baseline;
       justify-content:space-between;border-bottom:1px solid var(--rule);padding-bottom:14px}
  h1{margin:0;font-size:15px;font-weight:800;letter-spacing:.02em;text-transform:uppercase}
  .hint{margin:0;color:var(--muted);font:13px var(--mono)}
  .grid{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:40px;margin-top:34px;align-items:start}
  @media (max-width:820px){.grid{grid-template-columns:1fr;gap:28px}}
  /* ---------- stage ---------- */
  .stage{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;
         min-height:560px;user-select:none;touch-action:none}
  .hanger{display:flex;flex-direction:column;align-items:center}
  .strap{width:42px;height:118px}
  .swing{transform-origin:50% 0;transform:rotate(var(--swing,0deg));will-change:transform}
  .grab{cursor:grab;touch-action:none}
  .grab.dragging{cursor:grabbing}
  .pull{transform:translateY(var(--pull,0px))}
  .card3d{position:relative;width:min(74vw,330px);aspect-ratio:1024/1440;
          transform-style:preserve-3d;transition:transform .7s cubic-bezier(.2,.7,.2,1)}
  .card3d.is-flipped{transform:rotateY(180deg)}
  .face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;
        filter:drop-shadow(0 18px 22px rgba(0,0,0,.26))}
  .face.back{transform:rotateY(180deg)}
  .face svg{display:block;width:100%;height:100%}
  @media (prefers-reduced-motion:reduce){.card3d{transition:none}}
  /* ---------- panel ---------- */
  .panel{border:1px solid var(--rule);border-radius:14px;background:#f8f8f5;padding:18px}
  .panel h2{margin:0 0 12px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
  .fields{display:grid;gap:10px}
  label{display:block;font:11px var(--mono);color:var(--muted);text-transform:uppercase;letter-spacing:.04em}
  input[type=text],input[type=file]{width:100%;margin-top:3px;padding:8px 10px;border:1px solid var(--rule);
        border-radius:7px;background:#fff;font:14px var(--sans);color:var(--ink)}
  input[type=file]{padding:6px;font-size:12px}
  .row{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
  button{font:600 13px var(--sans);padding:9px 13px;border-radius:7px;border:1px solid var(--rule);
        background:#fff;cursor:pointer}
  button:hover{border-color:var(--ink)}
  button.primary{background:#141413;color:#f4f4f2;border-color:#141413}
  .note{margin:14px 0 0;font:11px var(--mono);color:var(--muted);line-height:1.7}
  .cap{margin-top:18px;color:var(--muted);font:13px var(--mono);text-align:center}
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <h1>Profile card — live</h1>
    <p class="hint">drag &amp; release to swing · double-click to flip</p>
  </header>

  <div class="grid">
    <div class="stage">
      <div class="hanger swing" id="swing">
        <svg class="strap" viewBox="0 0 42 118" aria-hidden="true">
          <rect width="42" height="118" fill="#161616"/>
          <rect x="4.5" y="0" width="0" height="118" stroke="#3a3d45" stroke-width="1.5"
                stroke-dasharray="7 5" fill="none" transform="translate(5.5,0)"/>
          <line x1="5.5" y1="0" x2="5.5" y2="118" stroke="#3a3d45" stroke-width="1.5" stroke-dasharray="7 5"/>
          <line x1="36.5" y1="0" x2="36.5" y2="118" stroke="#3a3d45" stroke-width="1.5" stroke-dasharray="7 5"/>
        </svg>
        <div class="grab pull" id="grab">
          <div class="card3d" id="card3d" tabindex="0" role="group" aria-label="ID card">
            <div class="face front">@@FRONT@@</div>
            <div class="face back">@@BACK@@</div>
          </div>
        </div>
      </div>
      <p class="cap" id="cap">front</p>
    </div>

    <aside class="panel">
      <h2>Card details</h2>
      <div class="fields" id="fields"></div>
      <div class="row">
        <button type="button" id="flip">Flip card</button>
        <button type="button" id="reset">Reset</button>
      </div>
      <div class="row">
        <button type="button" class="primary" id="dl-front">Download front SVG</button>
        <button type="button" class="primary" id="dl-back">Download back SVG</button>
      </div>
      <p class="note">
        Edit the card locally. The profile photo and text stay in your browser;
        nothing is uploaded.
      </p>
    </aside>
  </div>
</div>

<script>
const FIELDS = @@FIELDS@@;
const $ = (s) => document.querySelector(s);

function setText(id, v){ const el = document.getElementById(id); if (el) el.textContent = v; }

/* ---- build the field inputs ---- */
const box = $('#fields');
FIELDS.forEach(([key, label, id, def]) => {
  const wrap = document.createElement('div');
  const lab = document.createElement('label');
  lab.textContent = label;
  const inp = document.createElement('input');
  inp.type = 'text'; inp.value = def; inp.dataset.target = id; inp.dataset.key = key;
  inp.addEventListener('input', () => {
    setText(id, inp.value);
  });
  wrap.append(lab, inp); box.append(wrap);
});

/* ---- photo (local file only) ---- */
const photoWrap = document.createElement('div');
photoWrap.innerHTML = '<label>Photo (JPG / PNG, stays local)</label>';
const photoIn = document.createElement('input');
photoIn.type = 'file'; photoIn.accept = 'image/*';
photoIn.addEventListener('change', () => {
  const f = photoIn.files[0]; if (!f) return;
  const rd = new FileReader();
  rd.onload = () => {
    const img = document.getElementById('f-photo-img');
    img.setAttribute('href', rd.result);
    img.style.display = '';
  };
  rd.readAsDataURL(f);
});
photoWrap.append(photoIn); box.append(photoWrap);

/* ---- flip ---- */
const card3d = $('#card3d');
function flip(){
  card3d.classList.toggle('is-flipped');
  $('#cap').textContent = card3d.classList.contains('is-flipped') ? 'back' : 'front';
}
$('#flip').addEventListener('click', flip);
$('#grab').addEventListener('dblclick', flip);
card3d.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
});

/* ---- swing physics ---- */
const swing = $('#swing'), grab = $('#grab');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let theta = 0, omega = 0, running = false, last = 0, drag = null;

function frame(t){
  if (!last) last = t;
  const dt = Math.min(0.05, (t - last) / 1000); last = t;
  omega += (-26 * theta - 3.4 * omega) * dt;          // spring + damping
  theta += omega * dt;
  if (Math.abs(theta) < 0.02 && Math.abs(omega) < 0.02){ theta = 0; omega = 0; running = false; }
  swing.style.setProperty('--swing', theta.toFixed(2) + 'deg');
  if (running) requestAnimationFrame(frame); else last = 0;
}
function kick(){ if (reduce) return; last = 0; if (!running){ running = true; requestAnimationFrame(frame); } }

grab.addEventListener('pointerdown', (e) => {
  if (reduce) return;
  drag = { x: e.clientX, y: e.clientY, t: performance.now(), dtheta: 0, dy: 0 };
  grab.classList.add('dragging');
  grab.setPointerCapture(e.pointerId);
});
grab.addEventListener('pointermove', (e) => {
  if (!drag) return;
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
  const now = performance.now(), dt = Math.max(8, now - drag.t);
  const next = Math.max(-34, Math.min(34, dx * 0.34));
  omega = (next - theta) / (dt / 1000) * 0.35;
  theta = next;
  drag.dtheta = dx; drag.dy = dy; drag.t = now;
  swing.style.setProperty('--swing', theta.toFixed(2) + 'deg');
  grab.style.setProperty('--pull', Math.max(0, Math.min(70, dy)) + 'px');
});
function endDrag(){
  if (!drag) return;
  grab.classList.remove('dragging');
  grab.style.setProperty('--pull', '0px');
  drag = null;
  kick();
}
grab.addEventListener('pointerup', endDrag);
grab.addEventListener('pointercancel', endDrag);

/* ---- downloads ---- */
function download(svgId, name){
  const svg = document.getElementById(svgId);
  const clone = svg.cloneNode(true);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  clone.querySelectorAll('[style]').forEach((n) => {
    if (n.style.display === 'none') n.remove();          // hide = drop from the export
  });
  const src = new XMLSerializer().serializeToString(clone);
  const blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + src], { type: 'image/svg+xml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
$('#dl-front').addEventListener('click', () => download('svg-front', 'id-card-front.svg'));
$('#dl-back').addEventListener('click', () => download('svg-back', 'id-card-back.svg'));

/* ---- reset ---- */
$('#reset').addEventListener('click', () => {
  document.querySelectorAll('#fields input[type=text]').forEach((inp) => {
    const def = (FIELDS.find((f) => f[2] === inp.dataset.target) || [])[3] ?? '';
    inp.value = def; setText(inp.dataset.target, def);
  });
  const ph = document.getElementById('f-photo-img');
  ph.setAttribute('href', '../assets/images/certificates/Confident%20Navy%20Suit%20Studio%20Portrait.png'); ph.style.display = '';
  photoIn.value = '';
  if (card3d.classList.contains('is-flipped')) flip();
});
</script>
</body>
</html>
"""

def main():
    (OUT / 'id-card-front.svg').write_text(front())
    (OUT / 'id-card-back.svg').write_text(back())

    fields_js = json.dumps([[k, l, i, v] for k, l, i, v in FIELDS])
    sans = base64.b64encode((SRC / 'fonts/archivo-latin-wdth-normal-DY7AcnAa.woff2').read_bytes()).decode()
    mono = base64.b64encode((SRC / 'fonts/ibm-plex-mono-latin-500-normal-DSY6xOcd.woff2').read_bytes()).decode()
    html = (HTML.replace('@@SANS@@', sans).replace('@@MONO@@', mono)
                .replace('@@FRONT@@', front()).replace('@@BACK@@', back())
                .replace('@@FIELDS@@', fields_js))
    (OUT / 'id-card-live.html').write_text(html)

    for f in ['id-card-front.svg', 'id-card-back.svg', 'id-card-live.html']:
        print(f, (OUT / f).stat().st_size)

if __name__ == '__main__':
    main()
