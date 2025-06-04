from pydantic import BaseModel, Field, EmailStr, field_validator
from re import fullmatch
from typing import Annotated, Optional, List

from config import settings


class User(BaseModel):
    id: int
    fio: str
    email: str
    access_level: str
    status: bool
    factory_name: str


class UserCreate(BaseModel):
    fio: Annotated[str, Field(max_length=100)]
    email: Annotated[EmailStr, Field(max_length=256)]
    password: Annotated[str, Field(min_length=8, max_length=60)]
    access_level: Annotated[str, Field(max_length=20)]
    status: bool
    factory_name: Optional[str] = ""


class UserEdit(BaseModel):
    id: int
    fio: Annotated[Optional[str], Field(max_length=100)] = ""
    email: Annotated[Optional[EmailStr], Field(max_length=256)] = ""
    password: Annotated[Optional[str], Field(min_length=8, max_length=60)] = ""
    access_level: Annotated[Optional[str], Field(max_length=20)] = ""
    status: Optional[bool] = True 
    factory_name: Optional[str] = ""
    changed_fields: List[str]


class UserLogin(BaseModel):
    email: Annotated[EmailStr, Field(max_length=256)]
    password: Annotated[str, Field(min_length=8, max_length=60)]

    @field_validator("password", mode="before")
    def validate_pswd(cls, value):
        pattern = settings.REGEX_PASSWORD_TEMPLATE
        if not fullmatch(pattern, value):
            raise ValueError("Неверный формат пароля.")
        return value
