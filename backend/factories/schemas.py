from pydantic import BaseModel


class Factory(BaseModel):
    id: int
    name: str
