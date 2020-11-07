const RatingUser = {
  id: "rating",
  title: "Карта Мира - Рейтинг победителей",
  render: (className = "container", ...rest) => {
    return `
      <section class="${className}">
        <div class="rating">
          <h2 class = "rating-title">Рейтинг игроков</h2>
            <div class="users-list">
              <div class="table_rating">                  
                <div>Место</div>
                <div>Пользователь</div>
                <div class = "user-list__hide-date">Дата</div>
                <div class = "user-list__hide-score">Количество правильных ответов</div>
                <div class = "user-list__hide-persent">Процент правильных ответов</div>                
              </div>  
              <div id="users-list" class="table_rating"></div>               
            </div>
        </div>
      </section>
    `;
  },
};

export default RatingUser;
