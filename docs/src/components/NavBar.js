const NavBar = {
  render: (customClass = "") => {
    return `
    <nav class="mainmenu ${customClass}" id="mainmenu">
      <ul class="mainmenu_list">
        <li><a class="mainmenu_link" href="#main"><i class="icon-home"></i><span>&nbsp;Главная</span></a></li>
        <li><a class="mainmenu_link" href="#rules"><i class="icon-info-circled"></i><span>&nbsp;Правила игры</span></a></li>
        <li><a class="mainmenu_link" href="#rating"><i class="icon-graduation-cap"></i><span>&nbsp;&nbsp;Рейтинг</span></a></li>
        <li><a class="mainmenu_link" href="#login" title="Вход"><i class="icon-user-o"></i><span>&nbsp;Войти</span></a></li>
        <li><a class="mainmenu_link" href="#registr" title="Регистрация"><i class="icon-login"></i><span>&nbsp;Регистрация</span></a></li>
      </ul>
    </nav>
    `;
  },
};

export default NavBar;
