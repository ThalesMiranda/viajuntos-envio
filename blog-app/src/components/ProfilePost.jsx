import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../css/PostCard.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import CommentSection from "./CommentSection";
import Button from "./Button";

const ProfilePost = ({ id, title, content, username }) => {
  return (
    <div className="post-card">
      <h3 className="post-title">{title}</h3>
      <p className="post-content">{content}</p>
      <small className="post-author">By {username}</small>
    </div>
  );
};

ProfilePost.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  likes: PropTypes.number,
  image: PropTypes.string,
  onLike: PropTypes.func.isRequired,
};

export default ProfilePost;
