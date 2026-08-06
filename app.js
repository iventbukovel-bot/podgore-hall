const DEFAULTS={
  heroImage:"",
  phone:"+38 (___) ___-__-__",
  events:[
    {name:"Конференція",desc:"Діловий простір із технічним супроводом",image:""},
    {name:"Бізнес-форум",desc:"Великий формат, сцена, звук та кава-брейки",image:""},
    {name:"Весілля",desc:"Святкування з атмосферою Карпат",image:""},
    {name:"День народження",desc:"Особливий сценарій для вашого дня",image:""},
    {name:"Корпоратив",desc:"Командні події та вечірні програми",image:""},
    {name:"Ретрит і тренінг",desc:"Навчання, відновлення та робота команди",image:""}
  ],
  packages:[
    {name:"Мінімальний",price:1250,tag:"Базова організація",items:["Оренда зали до 6 годин","Стандартна розстановка меблів","Екран або проєктор","Базове меню","Обслуговування персоналом","Фінальне прибирання"]},
    {name:"Медіум",price:1850,tag:"Оптимальний вибір",items:["Усе з пакета Мінімальний","Розширене меню","Кава-брейк або welcome-зона","Звук та два мікрофони","Базове оформлення простору","Персональний координатор"]},
    {name:"Преміум",price:2750,tag:"Подія під ключ",items:["Усе з пакета Медіум","Преміальне меню","Індивідуальна концепція події","Розширене технічне забезпечення","Декор і фотозона","Координація у день події"]}
  ],
  extras:[
    {name:"Декор",price:25000},{name:"DJ та звук",price:18000},{name:"Фотозона",price:12000},{name:"Ведучий",price:20000},{name:"Трансфер",price:8000},{name:"SPA для гостей",price:15000}
  ],
  gallery:["","","","","",""],
  benefits:["Готель і проживання","Ресторанне обслуговування","SPA та басейн","Паркінг","Професійний звук","Генератор та укриття","Трансфер","Персональний координатор"]
};
const config=JSON.parse(localStorage.getItem('podgoreConfig')||'null')||DEFAULTS;
const money=n=>new Intl.NumberFormat('uk-UA').format(n)+' грн';
if(config.heroImage){const h=document.getElementById('heroMedia');h.classList.add('has-image');h.style.backgroundImage=`url(${config.heroImage})`;h.innerHTML=''}
const eventGrid=document.getElementById('eventGrid');
config.events.forEach((e,i)=>{eventGrid.insertAdjacentHTML('beforeend',`<article class="event-card reveal"><div class="event-media" ${e.image?`style="background-image:url('${e.image}')"`:''}></div>${!e.image?'<span class="photo-label">Місце для фото</span>':''}<div class="event-copy"><h3>${e.name}</h3><p>${e.desc}</p></div></article>`)});
const eventType=document.getElementById('eventType');config.events.forEach(e=>eventType.add(new Option(e.name,e.name)));
let activePackage=1;
const tabs=document.getElementById('packageTabs'),panel=document.getElementById('packagePanel'),packageSelect=document.getElementById('packageSelect');
config.packages.forEach((p,i)=>{tabs.insertAdjacentHTML('beforeend',`<button class="package-tab ${i===1?'active':''}" data-i="${i}">${p.name}</button>`);packageSelect.add(new Option(`${p.name} — ${money(p.price)}/особа`,i))});packageSelect.value=1;
function renderPackage(i){activePackage=i;const p=config.packages[i];document.querySelectorAll('.package-tab').forEach((b,j)=>b.classList.toggle('active',j===i));panel.innerHTML=`<div class="package-visual">Місце для фото пакета</div><div class="package-content"><p class="eyebrow">${p.tag}</p><h3>${p.name}</h3><p class="price">від ${money(p.price)} / особа</p><ul>${p.items.map(x=>`<li>${x}</li>`).join('')}</ul><a href="#calculator" class="button">Розрахувати цей пакет</a></div>`}
renderPackage(1);tabs.onclick=e=>{if(e.target.dataset.i!==undefined){renderPackage(+e.target.dataset.i);packageSelect.value=e.target.dataset.i;calculate()}};
const extras=document.getElementById('extras');config.extras.forEach((x,i)=>extras.insertAdjacentHTML('beforeend',`<label class="extra"><input type="checkbox" value="${x.price}" data-name="${x.name}"><span>${x.name}<br><small>+ ${money(x.price)}</small></span></label>`));
const guests=document.getElementById('guests');
function calculate(){const g=Math.max(0,+guests.value||0),p=config.packages[+packageSelect.value],extra=[...extras.querySelectorAll('input:checked')].reduce((s,x)=>s+(+x.value),0);document.getElementById('summaryGuests').textContent=g;document.getElementById('summaryPackage').textContent=p.name;document.getElementById('summaryPpp').textContent=money(p.price);document.getElementById('summaryExtras').textContent=money(extra);document.getElementById('grandTotal').textContent=money(g*p.price+extra)}
[guests,packageSelect,extras].forEach(el=>el.addEventListener('input',calculate));calculate();
const gg=document.getElementById('galleryGrid');config.gallery.forEach((src,i)=>gg.insertAdjacentHTML('beforeend',`<div class="gallery-item reveal" ${src?`style="background-image:url('${src}')"`:''}><span>${src?'':'Фото '+(i+1)}</span></div>`));
const benefits=document.getElementById('benefits');config.benefits.forEach((b,i)=>benefits.insertAdjacentHTML('beforeend',`<div class="benefit"><strong>${String(i+1).padStart(2,'0')}</strong><span>${b}</span></div>`));
const observer=new IntersectionObserver(entries=>entries.forEach(x=>x.isIntersecting&&x.target.classList.add('visible')),{threshold:.12});document.querySelectorAll('.reveal').forEach(x=>observer.observe(x));
window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('scrolled',scrollY>50));
document.getElementById('requestForm').addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target));const leads=JSON.parse(localStorage.getItem('podgoreLeads')||'[]');leads.unshift({...data,createdAt:new Date().toISOString(),status:'Нова'});localStorage.setItem('podgoreLeads',JSON.stringify(leads));document.getElementById('formNote').textContent='Дякуємо! Заявку збережено. Менеджер звʼяжеться з вами.';e.target.reset()});
