import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from './firebase';
import { db } from './firebase';
import { doc, setDoc } from "firebase/firestore";
import Swal from 'sweetalert2';

const Cart = ({ cart, setCart }) => {

  // Load cart data from localStorage only if not already set
  useEffect(() => {
    if (cart.length === 0) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, [cart, setCart]);

  // Save cart data to localStorage whenever cart changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const handleBuyNow = async (product) => {
    const user = auth.currentUser;

    if (user) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to buy ${product.title} for ${product.price} ₹?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Buy Now!',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        try {
          await setDoc(doc(db, "purchases", `${user.uid}-${new Date().getTime()}`), {
            productId: product.id,
            title: product.title,
            price: product.price,
            email: user.email,
            purchaseDate: new Date().toISOString(),
          });

          Swal.fire({
            icon: 'success',
            title: 'Purchase Successful!',
            text: 'Your order has been placed.',
          });

          const updatedCart = cart.filter(item => item.id !== product.id);
          setCart(updatedCart);
          localStorage.setItem('cart', JSON.stringify(updatedCart));

        } catch (error) {
          console.error("Error making purchase: ", error);
          Swal.fire({
            icon: 'error',
            title: 'Purchase Failed',
            text: 'Something went wrong while processing your purchase.',
          });
        }
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Please Log In',
        text: 'You must be logged in to make a purchase.',
      });
    }
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <>
      <div className="container my-5" style={{ width: "54%" }}>
        {cart.length === 0 ? (
          <div className='text-center'>
            <h1>Your Cart is Empty</h1>
            <Link to={"/"} className='btn btn-warning'>Continue Shopping...</Link>
          </div>
        ) : (
          cart.map((product) => (
            <div key={product.id} className="card mb-3 my-5" style={{ width: '700px' }}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img src={product.imgSrc} className="img-fluid rounded-start" alt="..." />
                </div>
                <div className="col-md-8">
                  <div className="card-body text-center">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text">{product.description}</p>
                    <div className="d-flex justify-content-center align-items-center mt-3">
                      <button className="btn btn-primary mx-2">
                        {product.price} ₹
                      </button>
                      <button
                        className="btn btn-warning mx-2"
                        onClick={() => handleBuyNow(product)}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length !== 0 && (
        <div className="container text-center my-5" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <button onClick={handleClearCart} className='btn btn-danger'>Clear Cart</button>
        </div>
      )}
    </>
  );
}

export default Cart;
