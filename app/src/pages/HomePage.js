const HomePage = {
  id: "main",
  title: "Карта Мира - Главная",
  render: (className = "container", ...rest) => {
    return `
      <section class="${className}">
      
        <div id="globe" class="home-globe"></div>
        <aside class="home-aside">
         <blockquote class = "font-decor">"До чего люди любят карты и планы! А почему? Да потому, что там, на картах и планах, можно потрогать север, юг, восток и запад рукой..."
        <br>Рей Бредбери</blockquote> 
        <p><span class = "font-decor">КАРТА МИРА</span> - это увлекательная образовательная географическая игра, с помощью которой:</p> 
        <p><i class="icon-diamond"></i>Изучаешь страны и их столицы при помощи упражнений с контурными картами!</p>
        <p><i class="icon-diamond"></i>Тренируешь память!</p>
        <p><i class="icon-diamond"></i>Расширяешь свой кругозор!</p>
        </aside>
        
      </section>
      `;
  },
};

export default HomePage;
