import ormar
from database import base_ormar_config


class Factory(ormar.Model):
    ormar_config = base_ormar_config.copy(tablename='factories')

    id: int = ormar.Integer(primary_key=True)
    name: str = ormar.String(nullable=False, max_length=20)
    production_rate: int = ormar.Integer(nullable=False)
    