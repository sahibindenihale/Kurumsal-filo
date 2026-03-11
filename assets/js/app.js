const state = { segment: 'all' };
const grid = document.getElementById('carsGrid');
const resultCount = document.getElementById('resultCount');
const searchInput = document.getElementById('searchInput');
const bodyFilter = document.getElementById('bodyFilter');
const priceFilter = document.getElementById('priceFilter');
const resetBtn = document.getElementById('resetFilters');

function waLinkForCar(carName){
  const msg = `${SITE_CONFIG.whatsappMessage} Araç: ${carName}`;
  return `https://wa.me/${SITE_CONFIG.whatsappRaw}?text=${encodeURIComponent(msg)}`;
}

function applyConfig(){
  document.querySelectorAll('[data-company-name]').forEach(el => el.textContent = SITE_CONFIG.companyName);
  document.querySelectorAll('[data-phone-display]').forEach(el => el.textContent = SITE_CONFIG.phoneDisplay);
  document.querySelectorAll('[data-working-hours]').forEach(el => el.textContent = SITE_CONFIG.workingHours);
  document.querySelectorAll('[data-phone-link]').forEach(el => el.href = `tel:+${SITE_CONFIG.phoneRaw}`);
  document.querySelectorAll('[data-wa-link]').forEach(el => el.href = `https://wa.me/${SITE_CONFIG.whatsappRaw}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`);
  const locations = document.getElementById('locationsList');
  SITE_CONFIG.locations.forEach(loc => {
    const item = document.createElement('div');
    item.textContent = loc;
    locations.appendChild(item);
  });
}

function getFilteredCars(){
  const q = searchInput.value.trim().toLowerCase();
  const body = bodyFilter.value;
  const priceVal = priceFilter.value;
  const [min, max] = priceVal === 'all' ? [0, Infinity] : priceVal.split('-').map(Number);
  return [...window.CARS]
    .sort((a,b)=>a.price-b.price)
    .filter(car => {
      const matchText = !q || car.name.toLowerCase().includes(q);
      const matchBody = body === 'all' || car.body === body;
      const matchSegment = state.segment === 'all' || car.segment === state.segment;
      const matchPrice = car.price >= min && car.price <= max;
      return matchText && matchBody && matchSegment && matchPrice;
    });
}

function segmentLabel(segment){
  return segment === 'luks' ? 'Lüks' : segment === 'ortasegment' ? 'Orta Segment' : 'Ekonomik';
}

function bodyLabel(body){
  return body === 'suv' ? 'SUV' : body === 'panelvan' ? 'Panelvan' : body === 'hatchback' ? 'Hatchback' : 'Sedan';
}

function renderCars(){
  const cars = getFilteredCars();
  resultCount.textContent = `${cars.length} araç listeleniyor`;
  grid.innerHTML = cars.map(car => `
    <article class="card">
      <div class="card-media">
        <div class="car-photo-wrap">
          <img class="car-photo" src="${car.image}" alt="${car.name}" loading="lazy">
        </div>
      </div>
      <div class="card-body">
        <div class="price-row">
          <div>
            <div class="price">${car.price.toLocaleString('tr-TR')} TL <small>Günlük</small></div>
          </div>
          <div class="pill">Depozito ${car.deposit.toLocaleString('tr-TR')} TL</div>
        </div>
        <div>
          <h3 style="margin:0 0 6px; font-size:1.25rem;">${car.name}</h3>
          <div class="meta-pills">
            <span class="pill">${segmentLabel(car.segment)}</span>
            <span class="pill">${bodyLabel(car.body)}</span>
            <span class="pill">${car.year} model</span>
          </div>
        </div>
        <div class="specs">
          <div class="spec"><strong>Yakıt</strong>${car.fuel}</div>
          <div class="spec"><strong>Vites</strong>${car.transmission}</div>
        </div>
        <div class="features">
          ${car.features.map(f => `<span class="feature">${f}</span>`).join('')}
        </div>
        <div class="cta-row">
          <a class="btn btn-green" href="${waLinkForCar(car.name)}" target="_blank" rel="noopener">WhatsApp</a>
          <a class="btn btn-primary" href="tel:+${SITE_CONFIG.phoneRaw}">Hemen Ara</a>
        </div>
      </div>
    </article>
  `).join('');
}

function renderGallery(){
  const gallery = document.getElementById('galleryGrid');
  window.CARS.slice(0, 18).forEach(car => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `<img src="${car.image}" alt="${car.name}" loading="lazy">`;
    gallery.appendChild(item);
  });
}

document.getElementById('segmentChips').addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if(!chip) return;
  document.querySelectorAll('.chip').forEach(btn => btn.classList.remove('active'));
  chip.classList.add('active');
  state.segment = chip.dataset.segment;
  renderCars();
});

[searchInput, bodyFilter, priceFilter].forEach(el => el.addEventListener('input', renderCars));
[bodyFilter, priceFilter].forEach(el => el.addEventListener('change', renderCars));
resetBtn.addEventListener('click', () => {
  searchInput.value = '';
  bodyFilter.value = 'all';
  priceFilter.value = 'all';
  state.segment = 'all';
  document.querySelectorAll('.chip').forEach(btn => btn.classList.toggle('active', btn.dataset.segment === 'all'));
  renderCars();
});

applyConfig();
renderCars();
renderGallery();