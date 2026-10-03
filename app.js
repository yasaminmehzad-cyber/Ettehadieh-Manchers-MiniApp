const toast = document.getElementById('toast');
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
