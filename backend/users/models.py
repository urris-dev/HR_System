import ormar
from database import base_ormar_config

from factories.models import Factory


class User(ormar.Model):
    ormar_config = base_ormar_config.copy(tablename='users')

    id: int = ormar.BigInteger(primary_key=True)
    fio: str = ormar.String(nullable=False, max_length=100)
    email: str = ormar.String(index=True, unique=True, nullable=False, max_length=256)
    password: str = ormar.String(nullable=False, max_length=60)
    access_level: str = ormar.String(nullable=False, max_length=20)
    status: bool = ormar.Boolean(nullable=False)
    factory_id: int = ormar.ForeignKey(Factory, onupdate=ormar.ReferentialAction.CASCADE)

    @property
    def factory_name(self) -> str:
        return self.factory_id.name if self.factory_id else ""
