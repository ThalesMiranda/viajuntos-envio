import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import FormFrame from "../components/FormFrame";
import PostCard from "../components/PostCard";
import Logo from "../imagens/Logo_Viajuntos.png";
import Navbar from "../components/Navbar";
import "../css/Perfil.css";
import ProfilePost from "../components/ProfilePost";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar os dados do usuário e posts do próprio usuário
    axios
      .get("http://localhost:5000/perfil", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
        setPosts(response.data.posts);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          navigate("/login");
        } else {
          console.error("Error fetching user profile", error);
        }
      });
  }, [navigate]);

  return (
    <>
      <Navbar />
      <FormFrame>
        {user && (
          <div>
            <h2>Perfil de {user.username}</h2>
            <h4>Email: {user.email}</h4>

            <div>
              <h3>Seus Posts:</h3>
              <div className="post-grid">
                {posts.length > 0 ? (
                  posts.map((post, index) => (
                    <ProfilePost
                      key={index}
                      title={post.title}
                      content={post.content}
                      username={post.username}
                      likes={post.likes}
                    />
                  ))
                ) : (
                  <p>Você ainda não criou nenhum post.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </FormFrame>
    </>
  );
};

export default Profile;
