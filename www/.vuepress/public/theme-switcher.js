(function() {

  function createThemeSwitcher() {
    const themeSwitcher = document.createElement('div');
    themeSwitcher.className = 'theme-switcher';
    themeSwitcher.innerHTML = `
      <div class="dropdown">
        <div class="dropdown-container" tabindex="0" role="button">
          <span class="dropdown-label">Theme</span>
          <span class="arrow down"></span>
        </div>
        <div class="dropdown-options" style="display: none;">
          <div class="dropdown-option" data-theme="crayons">Crayons</div>
          <div class="dropdown-option" data-theme="dew-light">Dew Light</div>
          <div class="dropdown-option" data-theme="dew-dark">Dew Dark</div>
        </div>
      </div>
    `;

    const dropdownContainer = themeSwitcher.querySelector('.dropdown-container');
    const dropdownOptions = themeSwitcher.querySelector('.dropdown-options');
    const dropdownIcon = themeSwitcher.querySelector('.arrow');
    const options = themeSwitcher.querySelectorAll('.dropdown-option');

    dropdownContainer.addEventListener('click', function() {
      const isVisible = dropdownOptions.style.display !== 'none';
      dropdownOptions.style.display = isVisible ? 'none' : 'block';
      dropdownIcon.classList.toggle('expanded', !isVisible);
    });

    options.forEach(option => {
      option.addEventListener('click', function() {
        const theme = this.getAttribute('data-theme');
        switchTheme(theme);        
        dropdownContainer.querySelector('.dropdown-label').textContent = this.textContent;        
        dropdownOptions.style.display = 'none';
        dropdownIcon.classList.remove('expanded');
      });
    });

    document.addEventListener('click', function(e) {
      if (!themeSwitcher.contains(e.target)) {
        dropdownOptions.style.display = 'none';
        dropdownIcon.classList.remove('expanded');
      }
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
        html.classList.remove('dew-light-theme', 'dew-dark-theme');
    }
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