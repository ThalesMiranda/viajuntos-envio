from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from flask_session import Session
from datetime import datetime
import os
from werkzeug.utils import secure_filename
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SESSION_TYPE'] = 'filesystem'  
Session(app)

CORS(app, supports_credentials=True) 
db = SQLAlchemy(app)

# Modelos
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f"<User {self.username}>"
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    username = db.Column(db.String(120), nullable=False)
    image = db.Column(db.String(200), nullable=True) 
    likes = db.Column(db.Integer, default=0)
    comments = db.relationship('Comment', backref='post', lazy=True)
    def __repr__(self):
        return f"<Post {self.title}>"
    
class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    username = db.Column(db.String(120), nullable=False) 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Comment {self.content}>" 
    
@app.route('/create_post', methods=['POST'])
def create_post():
    if 'user_id' not in session:
        return jsonify({'message': 'User not logged in'}), 401
    title = request.form.get('title')
    content = request.form.get('content')

    if not title or not content:
        return jsonify({'message': 'Title and content are required!'}), 400
    
    user = User.query.get(session['user_id'])
    new_post = Post(title=title, content=content, user_id=user.id, username=user.username)
    db.session.add(new_post)
    db.session.commit()

    return jsonify({'message': 'Post created successfully!'}), 201


@app.route('/add_comment', methods=['POST'])
def add_comment():
    data = request.get_json()
    post_id = data.get("post_id")
    content = data.get("content")
    username = data.get("username")

    if not post_id or not content or not username:
        return jsonify({"error": "Dados incompletos"}), 400

    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post não encontrado"}), 404

    comment = Comment(content=content, post_id=post_id, username=username)
    db.session.add(comment)
    db.session.commit()
    return jsonify({"message": "Comentário adicionado com sucesso"})

@app.route('/get_comments/<int:post_id>', methods=['GET'])
def get_comments(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post não encontrado"}), 404

    comments = Comment.query.filter_by(post_id=post_id).order_by(Comment.created_at).all()
    comments_data = [
        {"id": comment.id, "content": comment.content, "username": comment.username, "created_at": comment.created_at}
        for comment in comments
    ]
    return jsonify(comments_data)

@app.route('/like_post/<int:post_id>', methods=['POST'])
def like_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post não encontrado"}), 404
    
    post.likes += 1
    db.session.commit()
    return jsonify({"message": "Post curtido com sucesso", "likes": post.likes})

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = generate_password_hash(data['password'], method='pbkdf2:sha256')

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists!'}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists!'}), 400

    new_user = User(username=username, email=email, password=password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully!'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid credentials!'}), 401

    session['user_id'] = user.id
    return jsonify({'message': 'Login successful!', 'user': {'username': user.username, 'email': user.email}}), 200

@app.route('/home', methods=['GET'])
def home():
    if 'user_id' not in session:
        return jsonify({'message': 'User not logged in'}), 401

    user = User.query.get(session['user_id'])
    posts = Post.query.all()
    posts_data = [{
        "id": post.id,
        'title': post.title,
        'content': post.content,
        'username': post.username,
         "likes": post.likes,
        'image': f"http://localhost:5000/uploads/{post.image}" if post.image else None
    } for post in posts]
    print(posts_data)

    return jsonify({
        'user': {'username': user.username, 'email': user.email},
        'posts': posts_data
    })


@app.route('/perfil', methods=['GET'])
def profile():
    if 'user_id' not in session:
        return jsonify({'message': 'User not logged in'}), 401

    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({'message': 'User not found!'}), 404

    user_posts = Post.query.filter_by(user_id=user.id).all()
    posts_data = []
    for post in user_posts:
        comments = Comment.query.filter_by(post_id=post.id).all()
        comments_data = [{"content": comment.content, "username": comment.username, "created_at": comment.created_at} for comment in comments]
        
        posts_data.append({
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "username": post.username,
            "comments": comments_data
        })

    return jsonify({
        'user': {'username': user.username, 'email': user.email},
        'posts': posts_data
    })


@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out successfully!'}), 200
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)



