(()=>{'use strict';
const samples={
safe:`-- Λletheia · educational research illustration; not an RC1 compile
 type Action =
  | Restart { deploy: Text[..32] }
  | Scale { deploy: Text[..32], to: Int[2..64] }

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
forged:`-- Deliberate integrity violation: forged inventory
 type Action =
  | Restart { deploy: Text[..32] }
  | Scale { deploy: Text[..32], to: Int[2..64] }

policy SafeRemediation(a: Action) -> Bool =
  match a {
    Restart { deploy } => s.is_managed(deploy),
    Scale { deploy, to } => s.is_managed(deploy)
      && s.scale_justified(deploy, to),
  }

let draft = infer planner -> Action {
  estado = "api, worker",  -- copied literal: NOT Trusted
  metricas = s.telemetry(),
  deployment_afetado = quote(service),
  logs = quote(fit(l, 2000)),
}
let action = refine draft by SafeRemediation
  retry 2 else { "escalated" }`,
unsafe:`-- Deliberate provenance violation: unquoted logs
 type Action =
  | Restart { deploy: Text[..32] }
  | Scale { deploy: Text[..32], to: Int[2..64] }

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
  logs = fit(l, 2000),  -- untrusted source
}
let action = refine draft by SafeRemediation
  retry 2 else { "escalated" }`};
const $=s=>document.querySelector(s);let active='safe';const lang=()=>window.Λletheia.language;
function resetView(){['#step-structure','#step-integrity','#step-contract'].forEach(id=>$(id).className='analysis-step');$('#lab-out-title').textContent='● ANALYSIS / READY';$('#out-label').textContent=lang()==='pt'?'VISUALIZAÇÃO EDUCACIONAL LOCAL':'INTERACTIVE EDUCATIONAL PREVIEW';$('#out-summary').textContent=lang()==='pt'?'Pronto para inspecionar.':'Ready to inspect.';$('#out-desc').textContent=lang()==='pt'?'Escolha um exemplo, edite o código e clique Analisar. Esta visualização verifica padrões selecionados e não executa o compilador athc.':'Select a sample or edit the snippet, then select Analyze. This browser demonstration checks a few patterns; it is not the athc compiler.';$('#output-log').innerHTML='<li><span class="dim">○</span><span>awaiting local analysis...</span></li>';}
function updateNumbers(){const ed=$('#lab-editor');const lines=ed.value.split('\n');$('#line-numbers').textContent=lines.map((_,i)=>i+1).join('\n');$('#lab-linecount').textContent=`${lines.length} LINES`;const before=ed.value.slice(0,ed.selectionStart).split('\n'),row=before.length,col=before[before.length-1].length+1;$('#lab-position').textContent=`${row}:${col}`;}
function pick(id){active=id;document.querySelectorAll('.lab-tab').forEach(x=>x.classList.toggle('active',x.dataset.preset===id));$('#lab-editor').value=samples[id]||samples.safe;$('#lab-filename').textContent=`● ${id==='safe'?'safe_remediation':id==='forged'?'forged_context':'untrusted_flow'}.ath`;updateNumbers();resetView();}
function inspect(){const ed=$('#lab-editor'),value=ed.value;let issues=[];const hasAction=/\binfer\s+\w+\s*->\s*Action\b/.test(value),hasPolicy=/\bpolicy\s+SafeRemediation\b/.test(value),hasSnapshot=/\bestado\s*=\s*s\.managed\s*\(\s*\)/.test(value),hasRuntimePolicy=/\bs\.(?:is_managed|scale_justified)\s*\(/.test(value);if(hasAction&&hasRuntimePolicy&&!hasSnapshot)issues.push(['E0421','Trusted inventory missing from inference context (estado = s.managed()).','Inventário confiável ausente do contexto (estado = s.managed()).']);if(hasAction&&/\blogs\s*=\s*fit\s*\(/.test(value))issues.push(['E0415','External logs must be quoted before entering the model prompt.','Logs externos precisam de quote(...) antes do prompt.']);if(hasPolicy&&/deploy\s*==\s*"(?:api|worker)"/.test(value)&&hasSnapshot)issues.push(['E0422','Policy uses a hard-coded list while the prompt uses a host snapshot.','Política usa lista fixa enquanto o prompt recebe o snapshot do host.']);if(hasAction&&!/\blet\s+\w+\s*=\s*refine\b/.test(value))issues.push(['HINT','An inference should be reviewed by an explicit refinement policy.','Uma inferência deve ser revisada por política de refinamento.']);
const ok=issues.filter(x=>x[0]!=='HINT').length===0;$('#step-structure').className='analysis-step pass';$('#step-integrity').className=`analysis-step ${ok?'pass':'fail'}`;$('#step-contract').className=`analysis-step ${hasPolicy?'pass':''}`;$('#lab-out-title').textContent=`● ANALYSIS / ${ok?'PATTERNS ACCEPTED':'ISSUES FOUND'}`;$('#out-label').textContent=lang()==='pt'?'ANÁLISE HEURÍSTICA NO NAVEGADOR':'BROWSER-ONLY HEURISTIC ANALYSIS';$('#out-summary').textContent=ok?(lang()==='pt'?'Padrões esperados presentes.':'Expected patterns found.'):(lang()==='pt'?`${issues.length} observação(ões) de integridade.`:`${issues.length} integrity finding(s).`);$('#out-desc').textContent=ok?(lang()==='pt'?'O exemplo segue as regras ilustradas. Isso NÃO equivale a compilação, prova ou validação de execução.':'The excerpt matches the illustrated rules. This is NOT compilation, proof checking or runtime validation.'):(lang()==='pt'?'Os diagnósticos abaixo são demonstrativos, não os diagnósticos completos do athc.':'The following diagnostics are illustrative, not the full athc diagnostics.');
const logs=[{mark:'✓',cls:'success',text:'E0 / excerpt structure inspected'},{mark:ok?'✓':'×',cls:ok?'success':'error',text:`E3 / ${ok?'provenance patterns aligned':'possible provenance violation'}`},{mark:hasPolicy?'✓':'○',cls:hasPolicy?'success':'dim',text:`E5 / ${hasPolicy?'policy expression detected':'no policy detected'}`}];issues.forEach(x=>logs.push({mark:x[0]==='HINT'?'○':'×',cls:x[0]==='HINT'?'dim':'error',text:`${x[0]} / ${lang()==='pt'?x[2]:x[1]}`}));logs.push({mark:'i',cls:'dim',text:'Illustrative only · no actual model/tool execution'});const log=$('#output-log');log.innerHTML='';logs.forEach(x=>{const li=document.createElement('li');const a=document.createElement('span');a.className=x.cls;a.textContent=x.mark;const b=document.createElement('span');b.textContent=x.text;li.append(a,b);log.append(li)});}
function init(){pick('safe');const ed=$('#lab-editor');ed.addEventListener('input',updateNumbers);ed.addEventListener('keyup',updateNumbers);ed.addEventListener('click',updateNumbers);ed.addEventListener('scroll',()=>{$('#line-numbers').scrollTop=ed.scrollTop});ed.addEventListener('keydown',event=>{if(event.key==='Tab'){event.preventDefault();let st=ed.selectionStart;ed.setRangeText('  ',st,ed.selectionEnd,'end');updateNumbers()}if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){event.preventDefault();inspect()}});document.querySelectorAll('.lab-tab').forEach(b=>b.addEventListener('click',()=>pick(b.dataset.preset)));$('#lab-run').addEventListener('click',inspect);$('#lab-reset').addEventListener('click',()=>pick(active));$('#lab-copy').addEventListener('click',()=>window.Λletheia.copyText(ed.value));$('#lab-download').addEventListener('click',()=>{const blob=new Blob([ed.value],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=(active==='safe'?'safe_remediation':active==='forged'?'forged_context':'untrusted_flow')+'.ath';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500)});document.addEventListener('aletheia:locale',localize);localize()}
function localize(){const pt=lang()==='pt';$('#lab-hero-title').textContent=pt?'Pense em':'Think in';$('#lab-hero-accent').textContent=pt?'invariantes.':'invariants.';$('#lab-hero-desc').textContent=pt?'Explore programas agênticos tipados, diagnósticos ilustrativos e o modelo de execução. Nenhum compilador ou LLM real é executado no navegador.':'Explore typed agent programs, inspect illustrative diagnostics and learn the Λletheia execution model. No real compiler or LLM runs in your browser.';$('#lab-toolbar-status').textContent=pt?'ATH LAB / VISUALIZAÇÃO SINTÁTICA':'ATH LAB / SYNTAX ILLUSTRATION';$('#lab-run').textContent=pt?'Analisar ↗':'Analyze ↗';$('#lab-copy').textContent=pt?'Copiar':'Copy';$('#lab-reset').textContent=pt?'Restaurar':'Reset';$('#lab-download').textContent=pt?'Salvar .ath':'Save .ath';$('#lab-disclaimer').textContent=pt?'Esta é uma visualização educacional local, não um build remoto simulado. Compilação real, provas formais e execução exigem o toolchain athc de código aberto. Você pode copiar o trecho e testá-lo no repositório.':'This is an honest, browser-only educational visualization, not a fake remote build. Verified compilation, formal theorems and runtime execution require the open-source athc toolchain. You can copy the snippet and test it in the repository.';resetView()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
