from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

password = "password123"

hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

print(hashed_password)