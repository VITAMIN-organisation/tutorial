(function(){
  const btn = document.querySelector('[data-menu-btn]');
  const mobile = document.querySelector('[data-mobile]');
  if(btn && mobile){
    btn.addEventListener('click', () => {
      const isOpen = mobile.style.display === 'block';
      mobile.style.display = isOpen ? 'none' : 'block';
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  }
  const y = document.querySelector('[data-year]');
  if(y){ y.textContent = String(new Date().getFullYear()); }
})();
