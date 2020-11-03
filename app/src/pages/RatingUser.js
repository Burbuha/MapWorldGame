const RatingUser = {
  id: "rating",
  title: "Карта Мира - Рейтинг победителей",
  render: (className = "container", ...rest) => {
    return `
      <section class="${className}">
        <div class="rating">
          <h2 class = "header">Рейтинг игроков</h2>
            <div class="users-list">
              <table id="users-list" class="table_rating">
                  <thead>
                      <tr>
                          <th>Рейтинг</th>
                          <th>Игрок</th>
                          <th>Очки</th>
                      </tr>
                  </thead>                                
                      <tr>
                          <td>1</td>
                          <td>GeoGuru</td>
                          <td>150</td>
                      </tr>                                
                  <thead>
                      <tr>
                          <td>2</td>
                          <td>Egor</td>
                          <td>130</td>
                      </tr> 
                  </thead>
                  <tbody id="users-list__container"></tbody>
              </table>
            </div>
        </div>
      </section>
    `;
  },
};

export default RatingUser;
