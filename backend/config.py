from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DB_PATH: str
    ECHO: bool

    # JWT_ALGORITHM: str
    # JWT_ACCESS_TOKEN_EXPIRES_IN: int
    # JWT_REFRESH_TOKEN_EXPIRES_IN: int
    # JWT_PUBLIC_KEY: str
    # JWT_PRIVATE_KEY: str

    # SMTP_HOST: str
    # SMTP_PORT: int
    # SMTP_USER: str
    # SMTP_APPLICATION_PASSWORD: str

    # CLIENT_ORIGIN: str
    # SERVER_ORIGIN: str

    # REGEX_PASSWORD_TEMPLATE: str

    class Config:
        env_file = "./.env"


settings = Settings()
