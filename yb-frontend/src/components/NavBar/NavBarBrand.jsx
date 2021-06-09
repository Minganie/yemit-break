function NavBarBrand({ burgerIsOpen, onBurgerToggle }) {
  return (
    <div className="navbar-brand">
      <a href="/" className="navbar-item">
        <img
          src="logo192.png"
          alt="The League: a FFXIV free company on Mateus (Crystal)"
          width="28"
          height="28"
        />
      </a>

      <a
        href="/"
        role="button"
        className={`navbar-burger${burgerIsOpen ? " is-active" : ""}`}
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
        onClick={onBurgerToggle}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>
  );
}

export default NavBarBrand;
