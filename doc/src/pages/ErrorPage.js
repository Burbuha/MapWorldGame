const ErrorPage = {
  id: "error",
  title: "Страница не найдена...",
  render: (className = "container", ...rest) => {
    return `
      <section class="${className}">
        <h1>Ошибка 404</h1>
        <p>Страница не найдена, попробуйте вернуться на <a href="#main">главную</a>.</p>
      </section>
    `;
  },
};

export default ErrorPage;
