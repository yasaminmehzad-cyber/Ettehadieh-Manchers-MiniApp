const toast = document.getElementById('toast');
if (window.Telegram && Telegram.WebApp) { Telegram.WebApp.ready(); Telegram.WebApp.expand(); }
let timer = null;

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(timer);

  timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 1800);
}

function openGames() {
  const panel = document.getElementById('games');

  if (!panel) return;

  panel.classList.remove('hidden');

  panel.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

function closeGames() {
  const panel = document.getElementById('games');

  if (!panel) return;

  panel.classList.add('hidden');
}

function goGame(name) {
  showToast(
    `ورود به ${name} — لینک بازی بعد از ثبت آدرس فعال می‌شود`
  );
}

async function fingerprint() {
  try {
    if (
      window.PublicKeyCredential &&
      await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    ) {
      showToast('اثر انگشت دستگاه آماده است');
    } else {
      showToast('اثر انگشت روی این مرورگر در دسترس نیست');
    }
  } catch (error) {
    showToast('امنیت بیومتریک در دسترس نیست');
  }
}

function selectGameType(type) {
  const next = document.getElementById('games-next');
  if (!next) return;

  next.innerHTML = '';
  const step = document.createElement('div');
  step.className = 'games-step';
  step.textContent = 'مرحله 2 از 3';

  const title = document.createElement('h2');
  title.className = 'games-question';
  title.textContent = 'بازی مورد نظرتان را انتخاب کنید';

  const grid = document.createElement('div');
  grid.className = 'game-grid';

  const games = type === 'single'
    ? [['marcraft','🐍','مارکرفت'],['mencherz','🎲','منچرز'],['hokm','🃏','حکم (سوبرا)'],['backgammon','⚪','تخته نرد (پلاتو)']]
    : [['marcraft','🐍','مارکرفت'],['mencherz','🎲','منچرز']];

  games.forEach(g => {
    const b = document.createElement('button');
    b.type = 'button';
    b.onclick = () => selectGame(g[0], type);
    b.innerHTML = g[1] + '<b>' + g[2] + '</b>';
    grid.appendChild(b);
  });

  next.append(step, title, grid);
}

function selectGame(game, type) {
  const next = document.getElementById('games-next');
  if (!next) return;

  const data = {
    marcraft: type === 'single'
      ? ['مارکرفت تک‌برد سخت','مارکرفت تک‌برد آسان']
      : ['مارکرفت تیمی تک‌برد S','مارکرفت تیمی تک‌برد A'],
    mencherz: type === 'single'
      ? ['منچرز تک‌برد','منچرز تک‌باخت','رویداد تک‌برد S','رویداد تک‌برد A']
      : ['منچرز تیمی تک‌برد'],
    hokm: ['حکم 3 دست','حکم 5 دست','حکم 7 دست'],
    backgammon: ['تخته نرد 1 برد','تخته نرد 3 برد','تخته نرد 5 برد']
  };

  const names = {
    marcraft:'مارکرفت',
    mencherz:'منچرز',
    hokm:'حکم (سوبرا)',
    backgammon:'تخته نرد (پلاتو)'
  };

  next.innerHTML = '';

  const step = document.createElement('div');
  step.className = 'games-step';
  step.textContent = 'مرحله 3 از 3';

  const title = document.createElement('h2');
  title.className = 'games-question';
  title.textContent = 'زیردسته بازی را انتخاب کنید';

  const context = document.createElement('div');
  context.className = 'games-step';
  context.textContent = type === 'single' ? 'دوجانبه تکی' : 'دوجانبه تیمی';

  const line = document.createElement('div');
  line.className = 'games-line';

  const gameTitle = document.createElement('h2');
  gameTitle.className = 'games-question';
  gameTitle.textContent = names[game];

  const grid = document.createElement('div');
  grid.className = 'game-subgrid';

  let selected = '';

  data[game].forEach(item => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'game-subcard';

    const check = document.createElement('span');
    check.className = 'game-check';

    const text = document.createElement('b');
    text.textContent = item;

    card.append(check, text);

    card.onclick = () => {
      selected = item;
      document.querySelectorAll('.game-subcard').forEach(x => x.classList.remove('selected'));
      card.classList.add('selected');
      createButton.disabled = false;
      createButton.style.opacity = '1';
      amountHint.textContent = '';
    };

    grid.appendChild(card);
  });

  const amount = document.createElement('div');
  amount.className = 'game-amount';

  const label = document.createElement('b');
  label.textContent = 'مبلغ بازی';

  const input = document.createElement('input');
  input.type = 'number';
  input.inputMode = 'numeric';
  input.min = type === 'single' ? '100' : '200';
  input.step = '10';
  input.placeholder = 'ابتدا زیردسته بازی را انتخاب کنید';

  const toman = document.createElement('div');
  toman.textContent = 'تومان';

  const amountHint = document.createElement('div');
  amountHint.className = 'games-step';

  const createButton = document.createElement('button');
  createButton.type = 'button';
  createButton.className = 'game-create';
  createButton.textContent = 'ساخت بازی';
  createButton.disabled = true;
  createButton.style.opacity = '.5';

  createButton.onclick = () => {
    const min = type === 'single' ? 100 : 200;
    const value = Number(input.value);

    if (!selected) {
      amountHint.textContent = 'ابتدا زیردسته بازی را انتخاب کنید';
      return;
    }

    if (!value || value < min || value % 10 !== 0) {
      amountHint.textContent = 'مبلغ باید مضرب 10 باشد و حداقل ' + min + ' تومان باشد';
      return;
    }

    amountHint.textContent = 'مبلغ بازی: ' + value + ' تومان';

    if (value > 2580000) {
      amountHint.textContent = type === 'single'
        ? 'موجودی شما کافی نیست'
        : 'موجودی ناکافی است';
      return;
    }

    showToast('بازی ساخته شد');
  };

  amount.append(label, input, toman, amountHint, createButton);
  next.append(step, title, context, line, gameTitle, grid, amount);
}
