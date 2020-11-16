const NavBar = {
  render: (customClass = "") => {
    return `
    <nav class="mainmenu ${customClass}" id="mainmenu">      
      <ul class="mainmenu_list">
        <li><a class="mainmenu_link" href="#main"><i class="icon-home"></i><span>&nbsp;Главная</span></a></li>
        <li><a class="mainmenu_link" href="#game"><i class="icon-globe"></i><span>&nbsp;Игра</span></a></li>
        <li><a class="mainmenu_link" href="#rules"><i class="icon-info-circled"></i><span>&nbsp;Правила</span></a></li>
        <li><a class="mainmenu_link" href="#rating"><i class="icon-graduation-cap"></i><span>&nbsp;&nbsp;Рейтинг</span></a></li>
        <li><a class="mainmenu_link" href="#account"><i class="icon-user-o"></i><span>&nbsp;&nbsp;Личный кабинет</span></a></li>                             
      </ul>
      <div class="menu-btn"></div>
      <div id="user-container" class = "user-container">
        <div hidden id="user" class = "user">
          <div id="user-pic" class="user_pic"></div>
          <div id="user-name" class="user_name"></div>
        </div>
        <button hidden id="sign-out" class="user_button"><i class="icon-logout icon"></i></button>
        <button id="sign-in" class="user_button">Войти через Google<i class="icon-login icon"></i></button>
      </div>   
    </nav>    
    `;
  },
};

export default NavBar;
