const RegistrationUser = {
  id: "registr",
  title: "Карта Мира - Регистрация",
  render: (className = "container", ...rest) => {
    return `
      <section class="${className}">        
        <div id="login">
    
            <div class="form-signup">
              <h1 class = "header">Регистрация</h1>
              <div class = "fieldset-hidden">
              <fieldset>              
                <form>
                  <input id = "newUserEmail" type="email" placeholder="Введите Ваш email адрес..." required />
                  <input id = "newUserPassword" type="password" placeholder="Ваш сложный пароль..." required />
                  <input id = "newUserName" type="text" placeholder="Имя пользователя" required />
                  <button id = "btnReg"class = "btn">Зарегистрироваться</button>
                </form>
                <p>Войти через: <span class="social gp">Google</span></p>
                <a href="#login" class="flipper">Уже зарегистрированы? Войти.</a>
              </fieldset>
              </div>
              <div class = "regSucces">
              </div>
              <div id="error" class="error"></div>            
          </div>
        </div>
        
      </section>
    `;
  },
};

export default RegistrationUser;
