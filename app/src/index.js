import HomePage from "./pages/HomePage.js";
import GamePage from "./pages/GamePage.js";
import RulesGame from "./pages/RulesGame.js";
import RatingUsers from "./pages/RatingUsers.js";
import UserAccount from "./pages/UserAccount.js";
import ErrorPage from "./pages/ErrorPage.js";

import Header from "./components/Header.js";
import NavBar from "./components/NavBar.js";
import Content from "./components/Content.js";
import Footer from "./components/Footer.js";

// List of components (from components.js)
const components = {
  header: Header,
  navbar: NavBar,
  content: Content,
  footer: Footer,
};
// List of supported routes (from pages.js)
const routes = {
  main: HomePage,
  game: GamePage,
  rules: RulesGame,
  rating: RatingUsers,
  account: UserAccount,
  error: ErrorPage,
};

/* ----- spa init module --- */
const mySPA = (function () {
  /* ------- begin view -------- */
  function ModuleView() {
    let myModuleContainer = null;
    let menu = null;
    let contentContainer = null;
    let routesObj = null;
    let canvas = null;
    let context = null;
    let path = null;

    this.init = function (container, routes) {
      myModuleContainer = container;
      routesObj = routes;
      menu = myModuleContainer.querySelector("#mainmenu");
      contentContainer = myModuleContainer.querySelector("#content");
    };

    this.renderContent = function (hashPageName) {
      let routeName = "main";

      if (hashPageName.length > 0) {
        routeName = hashPageName in routes ? hashPageName : "error";
      }

      window.document.title = routesObj[routeName].title;
      contentContainer.innerHTML = routesObj[routeName].render(
        `${routeName}-page`
      );
      const menu = document.querySelector(".mainmenu_list");
      const menuBtn = document.querySelector(".menu-btn");
      menuBtn.classList.remove("menu-btn__active");
      menu.classList.remove("mainmenu_list__active");
      this.updateButtons(routesObj[routeName].id);
    };

    this.updateButtons = function (currentPage) {
      const menuLinks = menu.querySelectorAll(".mainmenu_link");

      for (
        let i = 0, menuLinksCount = menuLinks.length;
        i < menuLinksCount;
        i++
      ) {
        if (currentPage === menuLinks[i].getAttribute("href").slice(1)) {
          menuLinks[i].classList.add("active");
        } else {
          menuLinks[i].classList.remove("active");
        }
      }
    };

    this.toggleMenu = function () {
      const menu = document.querySelector(".mainmenu_list");
      const menuBtn = document.querySelector(".menu-btn");

      menuBtn.classList.toggle("menu-btn__active");
      menu.classList.toggle("mainmenu_list__active");
    };

    this.initFirebaseAuth = function (url, userName) {
      const user = document.getElementById("user");
      const userPicElement = document.getElementById("user-pic");
      const userNameElement = document.getElementById("user-name");
      const signInButtonElement = document.getElementById("sign-in");
      const signOutButtonElement = document.getElementById("sign-out");

      userPicElement.style.backgroundImage = `url(${url})`;
      userNameElement.textContent = userName;

      // Show user's profile and sign-out button.
      user.style.display = "flex";
      signOutButtonElement.removeAttribute("hidden");

      // Hide sign-in button.
      signInButtonElement.setAttribute("hidden", "true");
    };

    this.outFirebaseAuth = function () {
      const user = document.getElementById("user");
      const signInButtonElement = document.getElementById("sign-in");
      const signOutButtonElement = document.getElementById("sign-out");
      user.style.display = "none";
      signOutButtonElement.setAttribute("hidden", "true");

      // Show sign-in button.
      signInButtonElement.removeAttribute("hidden");
    };

    //Номе Page

    this.drawCanvasGlobe = function (map, projection) {
      canvas = d3
        .select("#globe")
        .append("canvas")
        .attr("width", map.d)
        .attr("height", map.d);

      context = canvas.node().getContext("2d");
      path = d3.geoPath(projection, context);
    };

    this.drawGlobe = function (map, drawMap) {
      context.clearRect(0, 0, map.d, map.d);

      drawMap.projection
        .rotate([drawMap.rotateAngle, drawMap.rotateX, drawMap.rotateY]) //вращаем глобус
        .clipAngle(90);

      context.beginPath();
      path(map.sphere);
      context.lineWidth = 3;
      context.strokeStyle = "#000";
      context.stroke();
      context.fillStyle = "#668cc2";
      context.fill();

      drawMap.projection.clipAngle(180); //отрисовываем обратную сторону глобуса

      context.beginPath();
      path(drawMap.land);
      context.fillStyle = "#134E5E";
      context.fill();

      context.beginPath();
      path(drawMap.grid);
      context.lineWidth = 0.5;
      context.strokeStyle = "#00248f";
      context.stroke();

      drawMap.projection.clipAngle(90); //отрисовываем переднюю сторону глобуса

      context.beginPath();
      path(drawMap.land);
      context.fillStyle = "#a98b6f";
      context.fill();
      context.lineWidth = 0.5;
      context.strokeStyle = "#000";
      context.stroke();
    };

    //Game Page

    this.toggle = function (modal) {
      document
        .querySelector(".container-modal")
        .classList.toggle("modal__closed");
      modal.classList.toggle("modal__closed");
      document
        .querySelector("#modal-overlay")
        .classList.toggle("modal__closed");
    };

    this.showGame = function (id) {
      document.querySelector(".game-learn").setAttribute("hidden", "true");
      document.querySelector(".game-play").removeAttribute("hidden");
      // document.querySelector(".game-play").setAttribute("id", id);
      document.querySelector("#modal-country").disabled = true;
      document.querySelector("#modal-capital").disabled = true;
    };

    this.hideGame = function () {
      document.querySelector(".game-learn").removeAttribute("hidden");
      document.querySelector(".game-play").setAttribute("hidden", "true");
      document.querySelector(".timer").innerHTML = "";
      document.querySelector(".question").innerHTML = "";
      document.querySelector(
        ".result"
      ).innerHTML = `Для начала игры нажми "СТАРТ", для&nbsp;остановки игры&nbsp;- "СТОП", для&nbsp;отмены&nbsp;- "ВЫЙТИ".`;
      document
        .querySelectorAll(".level")
        .forEach((element) => (element.checked = false));
      document.querySelector("#stop").disabled = true;
      document.querySelector("#start").removeAttribute("disabled");
    };

    this.drawSvg = function (map, path) {
      //SVG контейнер
      const svg = d3
        .select(".game-map")
        .append("svg")
        .attr("viewBox", `0 0 ${map.width} ${map.height}`)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("class", "svg-content");
      //Adding water
      svg
        .append("g")
        .attr("class", "g")
        .append("path")
        .datum({ type: "Sphere" })
        .attr("class", "water")
        .attr("d", path);
    };

    this.drawSelect = function () {
      d3.select(".task").html(
        `<h2>Учим и вспоминаем:</h2>
        <div id = "learnTooltip" class = "countryTooltip"></div>
        <div class = "countries">
          <h3>Поиск по стране:</h3>
          <div class = "select_wrapper">
          <select name = "countries"><option>Выберите страну</option></select>
          </div>
          <div class = "thisCapital"></div>                  
        </div>
        <div class = "capitals">
          <h3>Поиск по столице:</h3>
          <div class = "select_wrapper">
          <select name = "capitals"><option>Выберите столицу</option></select>
          </div>
          <div class = "thisCountry"></div>                  
        </div>`
      );
    };

    this.addInfoSelect = function (d) {
      let option = d3.select("div.countries select").append("option");
      option.text(d.name);
      option.property("value", d.id);

      let optionCapital = d3.select("div.capitals select").append("option");
      optionCapital.text(d.capital);
      optionCapital.property("value", d.id);
    };

    this.sortCapital = function (item, select) {
      select.appendChild(item);
    };

    this.drawMap = function (countries, path) {
      //Рисуем страны на карте
      d3.select("g")
        .selectAll("path.land")
        .data(countries)
        .enter()
        .append("path")
        .attr("class", "land")
        .attr("d", path);
    };

    this.showTooltip = function (tooltip) {
      d3.select("#learnTooltip")
        .text(tooltip.name + ": " + tooltip.capital)
        .style("left", tooltip.x + "px")
        .style("top", tooltip.y + "px")
        .style("display", "block")
        .style("opacity", 1);
    };

    this.showGameTooltip = function (tooltip) {
      d3.select("#gameTooltip")
        .text(tooltip.name + ": " + tooltip.capital)
        .style("left", tooltip.x + "px")
        .style("top", tooltip.y + "px")
        .style("display", "block")
        .style("opacity", 1);
    };

    this.hideTooltip = function () {
      d3.select(".countryTooltip").style("opacity", 0).style("display", "none");
    };

    this.moveTooltip = function (tooltip) {
      d3.select(".countryTooltip")
        .style("left", tooltip.x + "px")
        .style("top", tooltip.y + "px");
    };

    this.addCapitalInfo = function (capital, status, map, path) {
      document.querySelector(".thisCapital").innerHTML =
        "<h4>СТОЛИЦА: " + capital + "</h4>";
      d3.select("svg").selectAll(".focused").classed("focused", map.focused);
      d3.select("svg")
        .selectAll("path")
        .attr("d", path)
        .classed("focused", status);
    };

    this.addCountryInfo = function (country, status, map, path) {
      document.querySelector(".thisCountry").innerHTML =
        "<h4>СТРАНА: " + country + "</h4>";
      d3.select("svg").selectAll(".focused").classed("focused", map.focused);
      d3.select("svg")
        .selectAll("path")
        .attr("d", path)
        .classed("focused", status);
    };

    this.clearFocus = function () {
      d3.select("svg").selectAll(".focused").classed("focused", false);
    };

    this.zoomed = function (transform) {
      d3.select("g").attr("transform", transform);
    };

    this.isDisabled = function (button) {
      button.disabled = true;
    };

    this.unDisabled = function (button) {
      button.removeAttribute("disabled");
    };

    this.addTimer = function (strTimer) {
      document.getElementById("timer").innerHTML = strTimer;
    };

    this.addCounter = function (score) {
      document.querySelector(".counter").innerHTML = score;
    };

    this.addResult = function (str) {
      document.querySelector(".result").innerHTML = str;
    };

    this.addTaskCountry = function (country) {
      document.querySelector(".question").innerHTML = country;
    };

    this.addModalResult = function (str) {
      document.querySelector(".modalResult_content").innerHTML = str;
    };

    this.addTaskCapital = function (capital) {
      document.querySelector(".question").innerHTML = capital;
    };

    //Rating Page
    this.printRating = function (usersList, game) {
      const usersRating = contentContainer.querySelector(`#users-list-${game}`);
      let rating = "";
      usersList.forEach((item, i) => {
        rating += `<div>${i + 1}</div>
                <div>${item.name}</div>
                <div class = "user-list__hide-date">${new Date(
                  item.date
                ).toLocaleDateString()}</div>
                <div class = "user-list__hide-score">${item.score}</div>
                <div class = "user-list__hide-persent">${item.percentage}</div>
                <div class = "user-list__hide-level">${item.level}</div>   `;
      });
      if (usersRating) {
        usersRating.innerHTML = rating;
      }
    };

    //User Account Page
    this.addUserAccountInfo = function (userListLast20) {
      const userAccount = document.querySelector(".user-statistics");
      let userInfo = `
              <h3>Здравствуйте, ${userListLast20[0].name}! Ваши достижения:</h3>              
              <div class="table_account">                  
                <div>Дата</div>
                <div>Игра</div>
                <div class = "user-list__hide-level">Уровень</div> 
                <div class = "user-list__hide-time">Время игры</div>
                <div>Количество правильных ответов</div>
                <div class = "user-list__hide-wrong">Количество неправильных ответов</div>           
                <div class = "user-list__hide-persent">% отгадывания</div>                               
              </div>          
              `;
      userListLast20.forEach((item) => {
        userInfo += `<div class = "table_account">
                <div>${new Date(item.date).toLocaleDateString()}<br>${new Date(
          item.date
        ).toLocaleTimeString("en-GB")}</div>
                <div>${item.game}</div>
                <div class = "user-list__hide-level">${item.level}</div> 
                <div class = "user-list__hide-time">${item.time}</div>
                <div>${item.score}</div>
                <div class = "user-list__hide-wrong">${item.wrong}</div>        
                <div class = "user-list__hide-persent">${item.percentage}</div>
              </div>
             `;
      });
      if (userAccount) {
        userAccount.innerHTML = userInfo;
      }
    };

    this.addUserAccountWarn = function () {
      const userAccount = document.querySelector(".user-statistics");
      if (userAccount) {
        userAccount.innerHTML =
          "<h2 class = 'warning'>Для просмотра информации необходимо авторизоваться!</h2>";
      }
    };
  }
  /* -------- end view --------- */
  /* ------- begin model ------- */
  function ModuleModel() {
    let myModuleView = null;
    let self = this;
    let hashPageName = null;
    let path = null;
    let countryById = null;
    let countries = null;
    let countryData = null;

    const geoGame = {
      timerId: null,
      game: null,
      level: null,
      random: null,
      countR: null,
      countF: null,
      attempt: 3,
      mistakes: "",
    };

    this.init = function (view) {
      myModuleView = view;

      const files = [
        "./data/world-50m.json",
        "./data/world-110m-country-names.tsv",
      ];

      const promises = [];
      files.forEach(function (url, index) {
        promises.push(index ? d3.tsv(url) : d3.json(url));
      });
      Promise.all(promises).then(getData);

      function getData(promises) {
        let world = promises[0];
        let сountryData = promises[1];
        let сountryById = {};
        let сountries = topojson.feature(world, world.objects.countries)
          .features;

        сountryData.forEach(function (d) {
          сountryById[d.id] = {
            id: d.id,
            name: d.name,
            capital: d.capital,
            area: d.area,
          };
        });

        if (
          !localStorage.getItem("countries") &&
          !localStorage.getItem("countryById") &&
          !localStorage.getItem("countryById")
        ) {
          localStorage.setItem("countries", JSON.stringify(сountries));
          localStorage.setItem("countryById", JSON.stringify(сountryById));
          localStorage.setItem("countryData", JSON.stringify(сountryData));
        }
      }
    };

    this.updateState = function (containerWidth) {
      hashPageName = window.location.hash.slice(1).toLowerCase();

      myModuleView.renderContent(hashPageName);

      if (hashPageName === "main" || hashPageName.length === 0) {
        this.drawGlobe(containerWidth);
      }

      if (hashPageName === "game") {
        this.drawSvgMap();
        this.drawSelectMap();
      }

      if (hashPageName === "rating") {
        this.subscribeUsersbook("country");
        this.subscribeUsersbook("capital");
      }

      if (hashPageName === "account") {
        this.addUserAccountInfo();
      }
    };

    this.toggleMenu = function () {
      myModuleView.toggleMenu();
    };

    //HOME PAGE

    //---Аутентификация через Google

    this.signIn = function () {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider);
    };
    this.signOut = function () {
      firebase.auth().signOut();
    };
    // получаем аватар пользователя
    this.getProfilePicUrl = function () {
      return (
        firebase.auth().currentUser.photoURL || "./img/profile_placeholder.png"
      );
    };
    // получаем имя пользователя
    this.getUserName = function () {
      return firebase.auth().currentUser.displayName;
    };
    // добавляем размер аватара в url
    this.addSizeToGoogleProfilePic = function (url) {
      if (
        url.indexOf("googleusercontent.com") !== -1 &&
        url.indexOf("?") === -1
      ) {
        return url + "?sz=150";
      }
      return url;
    };
    //инициализируем аутентификацию и передаем во VIEW имя и аватар
    this.initFirebaseAuth = function () {
      firebase.auth().onAuthStateChanged(function (user) {
        user = firebase.auth().currentUser;
        if (user) {
          let profilePicUrl = self.getProfilePicUrl();
          let userName = self.getUserName();
          let url = self.addSizeToGoogleProfilePic(profilePicUrl);
          myModuleView.initFirebaseAuth(url, userName);
        } else {
          myModuleView.outFirebaseAuth();
        }
      });
    };

    //получаем данные для отрисовки глобуса и передаем во VIEW
    this.drawGlobe = function (containerWidth) {
      const map = {
        d: containerWidth * 0.4,
        speed: 0.01,
        start: Date.now(),
        sphere: { type: "Sphere" },
      };
      //настраиваем проекцию
      const projection = d3
        .geoOrthographic() //ортографическая проекция
        .scale(map.d / 2.5) //коэффициент масштабирования
        .translate([map.d / 2, map.d / 2]); //центр карты

      myModuleView.drawCanvasGlobe(map, projection);

      d3.json("data/world-110m.json").then(function (topo) {
        //конвертируем TopoJSON в GeoJSON
        const land = topojson.feature(topo, topo.objects.land), //контуры материков
          grid = d3.geoGraticule10(); //координатная сетка

        //запускаем requestAnimationFrame
        d3.timer(() => {
          const drawMap = {
            land: land,
            grid: grid,
            projection: projection,
            rotateAngle: map.speed * (Date.now() - map.start),
            rotateX: -15,
            rotateY: -15,
          };
          myModuleView.drawGlobe(map, drawMap);
        });
      });
    };

    //GAME PAGE

    //получаем данные для карты и передаем во VIEW
    this.drawSvgMap = function () {
      countries = JSON.parse(localStorage.getItem("countries"));
      countryById = JSON.parse(localStorage.getItem("countryById"));
      countryData = JSON.parse(localStorage.getItem("countryData"));

      //Настройки проекции
      const projection = d3.geoEqualEarth();

      let width = 1200;
      let height = (function () {
        const [[x0, y0], [x1, y1]] = d3
          .geoPath(projection.fitWidth(width, { type: "Sphere" }))
          .bounds({ type: "Sphere" });
        const dy = Math.ceil(y1 - y0),
          l = Math.min(Math.ceil(x1 - x0), dy);
        projection.scale((projection.scale() * (l - 1)) / l).precision(0.2);
        return dy;
      })();

      const map = {
        width: width,
        height: height,
        focused: false,
      };

      path = d3.geoPath(projection);

      //рисуем svg
      myModuleView.drawSvg(map, path);
      myModuleView.drawMap(countries, path);
    };

    //получаем данные для селектов и передаем во VIEW
    this.drawSelectMap = function () {
      //рисуем select'ы
      myModuleView.drawSelect();
      //Добавляем страны и столицы в select
      countryData.forEach(function (d) {
        countryById[d.id] = {
          id: d.id,
          name: d.name,
          capital: d.capital,
          area: d.area,
        };
        myModuleView.addInfoSelect(d);
      });
    };

    this.sortCapital = function (items, select) {
      items.sort((a, b) => (a.text == b.text ? 0 : a.text < b.text ? -1 : 1));
      items.forEach((item) => myModuleView.sortCapital(item, select));
    };

    this.getCapitalInfo = function (event) {
      let focusedCountry = self.country(countries, event.target);

      let capital = countryById[focusedCountry.id].capital;

      let status = function isFocused(d) {
        return d.id == focusedCountry.id ? (map.focused = d) : false;
      };
      myModuleView.addCapitalInfo(capital, status, map, path);
    };

    this.getCountryInfo = function (event) {
      var focusedCountry = self.country(countries, event.target);
      let country = countryById[focusedCountry.id].name;

      let status = function isFocused(d) {
        return d.id == focusedCountry.id ? (map.focused = d) : false;
      };
      myModuleView.addCountryInfo(country, status, map, path);
    };

    //получаем данные для реализации всплывающих подсказок и передаем во VIEW
    this.showTooltip = function (event) {
      let d = d3.select(event.target).data()[0];
      if (countryById[d.id]) {
        var tooltip = {
          name: countryById[d.id].name,
          capital: countryById[d.id].capital,
          x: event.pageX + 7,
          y: event.pageY - 15,
        };
        myModuleView.showTooltip(tooltip);
      }
    };

    this.showGameTooltip = function (event) {
      let d = d3.select(event.target).data()[0];
      if (countryById[d.id]) {
        var tooltip = {
          name: countryById[d.id].name,
          capital: countryById[d.id].capital,
          x: event.pageX + 7,
          y: event.pageY - 15,
        };
        myModuleView.showGameTooltip(tooltip);
      }
    };

    this.hideTooltip = function () {
      myModuleView.hideTooltip();
    };

    this.moveTooltip = function (event) {
      const tooltip = {
        x: event.pageX + 7,
        y: event.pageY - 15,
      };
      myModuleView.moveTooltip(tooltip);
    };

    //Добавляем звук на клик
    this.soundInit = function (clickAudio) {
      clickAudio.load();
    };
    this.soundOn = function (clickAudio) {
      clickAudio.play();
    };
    this.soundOff = function (clickAudio) {
      clickAudio.pause();
    };

    //Функция реализации фокусировки на стране,
    //которая возвращает нам геоданные для страны по её id
    this.country = function (cnt, sel) {
      for (var i = 0, l = cnt.length; i < l; i++) {
        if (cnt[i].id == sel.value || cnt[i].id == sel.id) {
          return cnt[i];
        }
      }
    };

    this.zoomed = function (event) {
      const { transform } = event;
      myModuleView.zoomed(transform);
    };

    //GAME

    //модальное окно
    this.toggleModal = function (modal) {
      myModuleView.toggle(modal);
    };

    this.startGameCapital = function (btnCountry, btnCapital) {
      self.toggleModal(modal);
      myModuleView.clearFocus(false);
      myModuleView.showGame();
      geoGame.game = "capital";
      myModuleView.isDisabled(btnCountry);
      myModuleView.isDisabled(btnCapital);
      myModuleView.addResult(
        `Для начала игры нажми "СТАРТ", для&nbsp;остановки игры &nbsp;- "СТОП", для&nbsp;отмены &nbsp;- "ВЫЙТИ".`
      );
    };

    this.startGameCountry = function (btnCountry, btnCapital) {
      self.toggleModal(modal);
      myModuleView.clearFocus(false);
      myModuleView.showGame();
      geoGame.game = "country";
      myModuleView.isDisabled(btnCountry);
      myModuleView.isDisabled(btnCapital);
      myModuleView.addResult(
        `Для начала игры нажми "СТАРТ", для&nbsp;остановки игры &nbsp;- "СТОП", для&nbsp;отмены &nbsp;- "ВЫЙТИ".`
      );
    };

    this.getLevel = function (level, btnCountry, btnCapital) {
      geoGame.level = level;
      myModuleView.unDisabled(btnCountry);
      myModuleView.unDisabled(btnCapital);
    };

    //игровой процесс
    this.startGame = function (btnStop, btnStart, modalAttention) {
      myModuleView.unDisabled(btnStop);
      myModuleView.isDisabled(btnStart);

      firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
          self.toggleModal(modalAttention);
        }
      });

      //Запускаем секундомер
      let min = 0,
        hour = 0,
        sec = 0;
      geoGame.timerId = setTimeout(function tick() {
        sec++;
        if (sec >= 60) {
          min++;
          sec = sec - 60;
        }
        if (min >= 60) {
          hour++;
          min = min - 60;
        }
        //Визуальное оформление
        let strTimer;
        if (sec < 10) {
          if (min < 10) {
            hour < 10
              ? (strTimer = `0${hour} : 0${min} : 0${sec}`)
              : (strTimer = `${hour} : 0${min} : 0${sec}`);
          } else {
            hour < 10
              ? (strTimer = `0${hour} : ${min} : 0${sec}`)
              : (strTimer = `${hour} : ${min} : 0${sec}`);
          }
        } else {
          if (min < 10) {
            hour < 10
              ? (strTimer = `0${hour} : 0${min} : ${sec}`)
              : (strTimer = `${hour} : 0${min} : ${sec}`);
          } else {
            hour < 10
              ? (strTimer = `0${hour} : ${min} : ${sec}`)
              : (strTimer = `${hour} + ":" + ${min} + ":" + ${sec}`);
          }
        }
        myModuleView.addTimer(strTimer);
        geoGame.timerId = setTimeout(tick, 1000);
      }, 1000);
      myModuleView.addResult("");
      geoGame.random = self.changeQuestions();
      geoGame.countF = 0;
      geoGame.countR = 0;
      myModuleView.addCounter(`${geoGame.countR}/${geoGame.countF}`);
    };

    this.stopGame = function (scoreUser, timerUser, btnStop, btnStart) {
      myModuleView.isDisabled(btnStop);
      myModuleView.unDisabled(btnStart);
      clearTimeout(geoGame.timerId);
      let right = Number(scoreUser.split("/")[0]);
      let wrong = Number(scoreUser.split("/")[1]);
      let persent = Math.round((right / (right + wrong)) * 100);
      geoGame.mistakes.length > 1 || right < 1
        ? myModuleView.addModalResult(
            `<p>правильных ответов - ${right}; <br>неправильных ответов - ${wrong};  <br>процент угадывания - ${persent}%.<br>Время игры - ${timerUser}</p><h4>Надо повторить!</h4>${geoGame.mistakes}</p>`
          )
        : myModuleView.addModalResult(
            `<p>правильных ответов - ${right}; <br>неправильных ответов - ${wrong};  <br>процент угадывания - ${persent}%.<br>Время игры - ${timerUser}</p><h4>Молодец, ты хорошо справился с заданием!</h4></p>`
          );
      geoGame.mistakes = "";

      let userResult = {
        right: right,
        wrong: wrong,
        persent: persent,
        timerUser: timerUser,
      };
      self.writeDataDatabase(userResult, geoGame);
    };

    this.writeDataDatabase = function (userResult, geoGame) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user && userResult.right) {
          myAppDB.collection(geoGame.game).add({
            name: user.displayName,
            date: Date.now(),
            level: geoGame.level,
            game: geoGame.game,
            score: userResult.right,
            wrong: userResult.wrong,
            percentage: userResult.persent,
            time: userResult.timerUser,
          });
        }
      });
    };

    this.cancelGame = function () {
      clearTimeout(geoGame.timerId);
      myModuleView.hideGame();
      myModuleView.addResult(
        `Для начала игры нажми "СТАРТ", для&nbsp;остановки игры &nbsp;- "СТОП", для&nbsp;отмены &nbsp;- "ВЫЙТИ".`
      );
    };

    this.mainGame = function (event) {
      myModuleView.addResult("");
      let d = d3.select(event.target).data()[0];
      let answUser;
      if (countryById[d.id]) {
        answUser = countryById[d.id].id;
      }
      // значение выбранное пользователем
      if (geoGame.random && countryById[d.id]) {
        if (geoGame.random.id === answUser) {
          geoGame.countR++;
          myModuleView.addResult("Mолодец! Это правильный ответ!");
          myModuleView.addCounter(`${geoGame.countR}/${geoGame.countF}`);
          geoGame.random = self.changeQuestions();
          geoGame.attempt = 3;
        } else {
          myModuleView.addResult("Неправильно! Попробуй еще раз!");
          geoGame.attempt--;
          switch (geoGame.attempt) {
            case 0:
              myModuleView.addResult("Увы! Вы исчерпали все попытки!");
              geoGame.mistakes += `<p>${geoGame.random.name} : ${geoGame.random.capital}</p> `;
              geoGame.countF++;
              myModuleView.addCounter(`${geoGame.countR}/${geoGame.countF}`);
              geoGame.random = self.changeQuestions();
              geoGame.attempt = 3;
              break;
            case 1:
              myModuleView.addResult("Осталась одна попытка");
              break;
            case 2:
              myModuleView.addResult("Осталась две попытки");
              break;
            default:
              break;
          }
        }
      }
    };

    //Функция для получения объекта по уровню сложности
    this.getObjectLevel = function (Num) {
      let newCountryById = {};
      for (let key in countryById) {
        if (countryById[key].area < Num) {
          newCountryById[key] = countryById[key];
        }
      }
      return newCountryById;
    };

    //Функция для получения рандомно страны(столицы)
    //obj: countryById, countryById70, countryById140
    this.randomCountry = function (obj) {
      let res = Object.keys(obj);
      let randCountry = Math.floor(Math.random() * res.length);
      return obj[res[randCountry]];
    };

    this.changeQuestions = function () {
      let countryLevel;

      //Получаем объект для уровней сложности
      switch (geoGame.level) {
        case "easy":
          countryLevel = self.getObjectLevel(50);
          break;
        case "middle":
          countryLevel = self.getObjectLevel(120);
          break;
        case "hard":
          countryLevel = countryById;
          break;
        default:
          break;
      }
      let random = self.randomCountry(countryLevel);
      switch (geoGame.game) {
        case "country":
          myModuleView.addTaskCountry(random.name);
          break;
        case "capital":
          myModuleView.addTaskCapital(random.capital);
          break;
        default:
          break;
      }
      return random;
    };

    //RATING PAGE

    // Listen to usersbook updates
    this.subscribeUsersbook = function (game) {
      // Create query for messages
      let usersList = []; //все игроки
      let usersListWinner = []; //10 победителей
      myAppDB.collection(game).onSnapshot(
        (snaps) => {
          snaps.forEach((doc) => {
            usersList.push(doc.data());
            usersList.sort((a, b) =>
              a.score < b.score ||
              (a.score === b.score && a.percentage < b.percentage)
                ? 1
                : -1
            );
            usersListWinner = usersList.slice(0, 10);
          });
          if (game) {
            myModuleView.printRating(usersListWinner, game);
          }
        },
        function (error) {
          console.log(error);
        }
      );
    };

    //User Account Page
    this.addUserAccountInfo = function () {
      let userList = []; //все результаты
      let userListLast20 = []; //последние 20 результатов

      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          myAppDB
            .collection("country")
            .where("name", "==", user.displayName)
            .onSnapshot(
              (snaps) => {
                snaps.forEach((doc) => {
                  userList.push(doc.data());
                });
              },
              function (error) {
                console.log(error);
              }
            );
          myAppDB
            .collection("capital")
            .where("name", "==", user.displayName)
            .onSnapshot(
              (snaps) => {
                snaps.forEach((doc) => {
                  userList.push(doc.data());
                  userList.sort((a, b) => b.date - a.date);
                  userListLast20 = userList.slice(0, 20);
                });
                myModuleView.addUserAccountInfo(userListLast20);
              },
              function (error) {
                console.log(error);
              }
            );
        } else {
          myModuleView.addUserAccountWarn();
        }
      });
    };
  }

  /* -------- end model -------- */
  /* ----- begin controller ---- */
  function ModuleController() {
    let myModuleContainer = null;
    let myModuleModel = null;

    this.init = function (container, model) {
      myModuleContainer = container;
      myModuleModel = model;

      const signInButtonElement = document.getElementById("sign-in");
      const signOutButtonElement = document.getElementById("sign-out");
      const userPicElement = document.getElementById("user-pic");
      const userNameElement = document.getElementById("user-name");
      const menuBtn = document.querySelector(".menu-btn");
      let containerWidth = myModuleContainer.clientWidth;

      // вешаем слушателей на событие hashchange и кликам по пунктам меню
      window.addEventListener("hashchange", () =>
        this.updateState(containerWidth)
      );

      this.updateState(containerWidth); //первая отрисовка

      // вешаем слушателей на кнопки в меню мобильной версии
      menuBtn.addEventListener("click", function () {
        myModuleModel.toggleMenu();
      });

      // инициализируем firebase и вешаем слушателей на регистрацию пользователя
      myModuleModel.initFirebaseAuth(userPicElement, userNameElement);
      signOutButtonElement.addEventListener("click", myModuleModel.signOut);
      signInButtonElement.addEventListener("click", myModuleModel.signIn);
    };

    this.updateState = function (containerWidth) {
      const hashPageName = window.location.hash.slice(1).toLowerCase();
      myModuleModel.updateState(containerWidth);

      if (hashPageName === "main") {
        // вешаем слушателей на изменение экрана(поворот)
        window.addEventListener(
          "resize",
          function () {
            containerWidth = myModuleContainer.clientWidth;
            myModuleModel.updateState(containerWidth);
          },
          false
        );
      }

      if (hashPageName === "game") {
        //вешаем слушателей на селекты
        const select = document.querySelector("div.capitals select");
        const items = [...select.querySelectorAll("option")];
        myModuleModel.sortCapital(items, select);

        d3.select("div.countries select").on("change", (event) => {
          event.preventDefault();
          myModuleModel.getCapitalInfo(event);
        });

        d3.select("div.capitals select").on("change", (event) => {
          event.preventDefault();
          myModuleModel.getCountryInfo(event);
        });

        // вешаем слушателя на чекбокс звука клика
        const soundOn = document.querySelector("#soundOn");
        const clickAudio = new Audio("./data/audio.mp3");

        soundOn.addEventListener("change", function () {
          if (this.checked) {
            myModuleModel.soundInit(clickAudio);
          }
        });

        //вешаем слушателей на кнопки и чекбоксы модальных окон
        const btnOpen = document.querySelector("#modal-open");
        const btnClose = document.querySelector("#modal-close");
        const btnResultClose = document.querySelector("#modalResult-close");
        const btnAttentionClose = document.querySelector(
          "#modalAttention-close"
        );
        const btnAttentionContinue = document.querySelector(
          "#modalAttention-continue"
        );
        const btnCountry = document.querySelector("#modal-country");
        const btnCapital = document.querySelector("#modal-capital");
        const checkbox = document.querySelectorAll(".level");
        const modal = document.querySelector("#modal");
        const modalResult = document.querySelector("#modalResult");
        const modalAttention = document.querySelector("#modalAttention");

        checkbox.forEach((element) => {
          element.addEventListener("change", (event) => {
            event.preventDefault();
            let level = event.target.value;
            myModuleModel.getLevel(level, btnCountry, btnCapital);
          });
        });

        btnOpen.addEventListener("click", (event) => {
          event.preventDefault();
          myModuleModel.toggleModal(modal);
        });
        btnClose.addEventListener("click", (event) => {
          event.preventDefault();
          myModuleModel.toggleModal(modal);
        });
        btnResultClose.addEventListener("click", (event) => {
          event.preventDefault();
          myModuleModel.toggleModal(modalResult);
          myModuleModel.cancelGame();
        });
        btnAttentionClose.addEventListener("click", (event) => {
          event.preventDefault();
          myModuleModel.toggleModal(modalAttention);
          myModuleModel.cancelGame();
        });
        btnAttentionContinue.addEventListener("click", (event) => {
          event.preventDefault();
          myModuleModel.toggleModal(modalAttention);
        });
        btnCountry.addEventListener("click", (event) => {
          event.preventDefault();
          myModuleModel.startGameCountry(modal, btnCountry, btnCapital);
        });
        btnCapital.addEventListener("click", (event) => {
          event.preventDefault();
          myModuleModel.startGameCapital(modal, btnCountry, btnCapital);
        });

        // вешаем  слушателей на кнопки страта, остановки и отмена игры
        const btnStart = document.querySelector("#start");
        const btnStop = document.querySelector("#stop");
        const btnCancel = document.querySelector("#cancel");
        const timer = document.querySelector("#timer");
        const score = document.querySelector(".counter");

        btnStart.addEventListener("click", (event) => {
          event.preventDefault();
          myModuleModel.startGame(btnStop, btnStart, modalAttention);
        });
        btnStop.addEventListener("click", (event) => {
          event.preventDefault();
          let scoreUser = score.textContent;
          let timerUser = timer.textContent;
          myModuleModel.stopGame(scoreUser, timerUser, btnStop, btnStart);
          myModuleModel.toggleModal(modalResult);
        });
        btnCancel.addEventListener("click", (event) => {
          event.preventDefault();
          myModuleModel.cancelGame();
        });

        //интерактив карты
        d3.selectAll("path.land")
          .on("mouseover", (event) => {
            event.preventDefault();
            myModuleModel.showTooltip(event);
          })
          .on("mouseout", function (event) {
            event.preventDefault();
            myModuleModel.hideTooltip();
          })
          .on("mousemove", function (event) {
            event.preventDefault();
            myModuleModel.moveTooltip(event);
          });

        //вешаем слушателей на действия пользователя во время игры
        d3.selectAll("path.land").on("click", (event) => {
          event.preventDefault();
          myModuleModel.showGameTooltip(event);
          myModuleModel.mainGame(event);
          soundOn.checked
            ? myModuleModel.soundOn(clickAudio)
            : myModuleModel.soundOff(clickAudio);
        });

        //zoom карты
        let width = document.querySelector("svg").getBBox().width;
        let height = document.querySelector("svg").getBBox().height;
        d3.select("svg").call(
          d3
            .zoom()
            .scaleExtent([1, 50])
            .translateExtent([
              [0, 0],
              [width, height],
            ])
            .on("zoom", (event) => myModuleModel.zoomed(event))
        );
      }
    };
  }
  /* ------ end controller ----- */

  return {
    init: function ({ container, routes, components }) {
      this.renderComponents(container, components);

      const view = new ModuleView();
      const model = new ModuleModel();
      const controller = new ModuleController();

      //связываем части модуля
      view.init(document.getElementById(container), routes);
      model.init(view);
      controller.init(document.getElementById(container), model);
    },

    renderComponents: function (container, components) {
      const root = document.getElementById(container);
      const componentsList = Object.keys(components);

      for (let item of componentsList) {
        root.innerHTML += components[item].render("component");
      }
    },
  };
})();
/* ------ end app module ----- */

/*** --- init module --- ***/
document.addEventListener(
  "DOMContentLoaded",
  mySPA.init({
    container: "spa",
    routes: routes,
    components: components,
  })
);
