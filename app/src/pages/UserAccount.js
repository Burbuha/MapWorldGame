const UserAccount = {
  id: "rating",
  title: "Карта Мира - Личный кабинет",
  render: (className = "container", ...rest) => {
    return `
      <section class="${className}">
        <div class="account">
          <h2 class = "title">Личный кабинет</h2>
          <div class="users-list">
            <div class = "user-statistics">
              <div class = "header-statistics"></div>
              <div id="users-statistics-country">
              <object type="image/svg+xml" data="../img/745.svg" class = "loader"></object>
              </div>
              <div id="users-statistics-capital"></div>
            </div>
          </div>
        </div>
      </section>
    `;
  },
};

export default UserAccount;
