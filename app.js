const grid = document.getElementById('grid');
const filtersEl = document.getElementById('filters');
const tpl = document.getElementById('card-tpl');

let PRODUCTS=[], CATS=[];
let activeCat='ALL';

async function load() {
  const [p, c] = await Promise.all([fetch('products.json'), fetch('categories.json')]);
  PRODUCTS = await p.json();
  CATS = await c.json();
  renderFilters();
  renderGrid();
}

function renderFilters(){
  const cats = ['ALL', ...CATS.map(x=>x.name)];
  filtersEl.innerHTML='';
  cats.forEach(cat=>{
    const b = document.createElement('button');
    b.className='filter'+(cat===activeCat?' active':'');
    b.textContent = cat;
    b.onclick = ()=>{activeCat=cat; renderFilters(); renderGrid();};
    filtersEl.appendChild(b);
  });
}

function formatPrice(v, cur){
  try{
    return new Intl.NumberFormat('ko-KR', {style:'currency', currency: cur || 'KRW'}).format(v);
  }catch(e){
    return `${v} ${cur||''}`;
  }
}

function renderGrid(){
  const data = PRODUCTS.filter(p=>{
    return activeCat==='ALL' || (p.categories||[]).includes(activeCat);
  });
  grid.innerHTML='';
  data.forEach(p=>{
    const el = tpl.content.firstElementChild.cloneNode(true);
    el.href = p.product_url;
    el.querySelector('.thumb').src = p.image_url;
    el.querySelector('.thumb').alt = p.name;
    el.querySelector('.brand').textContent = p.brand;
    el.querySelector('.name').textContent = p.name;
    el.querySelector('.price').textContent = formatPrice(p.price, p.currency);
    grid.appendChild(el);
  });
}

load();
