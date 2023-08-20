import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import decode from "jwt-decode";

import logo from "../../assets/logo.png";
import search from "../../assets/search-solid.svg";
import Avatar from "../../components/Avatar/Avatar";
import "./Navbar.css";
import { setCurrentUser } from "../../actions/currentUser";
import bars from "../../assets/bars-solid.svg";
import { uploadToCloudinary } from "../../api";

const Navbar = ({ handleSlideIn }) => {
  const dispatch = useDispatch();
  var User = useSelector((state) => state.currentUserReducer);

  const navigate = useNavigate();
  const [isOpen,setIsOpen] =useState(false);
  const [file,setFile]= useState("");
  let profilePicUrl = "https://res.cloudinary.com/dtblj84n0/image/upload/v1684576903/bdvjeba45jhmts0oqnqy.png";
  // console.log(User.result.profilePic);
  // const profilePicUrl = User.result.profilePic;
  if(User)
  {
    profilePicUrl = User.result.profilePic;
  }
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
    dispatch(setCurrentUser(null));
  };

  useEffect(() => {
    const token = User?.token;
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        handleLogout();
      }
    }
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));
  }, [User?.token, dispatch]);

  const handleInputSubmit = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload =async (event) => {
        const base64String = event.target.result;
        const res=await uploadToCloudinary(base64String);
        console.log(res?.data)
      };
  
      reader.readAsDataURL(file);
    }
  };
  

  return (
    <nav className="main-nav">
      <div className="navbar">
        <button className="slide-in-icon" onClick={() => handleSlideIn()}>
          <img src={bars} alt="bars" width="15" />
        </button>
        <div className="navbar-1">
          <Link to="/" className="nav-item nav-logo">
            <img src={logo} alt="logo" />
          </Link>
          <div className="nav-item-containtor">
            <div className="nav-items">
              <Link to="/" className="nav-item nav-btn res-nav">
                About
              </Link>
              <Link to="/" className="nav-item nav-btn res-nav">
                Products
              </Link>
              <Link to="/" className="nav-item nav-btn res-nav">
                Teams
              </Link>

            </div>
          </div>
          <form className="search-form">
            <input type="text" placeholder="Search..." />
            <img src={search} alt="search" width="18" className="search-icon" />
          </form>
        </div>
        <div>
          <img 
            src={file ? URL.createObjectURL(file) : profilePicUrl}
          className="navbar-avatar" height={36} width={36} alt="avatar" onClick={()=>setIsOpen(!isOpen)} />
        </div>
          {isOpen && (
            <div  className="modal">
              <div className="modal-content">
                <label htmlFor="courseImage" class="label">
                 User Avatar
                </label>
                <div className="input-container">
                  <input
                  onChange={(e)=>setFile(e.target.files[0])}
                    className="custom-input"
                    type="file"
                    name="courseImage"
                    id="courseImage"
                    // value={file}
                  />
                </div>
                <button onClick={(e) => handleInputSubmit(e)} class="submit-button" type="submit">
        Submit
      </button>
              </div>
            </div>          
          )
        }
        <div className="navbar-2">
          {User === null ? (
            <Link to="/Auth" className="nav-item nav-links">
              Log in
            </Link>
          ) : (
            <>
              <Avatar
                backgroundColor="#009dff"
                px="15px"
                py="7px"
                borderRadius="15%"
                color="white"
                margin="2px"
              >
                <Link
                  to={`/Users/${User?.result?._id}`}
                  style={{ color: "white", textDecoration: "none" }}
                >
                  {User.result.name.charAt(0).toUpperCase()}
                </Link>
              </Avatar>
              <button className="nav-item nav-links" onClick={handleLogout}>
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
