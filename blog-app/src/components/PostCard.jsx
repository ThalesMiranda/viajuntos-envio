import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../css/PostCard.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons"; // Ícone de coração
import CommentSection from "./CommentSection";
import Button from "./Button";

const PostCard = ({
  id,
  title,
  content,
  username,
  image,
  likes, // Recebe o valor de likes do componente pai
  onLike,
  loggedInUsername,
}) => {
  const [showComments, setShowComments] = useState(false);
  const toggleComments = () => setShowComments(!showComments);
  const [currentLikes, setCurrentLikes] = useState(likes); // Armazena as curtidas localmente

  // Atualiza o estado local de curtidas quando o número de curtidas for alterado
  useEffect(() => {
    setCurrentLikes(likes); // Atualiza as curtidas sempre que a prop likes mudar
  }, [likes]);

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/like_post/${id}`
      );
      const updatedLikes = response.data.likes;
      setCurrentLikes(updatedLikes); // Atualiza as curtidas localmente
      onLike(id, updatedLikes); // Atualiza as curtidas no componente pai
    } catch (error) {
      console.error("Erro ao curtir o post", error);
    }
  };

  return (
    <div className="post-card">
      <h3 className="post-title">{title}</h3>
      <p className="post-content">{content}</p>
      <div className="like_content">
        <FontAwesomeIcon
          icon={faHeart}
          className="like-icon"
          onClick={handleLike}
        />
        <p className="post-likes">{currentLikes}</p>{" "}
        {/* Exibe as curtidas corretamente */}
      </div>
      <Button onClick={toggleComments}>
        {showComments ? "Ocultar Comentários" : "Ver Comentários"}
      </Button>

      {showComments && (
        <CommentSection postId={id} loggedInUsername={loggedInUsername} />
      )}
      <small className="post-author">By {username}</small>
    </div>
  );
};

PostCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  likes: PropTypes.number, // Permite likes ser passado como prop
  image: PropTypes.string,
  onLike: PropTypes.func.isRequired,
};

export default PostCard;
