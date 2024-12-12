import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import FormFrame from "../components/FormFrame";
import Logo from "../imagens/Logo_Viajuntos.png";
import Input from "../components/Input";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";
import "../css/home.css";

const Home = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/home", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
        setPosts(response.data.posts);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          navigate("/login");
        }
      });
  }, [navigate]);

  const [image, setImage] = useState(null);

  const handleCreatePost = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post(
        "http://localhost:5000/create_post",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert(response.data.message);
      setTitle("");
      setContent("");
      setImage(null);
      fetchPosts();
    } catch (error) {
      console.error("Error creating post", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/home", {
        withCredentials: true,
      });
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };
  const handlePostLike = (postId, updatedLikes) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: updatedLikes } : post
      )
    );
  };

  return (
    <>
      <Navbar />
      <FormFrame>
        {user && (
          <div>
            <div className="teste">
              <h3>Crie um Post</h3>
              <Input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Conteúdo"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <Button onClick={handleCreatePost}>Criar Post</Button>
            </div>

            <div>
              <h3>Posts Recentes:</h3>
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <PostCard
                    id={post.id}
                    key={index}
                    title={post.title}
                    content={post.content}
                    username={post.username}
                    likes={post.likes}
                    onLike={handlePostLike}
                    loggedInUsername={user?.username}
                  />
                ))
              ) : (
                <p>Nenhum post encontrado.</p>
              )}
            </div>
          </div>
        )}
      </FormFrame>
    </>
  );
};

export default Home;
