(function() {

  function createThemeSwitcher() {
    const themeSwitcher = document.createElement('div');
    themeSwitcher.className = 'theme-switcher';
    themeSwitcher.innerHTML = `
      <div class="theme-switcher-container">
        <span class="theme-switcher-label">Theme:</span>
        <div class="theme-switcher-btns">
          <button class="theme-switcher-btn active" data-theme="crayons">
            Crayons
          </button>
          <button class="theme-switcher-btn" data-theme="dew-light">
            Dew Light
          </button>
          <button class="theme-switcher-btn" data-theme="dew-dark">
            Dew Dark
          </button>
        </div>
      </div>
    `;

    const buttons = themeSwitcher.querySelectorAll('.theme-switcher-btn');
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        const theme = this.getAttribute('data-theme');
        switchTheme(theme);

        buttons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
      });
    });

    return themeSwitcher;
  }

  function switchTheme(theme) {
    const html = document.documentElement;
    html.classList.remove('dew-light-theme', 'dew-dark-theme');
    switch (theme) {
      case 'crayons':
        html.classList.remove('dew-light-theme', 'dew-dark-theme');
        break;
      case 'dew-light':
        html.classList.add('dew-light-theme');
        break;
      case 'dew-dark':
        html.classList.add('dew-dark-theme');
        break;
      default:
        html.classList.remove('dew-light-theme', 'dew-dark-theme');    }
  }

  function injectThemeSwitcher() {
    const checkNav = setInterval(() => {
      const navbar = document.querySelector('.navbar .links');
      if (navbar) {
        clearInterval(checkNav); 
        if (!document.querySelector('.theme-switcher')) {
          const themeSwitcher = createThemeSwitcher();
          navbar.appendChild(themeSwitcher);
        }
        switchTheme('crayons');
      }
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectThemeSwitcher);
  } else {
    injectThemeSwitcher();
  }
})(); 