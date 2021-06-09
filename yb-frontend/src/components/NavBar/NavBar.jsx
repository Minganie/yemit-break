import NavBarBrand from "./NavBarBrand";
import { useState } from "react";
import NavBarMenu from "./NavBarMenu";

function NavBar() {
  const [burgerIsOpen, setBurgerIsOpen] = useState(false);
  const handleBurgerToggle = () => {
    setBurgerIsOpen(!burgerIsOpen);
  };
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <NavBarBrand
        burgerIsOpen={burgerIsOpen}
        onBurgerToggle={handleBurgerToggle}
      />
      <NavBarMenu
        burgerIsOpen={burgerIsOpen}
        onBurgerToggle={handleBurgerToggle}
      />
    </nav>
  );
}

export default NavBar;
