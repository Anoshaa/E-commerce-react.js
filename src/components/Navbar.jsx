import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { items } from "./Data";
import { BsFillCartCheckFill } from "react-icons/bs";
import { auth } from "./firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import Swal from "sweetalert2";

const Navbar = ({ setData, cart }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(""); // State to store profile picture

  useEffect(() => {
    // Listen to authentication state changes (for automatic login)
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        // If the user has a photoURL (from Google or another provider), use that
        if (user.photoURL) {
          setProfilePicture(user.photoURL);
        } else {
          // If no photoURL, set a default image for email/password logins
          setProfilePicture("https://www.example.com/default-profile-picture.png");
        }
      } else {
        setProfilePicture(""); // Reset if user logs out
      }
    });
    return () => unsubscribe();
  }, []);

  const filterByCategory = (category) => {
    const element = items.filter((product) => product.category === category);
    setData(element);
  };

  const filterByPrice = (price) => {
    const element = items.filter((product) => product.price >= price);
    setData(element);
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      Swal.fire({
        icon: 'success',
        title: 'Google Login successful!',
        showConfirmButton: false,
        timer: 1500
      });

      setUser(user);
      // Set profile picture from Google login (it provides a photoURL)
      setProfilePicture(user.photoURL);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: `Google Login failed: ${error.message}`,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Swal.fire({
        icon: 'success',
        title: 'Logged out successfully!',
        showConfirmButton: false,
        timer: 1500
      });
      setUser(null);
      setProfilePicture(""); // Reset profile picture
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: `Logout failed: ${error.message}`,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search/${searchTerm}`);
    setSearchTerm("");
  };

  return (
    <>
      <header className="sticky-top">
        <div className="nav-bar">
          <Link to={"/"} className="brand">
            E-Cart
          </Link>

          <form onSubmit={handleSubmit} className="search-bar">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Search Products"
            />
          </form>

          <div className="actions">
            <Link to={"/cart"} className="cart">
              <button type="button" className="btn btn-primary position-relative">
                <BsFillCartCheckFill style={{ fontSize: "1.5rem" }} />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cart.length}
                  <span className="visually-hidden">unread messages</span>
                </span>
              </button>
            </Link>

            {/* Show profile picture if user is logged in */}
            {user && (
              <div className="profile-img-container">
                <img
                  src={profilePicture || "https://www.example.com/default-profile-picture.png"} // Fallback to default if no photoURL
                  alt="User Profile"
                  className="user-profile-img"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', marginLeft: '10px' }}
                />
              </div>
            )}

            {!user ? (
              <>
                <button
                  type="button"
                  className="btn btn-primary mx-2"
                  onClick={handleGoogleSignIn}
                >
                  Sign In with Google
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-danger mx-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {location.pathname === "/" && (
          <div className="nav-bar-wrapper">
            <div className="items">Filter by {"->"}</div>
            <div onClick={() => setData(items)} className="items">
              No Filter
            </div>
            <div
              onClick={() => filterByCategory("mobiles")}
              className="items"
            >
              Mobiles
            </div>
            <div
              onClick={() => filterByCategory("laptops")}
              className="items"
            >
              Laptops
            </div>
            <div
              onClick={() => filterByCategory("tablets")}
              className="items"
            >
              Tablets
            </div>
            <div
              onClick={() => filterByPrice(29999)}
              className="items"
            >
              {">="}29999
            </div>
            <div
              onClick={() => filterByPrice(49999)}
              className="items"
            >
              {">="}49999
            </div>
            <div
              onClick={() => filterByPrice(69999)}
              className="items"
            >
              {">="}69999
            </div>
            <div
              onClick={() => filterByPrice(89999)}
              className="items"
            >
              {">="}89999
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
