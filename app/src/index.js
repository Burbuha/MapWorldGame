import HomePage from "./pages/HomePage.js";
import GamePage from "./pages/GamePage.js";
import RulesGame from "./pages/RulesGame.js";
import RatingUser from "./pages/RatingUser.js";
import LoginUser from "./pages/LoginUser.js";
import RegistrationUser from "./pages/RegistrationUser.js";
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
  login: LoginUser,
  registr: RegistrationUser,
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

    //Номе Page

    this.drawCanvasGlobe = function (map, projection) {
      canvas = d3
        .select("#map")
        .append("canvas")
        .attr("width", map.w)
        .attr("height", map.h);
      context = canvas.node().getContext("2d");
      path = d3.geo.path().projection(projection).context(context);
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

    this.drawSvgAndSelect = function (map, path) {
      //SVG контейнер
      const svg = d3
        .select(".game_map")
        .append("svg")
        .attr("width", map.width)
        .attr("height", map.height);
      //Adding water
      svg
        .append("path")
        .datum({ type: "Sphere" })
        .attr("class", "water")
        .attr("d", path);

      d3.select(".task").html(
        `<div class = "countryTooltip"></div>
        <h2>Режим обучения</h2>
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
      const world = d3
        .select("svg")
        .selectAll("path.land")
        .data(countries)
        .enter()
        .append("path")
        .attr("class", "land")
        .attr("d", path);
      console.log(world);
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
  }
  /* -------- end view --------- */
  /* ------- begin model ------- */
  function ModuleModel() {
    let myModuleView = null;

    this.init = function (view) {
      myModuleView = view;
    };

    this.updateState = function () {
      const hashPageName = window.location.hash.slice(1).toLowerCase();

      myModuleView.renderContent(hashPageName);
      if (hashPageName === "main" || hashPageName.length === 0) {
        this.drawGlobe();
      }
      if (hashPageName === "game") {
        this.drawGameMap();
      }
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
      const projection = d3.geo
        .orthographic() //ортографическая проекция
        .scale(map.w / 2.5) //коэффициент масштабирования
        .translate([map.w / 2, map.h / 2]); //центр карты
      //получаем координатную сетку
      const graticule = d3.geo.graticule();

      myModuleView.drawCanvasGlobe(map, projection);

      d3.json("data/world-110m.json", function (error, topo) {
        if (error) throw error;

        //конвертируем TopoJSON в GeoJSON
        const land = topojson.feature(topo, topo.objects.land), //контуры материков
          grid = graticule(); //координатная сетка

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

    this.drawGameMap = function () {
      const map = {
        width: 900,
        height: 500,
        sens: 0.25,
        focused: null,
      };

      //Настройки проекции

      const projection = d3.geo
        .mercator()
        .scale(140)
        .translate([map.width / 2, map.height / 2]);

      const path = d3.geo.path().projection(projection);

      //рисуем svg и select'ы
      myModuleView.drawSvgAndSelect(map, path);

      //читаем данные
      queue()
        .defer(d3.json, "data/world-110m.json")
        .defer(d3.tsv, "data/world-110m-country-names.tsv")
        .await(ready);

      //Main function

      function ready(error, world, countryData) {
        var countryById = {},
          countries = topojson.feature(world, world.objects.countries).features;

        //Добавляем страны и столицы в select
        countryData.forEach(function (d) {
          countryById[d.id] = { id: d.id, name: d.name, capital: d.capital };
          myModuleView.addInfoSelect(d);
        });

        // //Рисуем страны на глобусе
        myModuleView.drawMap(countries, path);

        //Обработка событий мыши
        //задаем стартовые координаты при захвате элемента,
        //широту и долготу

        //Mouse events

        d3.selectAll("path.land")
          .on("mouseover", function (d) {
            var tooltip = {
              name: countryById[d.id].name,
              capital: countryById[d.id].capital,
              x: d3.event.pageX + 7,
              y: d3.event.pageY - 15,
            };
            myModuleView.showTooltip(tooltip);
          })
          .on("mouseout", function () {
            myModuleView.hideTooltip();
          })
          .on("mousemove", function () {
            const tooltip = {
              x: d3.event.pageX + 7,
              y: d3.event.pageY - 15,
            };
            myModuleView.moveTooltip(tooltip);
          });

        //Для реализации фокусировки на стране пишем функцию,
        //которая возвращает нам геоданные для страны по её id
        function country(cnt, sel) {
          for (var i = 0, l = cnt.length; i < l; i++) {
            if (cnt[i].id == sel.value || cnt[i].id == sel.value) {
              return cnt[i];
            }
          }
        }

        //Country focus on option select

        d3.select("div.countries select").on("change", function () {
          var focusedCountry = country(countries, this);
          // myModuleView.getCapitalInfo(focusedCountry);

          document.querySelector(".thisCapital").innerHTML =
            "<h4>СТОЛИЦА: " + countryById[focusedCountry.id].capital + "</h4>";

          d3.select("svg")
            .selectAll(".focused")
            .classed("focused", (map.focused = false));
          d3.select("svg")
            .selectAll("path")
            .attr("d", path)
            .classed("focused", function (d, i) {
              return d.id == focusedCountry.id ? (map.focused = d) : false;
            });
        });

        d3.select("div.capitals select").on("change", function () {
          var focusedCountry = country(countries, this);

          document.querySelector(".thisCountry").innerHTML =
            "<h4>СТРАНА: " + countryById[focusedCountry.id].name + "</h4>";

          d3.select("svg")
            .selectAll(".focused")
            .classed("focused", (map.focused = false));
          d3.select("svg")
            .selectAll("path")
            .attr("d", path)
            .classed("focused", function (d, i) {
              return d.id == focusedCountry.id ? (map.focused = d) : false;
            });
        });
      }
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

      //вешаем слушателей на MouseEvent
      // d3.selectAll("path.land")
      //   .on("mouseover", this.showCountryName)
      //   .on("mouseout", this.hideCountryName)
      //   .on("mousemove", this.showNextCountryName);

      this.updateState(); //первая отрисовка
    };

    this.updateState = function () {
      myModuleModel.updateState();
    };
    // this.showCountryName = function (event) {
    //   myModuleModel.showCountryName(event);
    // };
    // this.hideCountryName = function (event) {
    //   myModuleModel.hideCountryName(event);
    // };
    // this.showNextCountryName = function (event) {
    //   myModuleModel.showNextCountryName(event);
    // };
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
