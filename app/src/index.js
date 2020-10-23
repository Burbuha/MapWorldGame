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

    this.drawCanvasMap = function (map, projection) {
      canvas = d3
        .select("#map")
        .append("canvas")
        .attr("width", map.w)
        .attr("height", map.h);
      context = canvas.node().getContext("2d");
      path = d3.geo.path().projection(projection).context(context);
    };

    this.drawMap = function (map, drawMap) {
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
        this.drawMap();
      }
      if (hashPageName === "game") {
        this.drawGameMap();
      }
    };

    this.drawMap = function () {
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

      myModuleView.drawCanvasMap(map, projection);

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
          myModuleView.drawMap(map, drawMap);
        });
      });
    };

    this.drawGameMap = function () {
      var width = 900,
        height = 500,
        sens = 0.25,
        focused;

      //Настройки проекции

      var projection = d3.geo
        .mercator()
        .scale(140)
        .translate([width / 2, height / 2]);

      var path = d3.geo.path().projection(projection);

      //SVG контейнер

      var svg = d3
        .select(".game_map")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      //Adding water

      svg
        .append("path")
        .datum({ type: "Sphere" })
        .attr("class", "water")
        .attr("d", path);

      var countryTooltip = d3
          .select(".task")
          .append("div")
          .attr("class", "countryTooltip"),
        countryList = d3
          .select(".task")
          .append("select")
          .attr("name", "countries");

      //читаем данные
      queue()
        .defer(d3.json, "data/world-110m.json")
        .defer(d3.tsv, "data/world-110m-country-names.tsv")
        .await(ready);

      //Main function

      function ready(error, world, countryData) {
        var countryById = {},
          countries = topojson.feature(world, world.objects.countries).features;

        console.log(countries);

        //Добавляем страны в select

        countryData.forEach(function (d) {
          countryById[d.id] = { name: d.name, capital: d.capital };
          let option = countryList.append("option");
          option.text(d.name);
          option.property("value", d.id);
        });

        //Рисуем страны на глобусе

        var world = svg
          .selectAll("path.land")
          .data(countries)
          .enter()
          .append("path")
          .attr("class", "land")
          .attr("d", path)

          //Обработка событий мыши
          //задаем стартовые координаты при захвате элемента,
          //широту и долготу

          //Mouse events

          .on("mouseover", function (d) {
            console.log(countryById);

            countryTooltip
              .text(countryById[d.id].name + ": " + countryById[d.id].capital)
              .style("left", d3.event.pageX + 7 + "px")
              .style("top", d3.event.pageY - 15 + "px")
              .style("display", "block")
              .style("opacity", 1);
          })
          .on("mouseout", function (d) {
            countryTooltip.style("opacity", 0).style("display", "none");
          })
          .on("mousemove", function (d) {
            countryTooltip
              .style("left", d3.event.pageX + 7 + "px")
              .style("top", d3.event.pageY - 15 + "px");
          });

        //Для реализации фокусировки на стране пишем функцию,
        //которая возвращает нам геоданные для страны по её id
        function country(cnt, sel) {
          for (var i = 0, l = cnt.length; i < l; i++) {
            if (cnt[i].id == sel.value) {
              return cnt[i];
            }
          }
        }

        //Country focus on option select

        console.log(countryData);

        d3.select("select").on("change", function () {
          var focusedCountry = country(countries, this);
          d3.select(".task").append("div").attr("class", "capital");
          document.querySelector(".capital").innerHTML =
            "<h3>СТОЛИЦА: " + countryById[focusedCountry.id].capital + "</h3>";

          svg.selectAll(".focused").classed("focused", (focused = false));
          svg
            .selectAll("path")
            .attr("d", path)
            .classed("focused", function (d, i) {
              return d.id == focusedCountry.id ? (focused = d) : false;
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

      this.updateState(); //первая отрисовка
    };

    this.updateState = function () {
      myModuleModel.updateState();
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
