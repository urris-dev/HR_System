import base64
from fastapi_jwt_auth import AuthJWT
from pydantic_settings import BaseSettings
from typing import List

from config import settings


class Settings(BaseSettings):
    authjwt_algorithm: str = settings.JWT_ALGORITHM
    authjwt_decode_algorithms: List[str] = [settings.JWT_ALGORITHM]
    authjwt_token_location: set = {'cookies'}
    authjwt_access_cookie_key: str = 'access_token'
    authjwt_refresh_cookie_key: str = 'refresh_token'
    authjwt_cookie_csrf_protect: bool = False
    authjwt_public_key: str = base64.b64decode(
        settings.JWT_PUBLIC_KEY).decode('utf-8')
    authjwt_private_key: str = base64.b64decode(
        settings.JWT_PRIVATE_KEY).decode('utf-8')
    authjwt_cookie_domain: str = "localhost"
    

@AuthJWT.load_config
def get_config():
    return Settings()
