(function academyMain(){
  'use strict';
  const lessons=[
    {id:"welcome",group:"01 / FOUNDATIONS",title:{en:"Your first Λletheia program",pt:"Seu primeiro programa Λletheia"},lead:{en:"From source checkout to a reproducible, fully local, zero-paid-model execution.",pt:"Do código-fonte até uma execução reproduzível, local e sem modelo pago."},sections:[
      {title:{en:"Why learn this language?",pt:"Por que aprender esta linguagem?"},body:{en:"Λletheia is a programming language for agentic systems. It combines typed model output, policies, authority, durable effects and verifiable journals rather than relying only on instructions to a model.",pt:"Λletheia é uma linguagem de programação para sistemas agênticos. Integra saída tipada de modelos, políticas, autoridade, efeitos duráveis e journals verificáveis, em vez de depender apenas de instruções ao modelo."}},
      {title:{en:"Your development environment",pt:"Seu ambiente de desenvolvimento"},body:{en:"Install stable Rust/Cargo and a C compiler. The v1.0-RC1 demonstration builds SQLite into its local service. No Groq key is required. The release candidate is currently a draft branch, not the published main branch." ,pt:"Instale Rust/Cargo estável e um compilador C. A demonstração v1.0-RC1 compila SQLite com o serviço local. Não é necessário possuir uma chave Groq. O release candidate ainda está em uma branch de rascunho, não na main publicada."},code:String.raw`git clone https://github.com/Antoniorjr4/Aletheia
cd Aletheia
git checkout release/v1.0-rc1
scripts/rc-smoke.sh`,language:"bash"},
      {title:{en:"Observe your evidence",pt:"Observe suas evidências"},body:{en:"The script builds athc and ath-world, runs the legitimate request, rejects an injected instruction, deliberately kills a process and checks recovery. Inspect target/rc-smoke/ for the WAL, reports, journal and SQLite database.",pt:"O script compila athc e ath-world, executa um pedido legítimo, recusa uma instrução injetada, mata deliberadamente um processo e confere a recuperação. Consulte target/rc-smoke/ para WAL, relatórios, journal e banco SQLite."}}
    ],question:{en:"Which command runs the complete RC1 demonstration without a paid model?",pt:"Qual comando executa a demonstração RC1 completa sem modelo pago?"},options:{en:["scripts/rc-smoke.sh","pip install langchain","athc run --provider groq"],pt:["scripts/rc-smoke.sh","pip install langchain","athc run --provider groq"]},correct:0,explain:{en:"The smoke script uses a scripted model and a real local SQLite-backed service.",pt:"O smoke usa um modelo roteirizado e um serviço local real com SQLite."}},
    {id:"types",group:"01 / FOUNDATIONS",title:{en:"Types before prompts",pt:"Tipos antes de prompts"},lead:{en:"Learn algebraic types and bounded model outputs through the RC1 treasury program.",pt:"Aprenda tipos algébricos e saídas limitadas no programa de tesouraria do RC1."},sections:[
      {title:{en:"A plan is a type",pt:"Um plano é um tipo"},body:{en:"The model proposes values belonging to Plan. Variants and bounded lists are checked before an effect can run. This is an excerpt from examples/rc1/treasury.ath.",pt:"O modelo propõe valores do tipo Plan. Variantes e listas limitadas são conferidas antes de executar efeitos. Trecho de examples/rc1/treasury.ath."},language:"ath",code:String.raw`type Pay =
  | Pay { to: Text[..16], amount: Text[..16], memo: Text[..60] }

type Final =
  | Schedule { to: Text[..16], amount: Text[..16], date: Text[..10] }
  | Wire     { to: Text[..16], amount: Text[..16] }

type Plan =
  | Plan { pays: List[Pay, 0..3],
           finals: List[Final, 0..2], answer: Text[..200] }`},
      {title:{en:"Bounded work",pt:"Trabalho limitado"},body:{en:"List[Pay, 0..3] gives a finite upper bound for a payment batch. Bounds matter for the checker’s worst-case resource accounting, not only JSON validity.",pt:"List[Pay, 0..3] impõe um teto finito ao lote de pagamentos. Os limites servem ao cálculo estático de recursos, não apenas à validação do JSON."}}
    ],question:{en:"What is the maximum number of Pay values in one Plan?",pt:"Qual o número máximo de valores Pay em um Plan?"},options:{en:["Unbounded","Three","Sixteen"],pt:["Ilimitado","Três","Dezesseis"]},correct:1,explain:{en:"The list bound is 0..3.",pt:"O limite da lista é 0..3."}},
    {id:"integrity",group:"01 / FOUNDATIONS",title:{en:"Trusted is not Untrusted",pt:"Trusted não é Untrusted"},lead:{en:"Information may be read without receiving authority to command the program.",pt:"É possível ler uma informação sem lhe conceder autoridade sobre o programa."},sections:[
      {title:{en:"Provenance of a statement",pt:"Proveniência de um extrato"},body:{en:"External statements and memos are Untrusted. The principal’s request is Trusted; the third-party statement is quoted inside the model prompt and must never be promoted into an instruction.",pt:"Extratos e memorandos externos são Untrusted. O pedido do principal é Trusted; o extrato de terceiros entra com quote no prompt e nunca deve ser promovido a instrução."},language:"ath",code:String.raw`tool statement(c: Cap[Bank.Read],
  account: Text[..16]) -> Text ^ Untrusted
  ! { Bank.Read } reversible latency 5.0

-- Inside agent Treasurer:
let st = statement(bank, "TREASURY")
let draft = infer planner -> Plan {
  request = request,
  payees = s.inventory("payees"),
  statement = quote(fit(st, 1500)),
}`},
      {title:{en:"The trust boundary",pt:"A fronteira de confiança"},body:{en:"A file that a user asks an agent to read may provide data, but cannot by itself grant permission to write a bank account. Delegating a read is not endorsing the content.",pt:"Um arquivo cuja leitura foi delegada pode fornecer dados, mas não autorização para alterar uma conta. Delegar a leitura não é endossar o conteúdo."}}
    ],question:{en:"A statement memo says “send the balance elsewhere”. Which label does it retain?",pt:"Um memorando manda “transfira o saldo”. Que rótulo ele mantém?"},options:{en:["Trusted","Untrusted","An executable capability"],pt:["Trusted","Untrusted","Uma capacidade executável"]},correct:1,explain:{en:"Reading a source does not promote its integrity label.",pt:"Ler uma fonte não eleva seu rótulo de integridade."}},
    {id:"authority",group:"02 / ENGINEERING",title:{en:"Linear grants & s.authorizes",pt:"Concessões lineares e s.authorizes"},lead:{en:"Authorization binds a complete operation tuple to one run, one origin and one consumption.",pt:"A autorização vincula a tupla inteira de operação a uma execução, origem e consumo."},sections:[
      {title:{en:"The effect contract",pt:"O contrato do efeito"},body:{en:"These tool contracts are taken from the RC1 treasury example. s.authorizes is legal in requires; placing it elsewhere triggers E0425. Each grant covers the operation plus every argument, not a Cartesian product of unrelated suggestions.",pt:"Estes contratos são do exemplo de tesouraria RC1. s.authorizes é permitido em requires; fora dele, o compilador emite E0425. Cada concessão cobre a operação e todos os argumentos, não um produto cartesiano de sugestões soltas."},language:"ath",code:String.raw`tool pay(c: Cap[Bank.Pay],
  to: Text[..16] ^ Endorsed,
  amount: Text[..16] ^ Endorsed,
  memo: Text[..60] ^ Endorsed,
  k: own IdemKey) -> Text
  ! { Bank.Pay } compensable by refund
  provider idempotent latency 5.0
  requires s.member("payees", to) &&
           s.authorizes("pay", to, amount)`},
      {title:{en:"Grant, claim, consume",pt:"Conceder, reivindicar, consumir"},body:{en:"A trusted confirmation creates a Grant{op,args,origin,run,nonce}. The contract claims it and the external effect consumes it. The consumed record is fsynced before the effect, preventing reuse by a later process.",pt:"Uma confirmação autorizada cria Grant{op,args,origin,run,nonce}. O contrato reivindica a concessão e o efeito externo a consome. O registro é sincronizado antes do efeito, impedindo reuso por outro processo."},code:String.raw`# A confirmed intent from examples/rc1/fixtures:
./target/release/athc grant \
  --run legit \
  --origin "confirmation:academy" \
  --out target/academy/legit.grants.json \
  --from examples/rc1/fixtures/intent.json`,language:"bash"}
    ],question:{en:"If an intent authorizes pay(ACME,100), can it authorize pay(ACME,250)?",pt:"Se uma intenção autoriza pay(ACME,100), ela autoriza pay(ACME,250)?"},options:{en:["Yes: same payee","No: the amount is part of the tuple","Yes: amounts are interchangeable"],pt:["Sim: mesmo destinatário","Não: o valor integra a tupla","Sim: valores são intercambiáveis"]},correct:1,explain:{en:"Grant matching uses the complete operation tuple.",pt:"A concessão corresponde à tupla completa."}},
    {id:"policy",group:"02 / ENGINEERING",title:{en:"Policy and refinement",pt:"Política e refinamento"},lead:{en:"The model suggests. The policy and lifted effect obligations decide what may proceed.",pt:"O modelo propõe. A política e as obrigações levantadas dos efeitos decidem o que prossegue."},sections:[
      {title:{en:"A single verification boundary",pt:"Uma única fronteira de verificação"},body:{en:"RC1 uses refine with SafePlan to check the trusted payee set and the lifted requires clauses before an effect. The fallback returns without executing a payment.",pt:"O RC1 usa refine com SafePlan para conferir beneficiários confiáveis e cláusulas requires levantadas antes de qualquer efeito. O fallback retorna sem executar pagamentos."},language:"ath",code:String.raw`policy SafePlan(p: Plan) -> Bool =
  match p {
    Plan { pays, finals } =>
      (all x in pays => SafePay(x)) &&
      (all f in finals => SafeFinal(f)),
  }

let plan = refine draft by SafePlan retry 3 else {
  return "nenhuma operação executada"
}`},
      {title:{en:"Prove the obligations are checked",pt:"Verifique o descarregamento das obrigações"},body:{en:"Run athc obligations on the RC1 program to inspect the three lifted effect contracts. A compiling plan is not a blanket permission; each pending grant is also checked against trusted confirmation.",pt:"Execute athc obligations no programa RC1 para conferir os três contratos de efeito levantados. Um plano que compila não recebe permissão universal; toda concessão pendente também é conferida."},code:String.raw`cargo run --release --bin athc -- \
  obligations examples/rc1/treasury.ath`,language:"bash"}
    ],question:{en:"Which construction prevents an attacker plan from reaching a side effect?",pt:"Qual construção impede que um plano adversarial alcance o efeito?"},options:{en:["refine with policy and obligations","a friendly model prompt alone","a try/except around the tool"],pt:["refine com política e obrigações","apenas um prompt amigável","try/except na ferramenta"]},correct:0,explain:{en:"The checks are enforced before effects; the prompt is not an authority boundary.",pt:"Os contratos são aplicados antes dos efeitos; o prompt não é fronteira de autoridade."}},
    {id:"sagas",group:"02 / ENGINEERING",title:{en:"Sagas & compensation",pt:"Sagas e compensação"},lead:{en:"Protect multistep state changes with explicit compensation and restored invariants.",pt:"Proteja mudanças de estado em várias etapas com compensação explícita e invariantes."},sections:[
      {title:{en:"An atomic payment batch",pt:"Um lote de pagamentos atômico"},body:{en:"The treasury program places the compensable payment batch inside atomic recover conserved(bank). Refunds run if the batch fails, and the conserved invariant is checked. Irrevocable operations are outside the saga.",pt:"O programa de tesouraria coloca o lote compensável em atomic recover conserved(bank). Em falha, ocorrem estornos e a invariante conserved é verificada. Operações irrevogáveis ficam fora da saga."},language:"ath",code:String.raw`atomic recover conserved(bank) {
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
}`},
      {title:{en:"Compensation is not time travel",pt:"Compensar não é voltar no tempo"},body:{en:"The objective is a restored invariant, not an identical previous world. Recovery may require additional remote calls and can legitimately escalate unresolved outcomes.",pt:"O objetivo é restaurar uma invariante, não recriar um mundo idêntico. A recuperação pode exigir chamadas adicionais e pode escalar resultados inconclusivos."}}
    ],question:{en:"Where do irrevocable schedule and wire operations run in RC1?",pt:"Onde executam as operações irrevogáveis schedule e wire no RC1?"},options:{en:["Inside the payment saga","Outside the saga through commit","In a model prompt"],pt:["Dentro da saga de pagamentos","Fora da saga, por commit","Em um prompt do modelo"]},correct:1,explain:{en:"The RC1 example keeps irrevocable operations outside compensable atomic recovery.",pt:"O exemplo RC1 mantém efeitos irrevogáveis fora da recuperação atômica compensável."}},
    {id:"wal",group:"03 / SYSTEMS",title:{en:"Strict WAL, SIGKILL & recover",pt:"WAL estrito, SIGKILL e recover"},lead:{en:"Test the difference between a process crash, an unknown remote outcome and a verified recovery.",pt:"Teste a diferença entre queda de processo, resultado remoto desconhecido e recuperação verificada."},sections:[
      {title:{en:"A real crash, a new process",pt:"Uma queda real, um novo processo"},body:{en:"The RC1 script sends SIGKILL to the running process at four checkpoint stages across four operation classes. The remote ath-world maintains SQLite state. Another process runs athc recover.",pt:"O script RC1 envia SIGKILL ao processo em quatro pontos de queda e quatro classes de operação. O ath-world remoto mantém o estado SQLite. Outro processo executa athc recover."},language:"bash",code:String.raw`# Safest full reproduction:
scripts/rc-smoke.sh

# After completion inspect the generated evidence:
ls target/rc-smoke/
./target/release/ath-world state \
  --db target/rc-smoke/bank.sqlite`},
      {title:{en:"Three recovery outcomes",pt:"Três resultados de recuperação"},body:{en:"Exit 0 means no pending obligations; 3 means escalation/manual intervention; 2 means an unreadable, corrupted, missing or foreign WAL and no new sends. For an idempotent provider the same key may be resent; queryable providers are queried, never resent; opaque providers are escalated.",pt:"Saída 0: nenhuma pendência; 3: escalonamento/intervenção; 2: WAL ilegível, corrompido, ausente ou de outro programa, sem novos envios. Provedor idempotente permite reenvio com a mesma chave; consultável é consultado, não reenviado; opaco é escalado."}},
      {title:{en:"A journal must not forget",pt:"Um journal não pode esquecer"},body:{en:"RC1 treats a corrupt middle WAL record as W0002 and a torn trailing line explicitly. No unreadable log silently becomes an empty log. The provider’s declared semantics are assumptions and must be verified for any real integration.",pt:"No RC1, uma linha intermediária corrompida produz W0002 e uma linha final rasgada recebe tratamento explícito. Log ilegível nunca vira log vazio silenciosamente. As classes declaradas dos provedores são hipóteses que precisam ser verificadas em integração real."}}
    ],question:{en:"A remote wire provider is opaque and a response is lost. What may recover do?",pt:"Um provedor wire é opaco e sua resposta se perde. O que recover deve fazer?"},options:{en:["Retry until it succeeds","Declare failure","Escalate without blindly resending"],pt:["Reenviar até dar certo","Declarar falha","Escalar sem reenvio às cegas"]},correct:2,explain:{en:"Unknown is not Failed. An opaque provider cannot prove exactly-once completion.",pt:"Desconhecido não significa Failed. Um provedor opaco não comprova conclusão exatamente uma vez."}},
    {id:"formal",group:"03 / SYSTEMS",title:{en:"Proofs, tests & their limits",pt:"Provas, testes e limites"},lead:{en:"Read the RC1 evidence like an engineer: numbers, scope, assumptions and independent reproduction.",pt:"Leia as evidências RC1 como engenheiro: números, escopo, hipóteses e reprodução."},sections:[
      {title:{en:"Reproduce the validation",pt:"Reproduza a validação"},body:{en:"RC1 reports 131 passing Rust tests, 26/26 Lean–ARX–Python differential cases and 96 Lean axiom guards, without sorry. The adversarial grants harness reports 33/33 refusals and 8/8 legitimate controls in each of its two variants.",pt:"O RC1 relata 131 testes Rust aprovados, 26/26 diferenciais Lean–ARX–Python e 96 guardas de axiomas Lean, sem sorry. O harness de concessões relata 33/33 recusas e 8/8 controles legítimos em cada uma das duas variantes."},language:"bash",code:String.raw`cargo test --all
(cd lean && lake build --wfail)
python3 bench/adversarial/harness.py --grants`},
      {title:{en:"What a proof does not establish",pt:"O que uma prova não estabelece"},body:{en:"Lean Grant.lean proves matching and consumption in the formal model. The durability of fsync, authenticity of confirmation files, concurrent writers and real provider contracts are separate assumptions or tests. A release candidate is not a safety certification.",pt:"O Grant.lean do Lean prova correspondência e consumo no modelo formal. Durabilidade do fsync, autenticidade dos arquivos de confirmação, concorrência entre escritores e contratos de provedores reais são hipóteses ou testes separados. Release candidate não é certificação de segurança."}}
    ],question:{en:"Are 96 axiom guards equivalent to 96 separately proven theorems?",pt:"96 guardas de axiomas equivalem a 96 teoremas diferentes provados?"},options:{en:["Yes","No; guards audit proof dependencies","Only if Groq is connected"],pt:["Sim","Não; guardas auditam dependências das provas","Somente com Groq conectado"]},correct:1,explain:{en:"Guard counts audit the axiom dependencies; they are not theorem-family counts.",pt:"Guardas auditam dependências dos teoremas; não representam número de famílias distintas."}},
    {id:"capstone",group:"04 / CAPSTONE",title:{en:"Engineer a verifiable transaction",pt:"Engenhe uma transação verificável"},lead:{en:"Combine language, authorization, recovery and evidence in a reproducible final exercise.",pt:"Integre linguagem, autorização, recuperação e evidências em um exercício final reproduzível."},sections:[
      {title:{en:"Capstone challenge",pt:"Desafio final"},body:{en:"Run scripts/rc-smoke.sh, compare the legitimate and adversarial WALs, locate the durable grant-consumption records, and explain why queryable schedule differs from opaque wire. Use the original project documentation as your evidence.",pt:"Execute scripts/rc-smoke.sh, compare os WALs legítimo e adversarial, localize os registros duráveis de consumo de concessões e explique por que schedule consultável difere de wire opaco. Use a documentação original como evidência."}},
      {title:{en:"Submission checklist",pt:"Lista de entrega"},body:{en:"Your report should document (1) the source commit; (2) the check/obligations output; (3) the three authorization barriers; (4) a SIGKILL trace and recovery decision; (5) limitations and assumptions. Share no secret keys or real banking identifiers.",pt:"Seu relatório deve documentar (1) commit de origem; (2) saída de check/obligations; (3) as três barreiras de autorização; (4) um traço SIGKILL e a decisão de recuperação; (5) limites e hipóteses. Não compartilhe chaves ou identificadores bancários reais."},code:String.raw`git rev-parse --short HEAD
cargo run --release --bin athc -- \
  check examples/rc1/treasury.ath
cargo run --release --bin athc -- \
  obligations examples/rc1/treasury.ath
scripts/rc-smoke.sh`,language:"bash"},
      {title:{en:"Continue into research",pt:"Avance para a pesquisa"},body:{en:"Read docs/RC1.md and lean/Aletheia/Grant.lean in the RC1 branch. The current course stores completion only in this browser; it awards no formal degree or certificate.",pt:"Leia docs/RC1.md e lean/Aletheia/Grant.lean na branch RC1. A conclusão do curso é armazenada somente neste navegador; não emite diploma nem certificado formal."}}
    ],question:{en:"What should you report when an opaque transfer cannot be reconciled?",pt:"O que registrar quando uma transferência opaca não pode ser reconciliada?"},options:{en:["Recovered successfully","Escalated, with an open obligation","Never happened"],pt:["Recuperada com sucesso","Escalada, com obrigação pendente","Nunca aconteceu"]},correct:1,explain:{en:"An unresolved outcome remains explicit; it cannot be silently discarded.",pt:"O resultado não resolvido permanece explícito; não pode ser descartado silenciosamente."}}
  ];
  const $=sel=>document.querySelector(sel);
  const locale=()=>window.Aletheia.language;
  const escapeHTML=v=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
  let current=lessons[0].id,query="",completed=[];
  try{completed=JSON.parse(localStorage.getItem("aletheia-academy-rc1-progress")||"[]")}catch{}
  if(!Array.isArray(completed))completed=[];
  completed=completed.filter(id=>lessons.some(t=>t.id===id));
  const getLesson=()=>lessons.find(x=>x.id===current)||lessons[0];
  function nav(){
    const lang=locale();
    const count=completed.length;
    const side=$("#docs-sidebar-label");
    if(side)side.textContent=(lang==="en"?"LEARNING PATH":"TRILHA DE APRENDIZAGEM")+` · ${count}/${lessons.length}`;
    const visible=lessons.filter(x=>`${x.group} ${x.title.en} ${x.title.pt} ${x.lead.en} ${x.lead.pt} ${x.sections.map(y=>y.title.en+" "+y.title.pt).join(" ")}`.toLowerCase().includes(query));
    $("#docs-nav").innerHTML=visible.map((x,i)=>`<button class="docs-nav-item ${x.id===current?"active":""}" data-lesson="${x.id}"><small>${completed.includes(x.id)?"✓":String(lessons.indexOf(x)+1).padStart(2,"0")}</small><span>${escapeHTML(x.title[lang])}</span></button>`).join("")||`<div class="docs-empty">${lang==="en"?"No lessons found.":"Nenhuma aula encontrada."}</div>`;
    $("#docs-nav").querySelectorAll("[data-lesson]").forEach(btn=>btn.addEventListener("click",()=>setLesson(btn.dataset.lesson)));
  }
  function render(){
    const lang=locale(),lesson=getLesson(),idx=lessons.indexOf(lesson);
    document.title=lesson.title[lang]+" — Λletheia Academy";
    $("#docs-crumb").innerHTML=`ACADEMY <span>/</span> ${escapeHTML(lesson.group)}`;
    let html=`<h1>${escapeHTML(lesson.title[lang])}</h1><p class="article-lead">${escapeHTML(lesson.lead[lang])}</p>`;
    html+=`<div class="doc-note"><strong>${lang==="en"?"Release candidate learning track":"Trilha de estudo de release candidate"}.</strong> ${lang==="en"?"Hands-on examples require the RC1 source branch. The browser exercises do not execute athc or certify a student.":"Os exemplos práticos exigem a branch RC1. Os exercícios do navegador não executam athc nem certificam o aluno."}</div>`;
    lesson.sections.forEach((section,i)=>{
      html+=`<section><h2 id="section-${i}">${escapeHTML(section.title[lang])}</h2><p>${escapeHTML(section.body[lang])}</p>`;
      if(section.code)html+=`<div class="doc-code-header"><span>${escapeHTML(section.language||"ath")} · ${lang==="en"?"from the RC1 source":"da fonte RC1"}</span><button class="doc-copy" data-code="${i}">${lang==="en"?"Copy":"Copiar"} ⧉</button></div><pre><code>${window.Aletheia.highlight(section.code)}</code></pre>`;
      html+="</section>";
    });
    html+=`<section><h2 id="section-${lesson.sections.length}">${lang==="en"?"Knowledge check":"Verificação de aprendizagem"}</h2><p>${escapeHTML(lesson.question[lang])}</p>`;
    html+=`<div role="group" aria-label="${lang==="en"?"Select your answer":"Selecione sua resposta"}">${lesson.options[lang].map((answer,i)=>`<button class="docs-nav-item" data-answer="${i}"><small>${String.fromCharCode(65+i)}</small><span>${escapeHTML(answer)}</span></button>`).join("")}</div><div id="academy-feedback" aria-live="polite"></div></section>`;
    $("#docs-article").innerHTML=html;
    $("#docs-article").querySelectorAll("[data-code]").forEach(btn=>btn.addEventListener("click",()=>window.Aletheia.copyText(lesson.sections[Number(btn.dataset.code)].code)));
    $("#docs-article").querySelectorAll("[data-answer]").forEach(btn=>btn.addEventListener("click",()=>{
      const isCorrect=Number(btn.dataset.answer)===lesson.correct;
      $("#academy-feedback").innerHTML=`<div class="doc-note"><strong>${isCorrect?(lang==="en"?"Correct.":"Correto."):(lang==="en"?"Not yet. Try another answer.":"Ainda não. Tente novamente.")}</strong> ${isCorrect?escapeHTML(lesson.explain[lang]):""}</div>`;
      if(isCorrect&&!completed.includes(lesson.id)){completed.push(lesson.id);try{localStorage.setItem("aletheia-academy-rc1-progress",JSON.stringify(completed))}catch{}nav();}
    }));
    $("#docs-toc-links").innerHTML=lesson.sections.map((x,i)=>`<a href="#section-${i}" class="toc-link">${escapeHTML(x.title[lang])}</a>`).join("")+`<a href="#section-${lesson.sections.length}" class="toc-link">${lang==="en"?"Knowledge check":"Verificação"}</a>`;
    $("#doc-prevnext").innerHTML=(idx>0?`<a class="doc-pager" href="#${lessons[idx-1].id}"><small>← ${lang==="en"?"PREVIOUS":"ANTERIOR"}</small>${escapeHTML(lessons[idx-1].title[lang])}</a>`:"<span></span>")+(idx<lessons.length-1?`<a class="doc-pager" href="#${lessons[idx+1].id}"><small>${lang==="en"?"NEXT":"PRÓXIMA"} →</small>${escapeHTML(lessons[idx+1].title[lang])}</a>`:"<span></span>");
  }
  function setLesson(id,historyUpdate=true,scroll=true){
    current=lessons.some(x=>x.id===id)?id:lessons[0].id;
    nav();render();
    if(historyUpdate)history.replaceState(null,"","#"+current);
    if(scroll)window.scrollTo({top:document.querySelector(".docs-shell").getBoundingClientRect().top+window.scrollY-85,behavior:"smooth"});
  }
  function localize(){
    const lang=locale();
    $("#docs-hero-title").textContent=lang==="en"?"Learn the":"Aprenda a";
    $("#docs-hero-accent").textContent=lang==="en"?"language.":"linguagem.";
    $("#docs-hero-desc").textContent=lang==="en"?"Λletheia Academy: a progressive, free path from typed programs to real crash recovery. Learn through primary source code, reproducible commands and short checks.":"Λletheia Academy: uma trilha gratuita e progressiva, de programas tipados à recuperação após falhas reais. Aprenda com código-fonte, comandos reproduzíveis e verificações curtas.";
    $("#docs-search").placeholder=lang==="en"?"Search lessons...":"Pesquisar aulas...";
    $("#docs-toc-title").textContent=lang==="en"?"IN THIS LESSON":"NESTA AULA";
    nav();render();
  }
  function boot(){
    localize();
    $("#docs-search").addEventListener("input",event=>{query=event.target.value.trim().toLowerCase();nav()});
    document.addEventListener("keydown",event=>{
      if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="k"){event.preventDefault();$("#docs-search").focus()}
      if(event.key==="Escape"&&document.activeElement===$("#docs-search"))$("#docs-search").blur();
    });
    document.addEventListener("aletheia:locale",localize);
    window.addEventListener("hashchange",()=>{const id=location.hash.slice(1);if(lessons.some(x=>x.id===id))setLesson(id,false)});
    setLesson(location.hash.slice(1)||lessons[0].id,false,Boolean(location.hash));
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();
