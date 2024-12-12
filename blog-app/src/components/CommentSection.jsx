import React, { useState, useEffect } from "react";
import axios from "axios";

const CommentSection = ({ postId, loggedInUsername }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/get_comments/${postId}`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Erro ao buscar comentários", error);
    }
  };

  const handleAddComment = async () => {
    try {
      const response = await axios.post("http://localhost:5000/add_comment", {
        post_id: postId,
        content: newComment,
        username: loggedInUsername, // Usa o username do usuário logado
      });
      setNewComment("");
      fetchComments(); // Atualiza a lista de comentários
    } catch (error) {
      console.error("Erro ao adicionar comentário", error);
    }
  };

  return (
    <div className="comment-section">
      <h4>Comentários</h4>
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <p>
            <strong>{comment.username}:</strong> {comment.content}
          </p>
        </div>
      ))}
      <textarea
        placeholder="Adicione um comentário"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button onClick={handleAddComment}>Comentar</button>
    </div>
  );
};

export default CommentSection;
