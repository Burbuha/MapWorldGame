const RatingUser = {
  id: "rating",
  title: "Карта Мира - Рейтинг победителей",
  render: (className = "container", ...rest) => {
    return `
      <section class="${className}">
        <div class="rating">
          <h2 class = "rating-title">Рейтинг игроков</h2>
            <div class="users-list">
              
            <div class = "rating_country">
              <h3>Страны</h3>              
              <div class="table_rating">                  
                <div>Место</div>
                <div>Пользователь</div>
                <div class = "user-list__hide-date">Дата</div>
                <div class = "user-list__hide-score">Количество правильных ответов</div>
                <div class = "user-list__hide-persent">%</div>
                <div class = "user-list__hide-level">Уровень</div>                
              </div>  
              <div id="users-list-country" class="table_rating">
              <object type="image/svg+xml" data="../img/745.svg" class = "loader"></object>
              </div>
            </div> 
              
            <div class = "rating_capital">
              <h3>Столицы</h3>
              <div class="table_rating">                  
                <div>Место</div>
                <div>Пользователь</div>
                <div class = "user-list__hide-date">Дата</div>
                <div class = "user-list__hide-score">Количество правильных ответов</div>
                <div class = "user-list__hide-persent">%</div>
                <div class = "user-list__hide-level">Уровень</div>                
              </div>  
              <div id="users-list-capital" class="table_rating">
              <object type="image/svg+xml" data="../img/745.svg" class = "loader"></object>
              </div> 
            </div>

            </div>
        </div>
        
      </section>
    `;
  },
};

export default RatingUser;
