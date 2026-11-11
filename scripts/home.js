(()=>{'use strict';const S={
remediate:`-- Excerpt from the Rev7 research phase design
policy SafeRemediation(a: Action) -> Bool =
  match a {
    Restart { deploy } => s.is_managed(deploy),
    Scale { deploy, to } => s.is_managed(deploy)
      && s.scale_justified(deploy, to),
  }

let draft = infer planner -> Action {
  estado = s.managed(),
  metricas = s.telemetry(),
  deployment_afetado = quote(service),
  logs = quote(fit(l, 2000)),
}
let action = refine draft by SafeRemediation
  retry 2 else { "escalated" }`,
rollout:`-- Bounded plans are part of the type
 type Action =
  | Restart { deploy: Text[..32] }
  | Scale { deploy: Text[..32], to: Int[2..64] }

policy SafePlan(p: List[Action, 1..3]) -> Bool =
  all a in p => SafeAction(a)

let draft = infer planner -> List[Action, 1..3] {
  estado = s.managed(),
  metricas = s.telemetry(),
  logs = quote(fit(l, 2000)),
}
let plan = refine draft by SafePlan retry 2
for a in plan {
  -- Effects require matching Cap[E]
  ...
}`,
checks:`$ athc check examples/rollout.ath

✓ E0   Structure       definitions resolved
✓ E1   Linearity       IdemKey and Pending tracked
✓ E2   Effects         capabilities checked
✓ E3   Integrity       untrusted flow verified
✓ E5   Refinements     bounds discharged
✓ E6   Resources       worst-case budget bounded
✓ Δ    Model contract  versioned and recorded
✓ Codex               canonical BLAKE3 root

# Illustrative excerpt of Rev7 CLI output.
# Run athc locally for actual verification.`};
function start(){let pre=document.getElementById('home-code');if(pre)pre.innerHTML=window.Aletheia.highlight(S.remediate);document.querySelectorAll('.sample-tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.sample-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');pre.innerHTML=window.Aletheia.highlight(S[btn.dataset.sample]||'')}));const stages=[['SYNTAX','stage0Title','stage0Description','.ath → AST'],['E0–E6','stage1Title','stage1Description','Γ; pc ⊢ e : τ'],['GRAMMAR','stage2Title','stage2Description','τ → JSON / GBNF'],['RUNTIME','stage3Title','stage3Description','ARX ↔ Python'],['EVIDENCE','stage4Title','stage4Description','Lean × ARX × Py']];const setStage=n=>{const s=stages[n];if(!s)return;document.querySelectorAll('.arch-node').forEach((b,i)=>{b.classList.toggle('active',i===n);b.setAttribute('aria-selected',String(i===n))});const a=document.getElementById('arch-label'),b=document.getElementById('arch-heading'),c=document.getElementById('arch-description'),d=document.getElementById('arch-code-tag');if(a)a.textContent=`STAGE 0${n+1} / ${s[0]}`;if(b)b.textContent=window.Aletheia.t(s[1]);if(c)c.textContent=window.Aletheia.t(s[2]);if(d)d.textContent=s[3]};document.querySelectorAll('.arch-node').forEach(x=>x.addEventListener('click',()=>setStage(Number(x.dataset.stage))));document.addEventListener('aletheia:locale',()=>{const n=Array.from(document.querySelectorAll('.arch-node')).findIndex(x=>x.classList.contains('active'));setStage(n>=0?n:0)});setStage(0)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();})();
