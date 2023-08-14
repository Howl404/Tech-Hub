import React, { MouseEventHandler } from 'react';
import './header.scss';
import logoIcon from '../../assets/logo.svg';
import cartIcon from '../../assets/cart.svg';
import searchIcon from '../../assets/search.svg';

const buttonsData = [
  { name: 'home', label: 'home' },
  { name: 'catalog', label: 'catalog' },
  { name: 'about us', label: 'about us' },
];

function Header(): JSX.Element {
  const onToggleActiveSearch: MouseEventHandler<HTMLButtonElement> = (event): void => {
    const target = event.target as HTMLElement;
    target.parentElement?.classList.toggle('active');
    target.previousElementSibling?.classList.toggle('active');
  };

  const buttons = buttonsData.map(({ name, label }) => (
    <li className="nav__list_item item" key={name}>
      <button className="btn btn__home" type="button" onClick={(): void => {}} key={name}>
        {label}
      </button>
    </li>
  ));

  return (
    <header className="header">
      <div className="container">
        <a className="header__logo" href="/">
          <div className="header_logo-container">
            <img src={logoIcon} alt="logo" />
          </div>
        </a>

        <div className="burger-menu" />

        <nav className="nav">
          <ul className="nav__list list">{buttons}</ul>
        </nav>

        <div className="header__search">
          <input type="search" className="search-box" />
          <button type="button" className="header__search_icon" onClick={onToggleActiveSearch}>
            <img src={searchIcon} alt="search icon" />
            <div className="search__title">search</div>
          </button>
        </div>

        <div className="header__account-info">
          <button type="button" className="header__account-in">
            SIGN IN
          </button>
          <button type="button" className="header__account-create">
            CREATE ACCOUNT
          </button>
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
      </div>
    </header>
  );
}

export default Header;
