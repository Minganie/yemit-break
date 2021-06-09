import { Link } from "react-router-dom";

function NavBarMenu({ burgerIsOpen, onBurgerToggle }) {
  return (
    <div
      id="navbarBasicExample"
      className={`navbar-menu${burgerIsOpen ? " is-active" : ""}`}
      onClick={onBurgerToggle}
    >
      <div className="navbar-start">
        <Link to="/" className="navbar-item">
          Our toons
        </Link>

        <div className="navbar-item has-dropdown is-hoverable">
          <Link to="/sheets" className="navbar-link">
            My toons
          </Link>

          <div className="navbar-dropdown">
            <Link to="/sheets/1" className="navbar-item">
              Mel
            </Link>
            <Link to="/sheets/2" className="navbar-item">
              Jhit
            </Link>
            <hr className="navbar-divider" />
            <Link to="/sheets" className="navbar-item">
              Create a new toon
            </Link>
          </div>
        </div>
      </div>

      <div className="navbar-end">
        <div className="navbar-item">
          <div className="buttons">
            <Link to="/register" className="button is-primary">
              <strong>Sign up</strong>
            </Link>
            <Link to="/login" className="button is-light">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default NavBarMenu;
