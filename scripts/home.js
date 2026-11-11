(()=>{'use strict';const S={
remediate:`-- Λletheia v1.0-RC1 · excerpt from treasury.ath
tool pay(c: Cap[Bank.Pay],
  to: Text[..16] ^ Endorsed,
  amount: Text[..16] ^ Endorsed,
  memo: Text[..60] ^ Endorsed,
  k: own IdemKey) -> Text
  ! { Bank.Pay } compensable by refund
  provider idempotent latency 5.0
  requires s.member("payees", to) &&
           s.authorizes("pay", to, amount)

let plan = refine draft by SafePlan retry 3 else {
  return "nenhuma operação executada"
}`,
rollout:`-- Λletheia v1.0-RC1 · bounded Plan and recoverable saga
type Plan =
  | Plan { pays: List[Pay, 0..3],
           finals: List[Final, 0..2],
           answer: Text[..200] }

atomic recover conserved(bank) {
  for p in pays {
    match p {
      Pay { to, amount, memo } =>
        pay(bank, to, amount, memo, keys.mint()),
    }
  }
  "lote pago"
} on failure(e) {
  return "lote estornado: " ++ e
} on compensation_failed(cf) {
  return "intervenção humana: " ++ cf
}`,
checks:`# v1.0-RC1 · reproduce with Rust + a C compiler
$ git checkout release/v1.0-rc1
$ cargo build --release -p athc -p ath-world
$ ./target/release/athc check examples/rc1/treasury.ath
$ ./target/release/athc obligations examples/rc1/treasury.ath
$ scripts/rc-smoke.sh

# The smoke script checks: typed plan, linear grants,
# real SQLite effects, SIGKILL, strict WAL and athc recover.
# Consult target/rc-smoke/ for the actual output.`};
function start(){let pre=document.getElementById('home-code');if(pre)pre.innerHTML=window.Aletheia.highlight(S.remediate);document.querySelectorAll('.sample-tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.sample-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');pre.innerHTML=window.Aletheia.highlight(S[btn.dataset.sample]||'')}));const stages=[['SYNTAX','stage0Title','stage0Description','.ath → AST'],['E0–E6','stage1Title','stage1Description','Γ; pc ⊢ e : τ'],['GRAMMAR','stage2Title','stage2Description','τ → JSON / GBNF'],['RUNTIME','stage3Title','stage3Description','ARX ↔ Python'],['EVIDENCE','stage4Title','stage4Description','Lean × ARX × Py']];const setStage=n=>{const s=stages[n];if(!s)return;document.querySelectorAll('.arch-node').forEach((b,i)=>{b.classList.toggle('active',i===n);b.setAttribute('aria-selected',String(i===n))});const a=document.getElementById('arch-label'),b=document.getElementById('arch-heading'),c=document.getElementById('arch-description'),d=document.getElementById('arch-code-tag');if(a)a.textContent=`STAGE 0${n+1} / ${s[0]}`;if(b)b.textContent=window.Aletheia.t(s[1]);if(c)c.textContent=window.Aletheia.t(s[2]);if(d)d.textContent=s[3]};document.querySelectorAll('.arch-node').forEach(x=>x.addEventListener('click',()=>setStage(Number(x.dataset.stage))));document.addEventListener('aletheia:locale',()=>{const n=Array.from(document.querySelectorAll('.arch-node')).findIndex(x=>x.classList.contains('active'));setStage(n>=0?n:0)});setStage(0)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();})();
