import HomePage from "./pages/HomePage.js";
import GamePage from "./pages/GamePage.js";
import RulesGame from "./pages/RulesGame.js";
import RatingUser from "./pages/RatingUser.js";
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

    this.showGame = function () {
      document.querySelector(".game_learn").setAttribute("hidden", "true");
      document.querySelector(".game_play").removeAttribute("hidden");
    };

    this.hideGame = function () {
      document.querySelector(".game_learn").removeAttribute("hidden");
      document.querySelector(".game_play").setAttribute("hidden", "true");
      document.querySelector(".timer").innerHTML = "";
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
        <div id = "learnTooltip" class = "countryTooltip"></div>
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

    this.sortCapital = function () {
      let select = document.querySelector("div.capitals select");
      let items = [...select.querySelectorAll("option")];
      items.sort((a, b) => (a.text == b.text ? 0 : a.text < b.text ? -1 : 1));
      items.forEach((item) => select.appendChild(item));
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

    this.clearFocus = function (map) {
      d3.select("svg").selectAll(".focused").classed("focused", map.focused);
    };

    this.zoomed = function (transform) {
      d3.select("g").attr("transform", transform);
    };

    this.addTimer = function (strTimer) {
      document.getElementById("timer").innerHTML = strTimer;
    };
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
    let timerId = null;

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

        if (
          !localStorage.getItem("countries") &&
          !localStorage.getItem("countryById") &&
          !localStorage.getItem("countryById")
        ) {
          localStorage.setItem("countries", JSON.stringify(сountries2));
          localStorage.setItem("countryById", JSON.stringify(сountryById2));
          localStorage.setItem("countryData", JSON.stringify(сountryData2));
        }
      }

      countries = JSON.parse(localStorage.getItem("countries"));
      countryById = JSON.parse(localStorage.getItem("countryById"));
      countryData = JSON.parse(localStorage.getItem("countryData"));
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

    this.drawSvgMap = function () {
      const map = {
        width: 1100,
        height: 700,
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
      myModuleView.drawMap(countries, path);
    };

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
      myModuleView.sortCapital();
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

    this.showTooltip = function (event) {
      let d = d3.select(event.target).data()[0];
      var tooltip = {
        name: countryById[d.id].name,
        capital: countryById[d.id].capital,
        x: event.pageX + 7,
        y: event.pageY - 15,
      };
      myModuleView.showTooltip(tooltip);
    };

    this.showGameTooltip = function (event) {
      let d = d3.select(event.target).data()[0];
      var tooltip = {
        name: countryById[d.id].name,
        capital: countryById[d.id].capital,
        x: event.pageX + 7,
        y: event.pageY - 15,
      };
      myModuleView.showGameTooltip(tooltip);
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

    this.zoomed = function (event) {
      const { transform } = event;
      myModuleView.zoomed(transform);
    };

    this.startGameCapital = function () {
      self.toggleModal();
      myModuleView.clearFocus(false);
      myModuleView.showGame();
      console.log(countryById);
    };

    this.startGameCountry = function () {
      self.toggleModal();
      myModuleView.clearFocus(false);
      myModuleView.showGame();
      console.log(countryById);

      //Получаем рандомно страну и столицу
      let res = Object.keys(countryById);
      let randCountry = Math.floor(Math.random() * res.length);
      console.log(res[randCountry] + " " + countryById[res[randCountry]].name);
      console.log(
        res[randCountry] + " " + countryById[res[randCountry]].capital
      );

      //Получаем объект 100 крупнейших по площади стран
      let countryById100 = {};
      for (let key in countryById) {
        if (countryById[key].area < 100) {
          countryById100[key] = countryById[key];
        }
      }
      console.log(countryById100);
    };

    this.startGame = function () {
      //Запускаем секундомер
      let min = 0,
        hour = 0,
        sec = 0;
      timerId = setTimeout(function tick() {
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
        timerId = setTimeout(tick, 1000); // (*)
      }, 1000);
    };

    this.cancelGame = function () {
      clearTimeout(timerId);
      myModuleView.hideGame();
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
        //селекты
        d3.select("div.countries select").on("change", (event) => {
          event.preventDefault();
          myModuleModel.getCapitalInfo(event);
        });

        d3.select("div.capitals select").on("change", (event) => {
          event.preventDefault();
          myModuleModel.getCountryInfo(event);
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

        //страт и отмена игры
        const btnStart = document.querySelector("#start");
        const btnCancel = document.querySelector("#cancel");

        btnStart.addEventListener("click", (event) => {
          event.preventDefault();
          myModuleModel.startGame();
        });
        btnCancel.addEventListener("click", (event) => {
          event.preventDefault();
          myModuleModel.cancelGame();
        });

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

        d3.selectAll("path.land").on("click", (event) => {
          event.preventDefault();
          myModuleModel.showGameTooltip(event);
        });
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
