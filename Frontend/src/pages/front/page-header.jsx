function PageHeader({ title }) {
  return (
    <div
      id="page-header"
      class="section-container page-header-container bg-dark"
    >
      <div class="page-header-cover">
        <img
          src={`${process.env.REACT_APP_URL}/front-assets/assets/img/cover/cover-12.jpg`}
          alt=""
        />
      </div>
      <div class="container">
        <h1 class="page-header">{title}</h1>
      </div>
    </div>
  );
}

export default PageHeader;
