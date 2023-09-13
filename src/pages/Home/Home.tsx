import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DiscountCode } from '@src/interfaces/Discount';
import { getDiscountCodes } from '@src/services/DiscountService/DiscountService';
import './Home.scss';

export default function Home(): JSX.Element {
  const [discountCodes, setdiscountCodes] = useState<DiscountCode[]>();

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const dataDiscountCodes = await getDiscountCodes();
      if (dataDiscountCodes) {
        setdiscountCodes(dataDiscountCodes);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="main-heading">Home</h2>
      <div className="promo-codes">
        <h3>PROMO CODES</h3>
        <div className="promo-codes_list">
          <ul>
            {discountCodes?.map((discountCode: DiscountCode) => (
              <li key={discountCode.code}>
                <strong>{discountCode.code}</strong> - {discountCode.description.en}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="wrapper-btn">
        <Link to="/login">
          <button type="button" className="btn btn-enabled">
            Login
          </button>
        </Link>
        <Link to="/register">
          <button type="button" className="btn btn-enabled mg-0">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
}
