function NavBarMenu({ burgerIsOpen, onBurgerToggle }) {
  return (
    <div
      id="navbarBasicExample"
      className={`navbar-menu${burgerIsOpen ? " is-active" : ""}`}
      onClick={onBurgerToggle}
    >
      <div className="navbar-start">
        <a href="#" className="navbar-item">
          Our toons
        </a>

        <div className="navbar-item has-dropdown is-hoverable">
          <a href="#" className="navbar-link">
            My toons
          </a>

          <div className="navbar-dropdown">
            <a href="#" className="navbar-item">
              Mel
            </a>
            <a href="#" className="navbar-item">
              Jhit
            </a>
            <hr className="navbar-divider" />
            <a href="#" className="navbar-item">
              Create a new toon
            </a>
          </div>
        </div>
      </div>

      <div className="navbar-end">
        <div className="navbar-item">
          <div className="buttons">
            <a href="#" className="button is-primary">
              <strong>Sign up</strong>
            </a>
            <a href="#" className="button is-light">
              Log in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
export default NavBarMenu;
