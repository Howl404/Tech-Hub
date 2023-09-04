import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductPage.scss';
import { Product } from '@src/interfaces/Product';
import { getProductByKey } from '@src/services/ProductsService/ProductsService';

function ProductPage(): JSX.Element {
  const { key = '' } = useParams<{
    key: string;
  }>();

  const [formData, setFormData] = useState({ key, count: 1, inBag: false, inFavorites: false });
  const [product, setProducts] = useState<Product>();

  useEffect(() => {
    getProductByKey(formData.key).then((data) => {
      setProducts(data);
    });
  }, [formData.key]);

  const current = product?.masterData.current;

  const currency = current?.masterVariant.prices[0].value.currencyCode;
  const totalPrice = (current?.masterVariant.prices[0].value.centAmount || 0) * formData.count;

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

  const clickImg = (event: React.MouseEvent<HTMLElement>): void => {
    const { src } = event.target as HTMLImageElement;
    const node = (event.currentTarget.parentElement as HTMLElement).nextElementSibling;
    const tagImg = node?.children[0] as HTMLImageElement;
    if (tagImg) tagImg.src = src || '';
  };

  const clickShowHideDetails = (event: React.MouseEvent<HTMLElement>): void => {
    const node = event.currentTarget as HTMLElement;
    const plusMinus = node?.children[1] as HTMLImageElement;
    const show = plusMinus.innerText === '+';
    plusMinus.innerHTML = show ? '-' : '+';

    const detailsNode = event.currentTarget.nextElementSibling as HTMLElement;
    detailsNode.style.display = show ? 'block' : 'none';
  };

  return (
    <main className="container">
      <div className="product">
        <div className="product__line first-line">
          <div className="product__img-list">
            {current?.masterVariant.images.map((img: { url: string }, index: number) => (
              <div role="button" tabIndex={0} className="product__img-item" key={img.url} onClick={clickImg}>
                <img src={img.url} alt={`${key}${index}`} />
              </div>
            ))}
          </div>

          <div className="product__img-main">
            <img src={current?.masterVariant.images[0].url} alt="image1" />
          </div>

          <div className="product__attributes">
            <div className="path">
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
            </div>

            <h3 className="product__brand">{brand}</h3>

            <h2 className="product__name">{brandModel}</h2>

            <div className="product__color">
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
            </div>

            <div className="product__quantity_price">
              <div className="product__quantity">
                <div className="product__attr-title">quantity</div>
                <div className="product__quantity-input">
                  <button type="button" className="product__quantity-btn" onClick={(): void => clickDownCount()}>
                    -
                  </button>
                  <span className="product__quantity-display">{formData.count}</span>
                  <button type="button" className="product__quantity-btn" onClick={(): void => clickUpCount()}>
                    +
                  </button>
                </div>
              </div>

              <div className="product__price">
                <div className="product__attr-title">price total</div>
                <span className="product__price-value">{totalPrice}</span>
                <span className="product__price-currency">&nbsp;{currency}</span>
              </div>
            </div>

            <div className="product__controls">
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
            </div>
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
              <div className="product__details-descriptions">
                Cool off this summer in the Mini Ruffle Smocked Tank Top from our very own LA Hearts. This tank features
                a smocked body, adjustable straps, scoop neckline, ruffled hems, and a cropped fit.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductPage;
