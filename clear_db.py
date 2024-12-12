from app import app, db, User, Post

with app.app_context():
    # db.session.query(User).delete()
    db.session.query(Post).delete()
    db.session.commit()
    print("Database cleared!")
