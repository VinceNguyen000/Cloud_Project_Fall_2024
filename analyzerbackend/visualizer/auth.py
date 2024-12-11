import bcrypt

# Function to hash a password
def hash_password(password: str) -> str:
    # Generate a salt
    salt = bcrypt.gensalt()
    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode()

# Function to verify a password
def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode())

# Example usage
if __name__ == "__main__":
    # Input password
    password = "my_secure_password"

    # Hash the password
    hashed_password = hash_password(password)
    print("Hashed Password:", hashed_password)

    # Verify the password
    is_correct = verify_password("my_secure_password", hashed_password)
    print("Password is correct:", is_correct)

    # Verify with an incorrect password
    is_correct = verify_password("wrong_password", hashed_password)
    print("Password is correct:", is_correct)
