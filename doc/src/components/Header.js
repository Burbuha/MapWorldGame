const Header = {
  render: (customClass = "") => {
    return `
    <div class="header_game ${customClass}" id="header">
      <h1 class="header_title">Карта мира</h1>
    </div>
    `;
  },
};

export default Header;
