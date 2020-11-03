const LoginUser = {
  id: "login",
  title: "Карта Мира - Войти",
  render: (className = "container", ...rest) => {
    return `
      <section class="${className}">
        <div id="login">
          
            <div class="form-login">
              <h1 class = "header">Авторизация</h1>
              <div class = "fieldset-hidden">
              <fieldset>
                <form>
                  <input id = "userEmail" type="email" placeholder="Логин или Email" required />
                  <input id = "userPassword" type="password" placeholder="Пароль" required />
                  <button id = "btnIn" class = "btn">Войти</button>
                </form>
                <p>Войти через: <span class="social gp">Google</span></p>
                <p><a href="#registr" class="flipper">Нет аккаунта? Регистрация.</a><br>
                <a href="#registr">Забыли пароль?</a></p>
              </fieldset>
              </div>
              </div>
              <div class = "loginSucces"></div>
              <div id="error" class="error"></div>
          
      </section>
    `;
  },
};

export default LoginUser;
