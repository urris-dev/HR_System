from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    ECHO: bool

    ADMIN_FIO: str
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str
    ADMIN_ACCESS_LEVEL: str
    ADMIN_STATUS: bool

    FACTORIES_NAMES: List[str]
    FACTORIES_PRODUCTION_RATE: List[int]

    JWT_ALGORITHM: str
    JWT_ACCESS_TOKEN_EXPIRES_IN: int
    JWT_REFRESH_TOKEN_EXPIRES_IN: int
    JWT_PUBLIC_KEY: str
    JWT_PRIVATE_KEY: str

    REGEX_PASSWORD_TEMPLATE: str

    class Config:
        env_file = "./.env"


settings = Settings()
