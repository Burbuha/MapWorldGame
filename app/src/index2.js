import HomePage from "./pages/HomePage.js";
import GamePage from "./pages/GamePage.js";
import RulesGame from "./pages/RulesGame.js";
import RatingUser from "./pages/RatingUser.js";
// import LoginUser from "./pages/LoginUser.js";
// import RegistrationUser from "./pages/RegistrationUser.js";
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
  rating: RatingUser,
  // registr: RegistrationUser,
  // login: LoginUser,
  error: ErrorPage,
  // default: HomePage,
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

    this.initFirebaseAuth = function (url, userName) {
      const userPicElement = document.getElementById("user-pic");
      const userNameElement = document.getElementById("user-name");
      const signInButtonElement = document.getElementById("sign-in");
      const signOutButtonElement = document.getElementById("sign-out");

      userPicElement.style.backgroundImage = "url(" + url + ")";
      userNameElement.textContent = userName;

      // Show user's profile and sign-out button.
      userNameElement.removeAttribute("hidden");
      userPicElement.removeAttribute("hidden");
      signOutButtonElement.removeAttribute("hidden");

      // Hide sign-in button.
      signInButtonElement.setAttribute("hidden", "true");
    };

    this.outFirebaseAuth = function () {
      const userPicElement = document.getElementById("user-pic");
      const userNameElement = document.getElementById("user-name");
      const signInButtonElement = document.getElementById("sign-in");
      const signOutButtonElement = document.getElementById("sign-out");
      userNameElement.setAttribute("hidden", "true");
      userPicElement.setAttribute("display", "none");
      signOutButtonElement.setAttribute("hidden", "true");

      // Show sign-in button.
      signInButtonElement.removeAttribute("hidden");
    };

    //Номе Page

    this.drawCanvasGlobe = function (map, projection) {
      canvas = d3
        .select("#map")
        .append("canvas")
        .attr("width", map.w)
        .attr("height", map.h);

      context = canvas.node().getContext("2d");
      path = d3.geoPath(projection, context);
    };

    this.drawGlobe = function (map, drawMap) {
      context.clearRect(0, 0, map.w, map.h);

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

    this.toggle = function () {
      document
        .querySelector(".container-modal")
        .classList.toggle("modal_closed");
      document.getElementById("modal").classList.toggle("modal_closed");
      document.getElementById("modal-overlay").classList.toggle("modal_closed");
    };

    this.drawSvg = function (map, path) {
      //SVG контейнер
      const svg = d3
        .select(".game_map")
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
        <div class = "countryTooltip"></div>
        <div class = "countries">
          <h3>Поиск по стране:</h3>
          <select name = "countries"><option>Выберите страну</option></select>
          <div class = "thisCapital"></div>                  
        </div>
        <div class = "capitals">
          <h3>Поиск по столице:</h3>
          <select name = "capitals"><option>Выберите столицу</option></select>
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
      d3.select(".countryTooltip")
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

    this.getCapitalInfo = function (capital, status, map, path) {
      document.querySelector(".thisCapital").innerHTML =
        "<h4>СТОЛИЦА: " + capital + "</h4>";
      d3.select("svg").selectAll(".focused").classed("focused", map.focused);
      d3.select("svg")
        .selectAll("path")
        .attr("d", path)
        .classed("focused", status);
    };

    this.getCountryInfo = function (country, status, map, path) {
      document.querySelector(".thisCountry").innerHTML =
        "<h4>СТРАНА: " + country + "</h4>";

      d3.select("svg").selectAll(".focused").classed("focused", false);
      d3.select("svg")
        .selectAll("path")
        .attr("d", path)
        .classed("focused", status);
    };

    this.zoomed = function (transform) {
      d3.select("g").attr("transform", transform);
    };

    // this.loginError = function (error) {
    //   document.querySelector("#error").innerHTML = `${error}`;
    // };

    // this.regUser = function () {
    //   document.querySelector(".fieldset-hidden").setAttribute("hidden", "true");
    //   document.querySelector(
    //     ".regSucces"
    //   ).innerHTML = `<p>Регистрация прошла успешно. <a href="#main" class="flipper">Перейти на главную.</a>`;
    // };

    // this.logInUser = function () {
    //   document.querySelector(".fieldset-hidden").setAttribute("hidden", "true");
    //   document.querySelector(".hiddenIn").setAttribute("hidden", "true");
    //   document.querySelector(".hiddenReg").setAttribute("hidden", "true");
    //   document.querySelector(".hiddenOut").removeAttribute("hidden");

    //   document.querySelector(
    //     ".loginSucces"
    //   ).innerHTML = `Вы вошли в свой аккаунт. <a href="#main" class="flipper">Перейти на главную.</a>`;
    // };

    // this.logOutUser = function () {
    //   document.querySelector(".fieldset-hidden").removeAttribute("hidden");
    //   document.querySelector(".hiddenIn").removeAttribute("hidden");
    //   document.querySelector(".hiddenReg").removeAttribute("hidden");
    //   document.querySelector(".hiddenOut").setAttribute("hidden", "true");
    // };
  }
  /* -------- end view --------- */
  /* ------- begin model ------- */
  function ModuleModel() {
    let myModuleView = null;
    let self = this;
    let path = null;
    let hashPageName = null;
    let countryById = null;
    let countries = null;
    let countryData = null;

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
        let сountryData2 = promises[1];
        let сountryById2 = {};
        let сountries2 = topojson.feature(world, world.objects.countries)
          .features;

        сountryData2.forEach(function (d) {
          сountryById2[d.id] = {
            id: d.id,
            name: d.name,
            capital: d.capital,
            area: d.area,
          };
        });
        localStorage.setItem("countries", JSON.stringify(сountries2));
        localStorage.setItem("countryById", JSON.stringify(сountryById2));
        localStorage.setItem("countryData", JSON.stringify(сountryData2));
      }

      countries = JSON.parse(localStorage.getItem("countries"));
      countryById = JSON.parse(localStorage.getItem("countryById"));
      countryData = JSON.parse(localStorage.getItem("countryData"));
      console.log(countries);
    };

    this.updateState = function () {
      hashPageName = window.location.hash.slice(1).toLowerCase();

      myModuleView.renderContent(hashPageName);
      if (hashPageName === "main" || hashPageName.length === 0) {
        this.drawGlobe();
      }
      if (hashPageName === "game") {
        this.drawSvgMap();
        this.drawSelectMap();
      }
    };

    this.toggleModal = function () {
      myModuleView.toggle();
    };

    this.signIn = function () {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider);
    };

    this.signOut = function () {
      firebase.auth().signOut();
    };
    // Returns the signed-in user's profile Pic URL.
    this.getProfilePicUrl = function () {
      return (
        firebase.auth().currentUser.photoURL ||
        "/images/profile_placeholder.png"
      );
    };

    // Returns the signed-in user's display name.
    this.getUserName = function () {
      return firebase.auth().currentUser.displayName;
    };

    this.isUserSignedIn = function () {
      return !!firebase.auth().currentUser;
    };

    // Adds a size to Google Profile pics URLs.
    this.addSizeToGoogleProfilePic = function (url) {
      if (
        url.indexOf("googleusercontent.com") !== -1 &&
        url.indexOf("?") === -1
      ) {
        return url + "?sz=150";
      }
      return url;
    };

    this.initFirebaseAuth = function (userPicElement, userNameElement) {
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

    this.drawGlobe = function () {
      const map = {
        w: 500,
        h: 500,
        speed: 0.01,
        start: Date.now(),
        sphere: { type: "Sphere" },
      };
      //настраиваем проекцию
      const projection = d3
        .geoOrthographic() //ортографическая проекция
        .scale(map.w / 2.5) //коэффициент масштабирования
        .translate([map.w / 2, map.h / 2]); //центр карты

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

    //Для реализации фокусировки на стране пишем функцию,
    //которая возвращает нам геоданные для страны по её id
    this.country = function (cnt, sel) {
      for (var i = 0, l = cnt.length; i < l; i++) {
        if (cnt[i].id == sel.value || cnt[i].id == sel.value) {
          return cnt[i];
        }
      }
    };

    this.showTooltip = function (event, countryById) {
      let d = d3.select(this).data()[0];
      console.log(d);

      var tooltip = {
        name: countryById[d.id].name,
        capital: countryById[d.id].capital,
        x: event.pageX + 7,
        y: event.pageY - 15,
      };
      myModuleView.showTooltip(tooltip);
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

    this.drawSvgMap = function () {
      const map = {
        width: 1000,
        height: 600,
        focused: false,
      };

      //Настройки проекции
      const projection = d3
        .geoMercator()
        .scale(140)
        .translate([map.width / 2, map.height / 2]);

      path = d3.geoPath(projection);

      //рисуем svg
      myModuleView.drawSvg(map, path);
      self.drawGameMap();
    };

    this.drawSelectMap = function () {
      //рисуем select'ы
      myModuleView.drawSelect();
    };

    // this.getData = function () {
    //   //читаем данные

    //   const files = [
    //     "./data/world-50m.json",
    //     "./data/world-110m-country-names.tsv",
    //   ];
    //   const promises = [];
    //   files.forEach(function (url, index) {
    //     promises.push(index ? d3.tsv(url) : d3.json(url));
    //   });
    //   Promise.all(promises).then(self.drawGameMap);
    // };

    this.drawGameMap = function () {
      // let world = promises[0];
      // let countryData = promises[1];

      // countryById = {};
      // countries = topojson.feature(world, world.objects.countries).features;
      // console.log(countries);
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

      console.log(countryById);
      //Рисуем страны на карте
      myModuleView.drawMap(countries, path);

      //self.mouseEvent(path, countryById, countries);
    };

    this.mouseEvent = function (path, countryById, countries) {
      //Обработка событий мыши
      //задаем стартовые координаты при захвате элемента,
      //широту и долготы
      // d3.selectAll("path.land")
      // .on("mouseover", function (event) {
      //   let d = d3.select(this).data()[0];
      //   var tooltip = {
      //     name: countryById[d.id].name,
      //     capital: countryById[d.id].capital,
      //     x: event.pageX + 7,
      //     y: event.pageY - 15,
      //   };
      //   myModuleView.showTooltip(tooltip);
      //   console.log(d);
      // })
      // .on("mouseout", function () {
      //   myModuleView.hideTooltip();
      // })
      // .on("mousemove", function (event) {
      //   const tooltip = {
      //     x: event.pageX + 7,
      //     y: event.pageY - 15,
      //   };
      //   myModuleView.moveTooltip(tooltip);
      // });
      //Country focus on option select
      // d3.select("div.countries select").on("change", function () {
      //   let focusedCountry = self.country(countries, this);
      //   let capital = countryById[focusedCountry.id].capital;
      //   let status = function isFocused(d) {
      //     return d.id == focusedCountry.id ? (map.focused = d) : false;
      //   };
      //   myModuleView.getCapitalInfo(capital, status, map, path);
      // });
      // d3.select("div.capitals select").on("change", function () {
      //   var focusedCountry = self.country(countries, this);
      //   let country = countryById[focusedCountry.id].name;
      //   let status = function isFocused(d) {
      //     return d.id == focusedCountry.id ? (map.focused = d) : false;
      //   };
      //   myModuleView.getCountryInfo(country, status, map, path);
      // });
    };

    this.getCapitalInfo = function (path, countryById, countries) {
      path = self.path;
      countryById = self.countryById;
      countries = self.countries;
      console.log(path, countryById, countries);

      let focusedCountry = self.country(countries, this);
      let capital = countryById[focusedCountry.id].capital;
      let status = function isFocused(d) {
        return d.id == focusedCountry.id ? (map.focused = d) : false;
      };
      myModuleView.getCapitalInfo(capital, status, map, path);
    };

    this.getCountryInfo = function (path, countryById, countries) {
      let focusedCountry = self.country(countries, this);
      let capital = countryById[focusedCountry.id].capital;
      let status = function isFocused(d) {
        return d.id == focusedCountry.id ? (map.focused = d) : false;
      };
      myModuleView.getCapitalInfo(capital, status, map, path);
    };

    this.zoomed = function (event) {
      const { transform } = event;
      myModuleView.zoomed(transform);
    };

    this.startGameCapital = function () {
      self.toggleModal();
    };
    this.startGameCountry = function () {
      self.toggleModal();
    };

    //регистрация пользователя
    // this.addNewUser = function (user) {
    //   if (user.mail && user.password && user.name) {
    //     firebase
    //       .auth()
    //       .createUserWithEmailAndPassword(user.mail, user.password)
    //       .catch(function (error) {
    //         console.log("Error: " + error.message);
    //         myModuleView.loginError("Введите корректные данные.");
    //       });
    //   }
    // };

    //вход в аккаунт пользователя
    // this.logIn = function (user) {
    //   if (user.mail && user.password) {
    //     firebase
    //       .auth()
    //       .signInWithEmailAndPassword(user.mail, user.password)
    //       .catch(function (error) {
    //         console.log("Error: " + error.message);
    //         myModuleView.loginError(
    //           "Неверный email или пароль. Введите корректные данные."
    //         );
    //       });

    //     firebase.auth().onAuthStateChanged(function (user) {
    //       if (user) {
    //         // User is signed in.
    //         myModuleView.logInUser();
    //       } else {
    //         // No user is signed in.
    //         console.log("no users");
    //       }
    //     });
    //   } else {
    //     myAppView.loginError(
    //       "Пустое поле Email или Password. Введите данные в указанные поля."
    //     );
    //   }
    // };

    // //проверка на то, вошел ли пользователь
    // this.initFirebaseAuth = function (user) {
    //   user = firebase.auth().currentUser;
    //   firebase.auth().onAuthStateChanged(() => {
    //     if (user) {
    //       // User is signed in!
    //       myModuleView.logInUser();
    //     } else {
    //       myModuleView.logOutUser();
    //     }
    //   });
    // };

    //выход пользователя
    // this.logOut = function () {
    //   firebase.auth().signOut();
    // };
  }

  /* -------- end model -------- */
  /* ----- begin controller ---- */
  function ModuleController() {
    let myModuleContainer = null;
    let myModuleModel = null;

    this.init = function (container, model) {
      myModuleContainer = container;
      myModuleModel = model;

      // вешаем слушателей на событие hashchange и кликам по пунктам меню
      window.addEventListener("hashchange", this.updateState);

      this.updateState(); //первая отрисовка
    };

    this.updateState = function () {
      myModuleModel.updateState();

      const signInButtonElement = document.getElementById("sign-in");
      const signOutButtonElement = document.getElementById("sign-out");
      const userPicElement = document.getElementById("user-pic");
      const userNameElement = document.getElementById("user-name");
      const hashPageName = window.location.hash.slice(1).toLowerCase();

      myModuleModel.initFirebaseAuth(userPicElement, userNameElement);
      signOutButtonElement.addEventListener("click", myModuleModel.signOut);
      signInButtonElement.addEventListener("click", myModuleModel.signIn);

      if (hashPageName == "game") {
        //модальное окно
        const btnOpen = document.querySelector("#modal-open");
        const btnClose = document.querySelector("#modal-close");
        const btnCountry = document.querySelector("#modal-country");
        const btnCapital = document.querySelector("#modal-capital");

        btnOpen.addEventListener("click", (event) => {
          event.preventDefault();
          myModuleModel.toggleModal();
        });
        btnClose.addEventListener("click", (event) => {
          event.preventDefault();
          myModuleModel.toggleModal();
        });
        btnCountry.addEventListener("click", (event) => {
          event.preventDefault();
          myModuleModel.startGameCountry();
        });
        btnCapital.addEventListener("click", (event) => {
          event.preventDefault();
          myModuleModel.startGameCapital();
        });

        //селекты
        d3.select("div.countries select").on("change", (event) => {
          event.preventDefault();
          myModuleModel.getCapitalInfo();
        });

        d3.select("div.capitals select").on("change", (event) => {
          event.preventDefault();
          myModuleModel.getCountryInfo();
        });

        //zoom карты
        let width = document.querySelector("svg").getBBox().width;
        let height = document.querySelector("svg").getBBox().height;
        d3.select("svg").call(
          d3
            .zoom()
            .scaleExtent([1, 20])
            .translateExtent([
              [0, 0],
              [width, height],
            ])
            .extent([
              [0, 0],
              [width, height],
            ])
            .on("zoom", (event) => myModuleModel.zoomed(event))
        );

        d3.selectAll("path.land")
          .on("mouseover", (event) => {
            event.preventDefault();
            console.log("event");
            myModuleModel.showTooltip(event);
          })
          .on("mouseout", function (event) {
            event.preventDefault();
            myModuleModel.hideTooltip();
          })
          .on("mousemove", function (event) {
            event.preventDefault();
            myModuleModel.moveTooltip(tooltip);
          });
      }

      //регистрация
      // if (hashPageName == "registr") {
      //   myModuleModel.initFirebaseAuth();
      //   const btnReg = document.querySelector("#btnReg");

      //   btnReg.addEventListener("click", (event) => {
      //     event.preventDefault();
      //     const user = {
      //       mail: document.querySelector("#newUserEmail").value,
      //       name: document.querySelector("#newUserName").value,
      //       password: document.querySelector("#newUserPassword").value,
      //     };
      //     myModuleModel.addNewUser(user);
      //     user.name = "";
      //     user.password = "";
      //     user.email = "";
      //   });
      // }
      //вход пользователя
      // if (hashPageName == "login") {
      //   myModuleModel.initFirebaseAuth();
      //   const btnIn = document.querySelector("#btnIn");
      //   const btnOut = document.querySelector("#hiddenOut");

      //   btnIn.addEventListener("click", (event) => {
      //     event.preventDefault();
      //     const user = {
      //       mail: document.querySelector("#userEmail").value,
      //       password: document.querySelector("#userPassword").value,
      //     };
      //     console.log(user);
      //     myModuleModel.logIn(user);
      //   });

      //   btnOut.addEventListener("click", (event) => {
      //     event.preventDefault();
      //     myModuleModel.logOut();
      //   });
      // }
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
