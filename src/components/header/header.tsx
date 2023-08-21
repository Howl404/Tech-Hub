import React, { MouseEventHandler, useState, MouseEvent } from 'react';
import './Header.scss';
import { Link } from 'react-router-dom';
import logoIcon from '@assets/logo.svg';
import cartIcon from '@assets/cart.svg';
import searchIcon from '@assets/search.svg';

const buttonsData = [
  { name: 'home', label: 'home', path: '/' },
  { name: 'catalog', label: 'catalog', path: '/catalog' },
  { name: 'about us', label: 'about us', path: '/about' },
];

function Header(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = (event: MouseEvent<HTMLElement>): void => {
    const eventTarget = event.target as HTMLElement;
    if (!eventTarget.className.includes('header__search') && !eventTarget.className.includes('search-box'))
      setIsOpen(!isOpen);
  };
  const onToggleActiveSearch: MouseEventHandler<HTMLButtonElement> = (event): void => {
    const target = event.target as HTMLElement;
    target.parentElement?.classList.toggle('active');
    target.previousElementSibling?.classList.toggle('active');
  };

  const buttons = buttonsData.map(({ name, label, path }) => (
    <li className="nav__list_item item" key={name}>
      <Link to={path}>
        <button className="btn btn__home" type="button" key={name}>
          {label}
        </button>
      </Link>
    </li>
  ));

  return (
    <header className="header">
      <div className="container">
        <Link to="/">
          <div className="header_logo-container">
            <img className="logo" src={logoIcon} alt="logo" />
          </div>
        </Link>

        <nav className={`nav ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <ul className="nav__list list">{buttons}</ul>

          <div className="header__search">
            <input type="search" className="search-box" />
            <button type="button" className="header__search_icon" onClick={onToggleActiveSearch}>
              <img src={searchIcon} alt="search icon" />
              <div className="search__title">search</div>
            </button>
          </div>

          <div className="header__account-info">
            <Link to="/login">
              <button type="button" className="header__account-in">
                LOG IN
              </button>
            </Link>
            <Link to="/register">
              <button type="button" className="header__account-create">
                REGISTER
              </button>
            </Link>
          </div>

          <div className="header__cart">
            <button type="button" className="header__cart_icon">
              <img src={cartIcon} alt="cart icon" />
            </button>
            <div className="cart__title_container">
              <div className="cart__title">Shopping Cart</div>
              <div className="cart__sell">{`${0}EUR`}</div>
            </div>
          </div>
        </nav>

        <button type="button" className={`header-burger${isOpen ? ' active' : ''}`} onClick={toggleMenu}>
          <span />
        </button>
      </div>
    </header>
  );
}

export default Header;
