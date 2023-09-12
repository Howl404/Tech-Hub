import React, { Dispatch, SetStateAction, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductPage.scss';

import { ProductDetailedPage } from '@src/interfaces/Product';
import { getProductByKey } from '@src/services/ProductsService/ProductsService';

// Import Swiper and styles
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { Navigation, Controller } from 'swiper/modules';
import ClipLoader from 'react-spinners/ClipLoader';

import cartAdd from '@assets/cart-plus-solid.svg';
import cartRemove from '@assets/cart-shopping-solid.svg';
import addItemCart from '@src/utilities/addItemCart';
import removeItemCart from '@src/utilities/removeItemCart';
import getFormattedCart from '@src/utilities/getFormattedCart';
import Cookies from 'js-cookie';
import { getNewToken } from '@src/services/AuthService/AuthService';
import { getCartById } from '@src/services/CartService/CartService';

function ProductPage({ setTotalSumInCart }: { setTotalSumInCart: Dispatch<SetStateAction<number>> }): JSX.Element {
  const { key = '' } = useParams<{
    key: string;
  }>();

  const [formData, setFormData] = useState({ key, count: 1, inBag: false, inFavorites: false });
  const [product, setProducts] = useState<ProductDetailedPage>();
  const [cartList, setCartList] = useState<{ id: string; productId: string }[]>([]);

  let CartProduct: {
    productId: string;
    id: string;
  } = {
    productId: '0',
    id: '0',
  };
  if (cartList.length > 0) {
    const foundProduct = cartList.find((item) => item.productId === product?.id);
    if (foundProduct) {
      CartProduct = foundProduct;
    }
  }

  const [addItemLoading, setAddItemLoading] = useState(false);
  const [removeItemLoading, setRemoveItemLoading] = useState(false);

  useEffect(() => {
    getProductByKey(formData.key).then((data) => {
      setProducts(data);
    });
  }, [formData.key]);

  const checkCartUpdateHeader = (): void => {
    const authType = Cookies.get('auth-type');
    const accessToken = Cookies.get('access-token');
    const anonToken = Cookies.get('anon-token');
    const anonRefreshToken = Cookies.get('anon-refresh-token');
    const cartId = Cookies.get('cart-id');
    if (cartId) {
      if (authType === 'password' && accessToken) {
        getCartById(accessToken, cartId).then((item) => {
          setTotalSumInCart(item.totalPrice.centAmount);
        });
      } else if (anonToken) {
        getCartById(anonToken, cartId).then((item) => {
          setTotalSumInCart(item.totalPrice.centAmount);
        });
      } else if (anonRefreshToken) {
        getNewToken(anonRefreshToken).then((item) => {
          Cookies.set('anon-token', item.accessToken, { expires: 2 });
          getCartById(item.accessToken, cartId).then((items) => setTotalSumInCart(items.totalPrice.centAmount));
        });
      }
    }
  };

  const handleAddToCart = async (productSku: string): Promise<void> => {
    const result = await addItemCart(productSku, formData.count);
    if (result) {
      setCartList(result);
    }
    checkCartUpdateHeader();
    return Promise.resolve();
  };

  const handleRemoveFromCart = async (productSku: string): Promise<void> => {
    const result = await removeItemCart(productSku);
    if (result) {
      setCartList(result);
    }
    return Promise.resolve();
  };

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const cart = await getFormattedCart();
      if (cart) {
        setCartList(cart);
      }
    }
    fetchData();
  }, []);

  const current = product?.masterData.current;

  const currency = current?.masterVariant.prices[0].value.currencyCode || '';
  const totalPrice = ((current?.masterVariant.prices[0].value.centAmount || 0) * formData.count) / 100;
  const totalPriceFormated = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'EUR' }).format(totalPrice);
  const discountedPrice = ((current?.masterVariant.prices[0].discounted?.value.centAmount || 0) * formData.count) / 100;
  const discountedPriceFormated = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'EUR' }).format(
    discountedPrice,
  );

  const description = current?.description.en;

  let brand = 'brand not found';
  const brandModel = current?.name.en;
  current?.masterVariant.attributes.forEach((attribute) => {
    if (attribute.name === 'brand') brand = attribute.value;
  });

  const clickUpCount = (): void => {
    let count = formData.count + 1;
    if (count > 100) count = 100;
    setFormData({ ...formData, count });
  };

  const clickDownCount = (): void => {
    let count = formData.count - 1;
    if (count <= 0) count = 1;
    setFormData({ ...formData, count });
  };

  const clickShowHideDetails = (event: React.MouseEvent<HTMLElement>): void => {
    const node = event.currentTarget as HTMLElement;
    const plusMinus = node?.children[1] as HTMLImageElement;
    const show = plusMinus.innerText === '+';
    plusMinus.innerHTML = show ? '-' : '+';

    const detailsNode = event.currentTarget.nextElementSibling as HTMLElement;
    detailsNode.style.display = show ? 'block' : 'none';
  };

  const showModalImg = (event: React.MouseEvent<HTMLElement>): void => {
    if (event.currentTarget !== event.target) return;
    const node = event.currentTarget as HTMLElement;
    node.style.display = 'none';
    document.body.classList.remove('modal-open');
  };

  const showModal = (): void => {
    const node = document.querySelector('.modal-view') as HTMLElement;
    node.style.display = 'block';
    document.body.classList.add('modal-open');
  };

  const swiper1Ref = useRef<SwiperClass>();
  const swiper2Ref = useRef<SwiperClass>();

  useLayoutEffect(() => {
    if (swiper1Ref.current && swiper2Ref.current) {
      swiper1Ref.current.controller.control = swiper2Ref.current;
      swiper2Ref.current.controller.control = swiper1Ref.current;
    }
  }, []);

  return (
    <>
      <main className="container">
        <div className="product">
          <div className="product__line first-line">
            <Swiper
              navigation
              loop
              modules={[Navigation, Controller]}
              className="mySwiper"
              onSwiper={(swiper): void => {
                swiper1Ref.current = swiper;
              }}
              onClick={(): void => showModal()}
            >
              {current?.masterVariant.images.map((img: { url: string }, index: number) => (
                <SwiperSlide key={img.url}>
                  <img src={img.url} alt={`${key}${index}`} />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="product__attributes">
              {/* <div className="path">
                <a className="path__category" href="/">
                  Home
                </a>
                <span>&nbsp;/&nbsp;</span>
                <a className="path__category" href="/">
                  notebook
                </a>
                <span>&nbsp;/&nbsp;</span>
                <a className="path__category" href="/">
                  apple
                </a>
              </div> */}

              <h3 className="product__brand">{brand}</h3>

              <h2 className="product__name">{brandModel}</h2>

              {/* <div className="product__color">
                <div className="product__attr-title">select color</div>
                <div className="product__color-items">
                  <div className="product__color-items-item color-black" />
                  <div className="product__color-items-item color-yellow active-color" />
                  <div className="product__color-items-item color-green" />
                </div>
              </div>

              <div className="product__select-size">
                <div className="product__attr-title">select size(inches)</div>
                <div className="product__select-size_items">
                  <div className="product__select-size-items_item active-size">14</div>
                  <div className="product__select-size-items_item">15</div>
                  <div className="product__select-size-items_item">16</div>
                </div>
              </div> */}

              <div className="product__quantity_price">
                <div className="product__quantity">
                  <div className="product__attr-title">quantity</div>
                  <div className="product__quantity-input">
                    <button
                      type="button"
                      className="product__quantity-btn"
                      onClick={(): void => clickDownCount()}
                      disabled={CartProduct.id !== '0'}
                    >
                      -
                    </button>
                    <span className="product__quantity-display">{formData.count}</span>
                    <button
                      type="button"
                      className="product__quantity-btn"
                      onClick={(): void => clickUpCount()}
                      disabled={CartProduct.id !== '0'}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="product__price">
                  <div className="product__attr-title">price total</div>
                  {discountedPrice > 0 ? (
                    <>
                      <span className="product__price-value discounted">{discountedPriceFormated}</span>
                      <span className="product__price-currency discounted">&nbsp;{currency}</span>
                      <br />
                      <span className="product__price-discounted">{totalPriceFormated}</span>
                      <span className="product__price-discounted">&nbsp;{currency}</span>
                    </>
                  ) : (
                    <>
                      <span className="product__price-value">{totalPriceFormated}</span>
                      <span className="product__price-currency">&nbsp;{currency}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="buttons-container">
                <button
                  type="button"
                  className="add-to-cart btn-enabled"
                  onClick={(): void => {
                    setAddItemLoading(true);
                    handleAddToCart(formData.key).then(() => {
                      setAddItemLoading(false);
                    });
                  }}
                  disabled={CartProduct.id !== '0'}
                >
                  {addItemLoading ? <ClipLoader /> : <img src={cartAdd} className="cart-add-img" alt="Add to cart" />}
                </button>
                <button
                  type="button"
                  className="remove-from-cart btn-enabled"
                  onClick={(): void => {
                    setRemoveItemLoading(true);
                    handleRemoveFromCart(CartProduct.id).then(() => {
                      setRemoveItemLoading(false);
                    });
                  }}
                  disabled={CartProduct.id === '0'}
                >
                  {removeItemLoading ? (
                    <ClipLoader />
                  ) : (
                    <img src={cartRemove} className="cart-remove-img" alt="Remove from cart" />
                  )}
                </button>
              </div>

              {/* <div className="product__controls">
                <button
                  type="button"
                  className="product__btn btn-black btn-bag"
                  onClick={(): void => setFormData({ ...formData, inBag: !formData.inBag })}
                >
                  {formData.inBag ? 'delete from bag' : 'add to bag'}
                </button>
                <button
                  type="button"
                  className="product__btn btn-white"
                  onClick={(): void => setFormData({ ...formData, inFavorites: !formData.inFavorites })}
                >
                  {formData.inFavorites ? 'delete from save' : 'save'}
                </button>
              </div> */}
            </div>
          </div>
          <div className="product__line">
            <div className="product__details">
              <div role="button" tabIndex={0} className="product__details-header" onClick={clickShowHideDetails}>
                <div className="product__details-left">Details</div>
                <div className="product__details-right">-</div>
              </div>

              <div className="product__details-block">
                <div className="product__details-title">about product</div>
                <div className="product__details-descriptions">{description}</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div role="button" tabIndex={0} className="modal-view" onClick={showModalImg}>
        <Swiper
          navigation
          loop
          modules={[Navigation, Controller]}
          className="swiper-modal"
          onSwiper={(swiper): void => {
            swiper2Ref.current = swiper;
          }}
        >
          {current?.masterVariant.images.map((img: { url: string }, index: number) => (
            <SwiperSlide key={img.url}>
              <img src={img.url} alt={`${key}${index}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}

export default ProductPage;
