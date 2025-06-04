from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"])


async def hash_data(data: str) -> str:
    return pwd_context.hash(data)


async def verify_data(data: str, hashed_data: str) -> bool:
    return pwd_context.verify(data, hashed_data)
