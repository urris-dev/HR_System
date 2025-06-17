import ormar
from database import base_ormar_config
from datetime import date
from typing import Optional

from factories.models import Factory
from users.models import User

class Request(ormar.Model):
    ormar_config = base_ormar_config.copy(tablename='requests')

    id: int = ormar.BigInteger(primary_key=True)
    creation_date: date = ormar.Date(nullable=False)
    editing_date: date = ormar.Date(nullable=False)
    position: str = ormar.String(nullable=False, max_length=100)
    criticality: bool = ormar.Boolean(nullable=False)
    status: str = ormar.String(nullable=False, max_length=20)
    department: str = ormar.String(nullable=False, max_length=255)

    hiring_form: Optional[str] = ormar.String(nullable=True, max_length=100)
    employee_fio: Optional[str] = ormar.String(nullable=True, max_length=100)
    closing_date: Optional[date] = ormar.Date(nullable=True)
    closing_type: Optional[str] = ormar.String(nullable=True, max_length=20)
    comment: Optional[str] = ormar.String(nullable=True, max_length=200)

    factory_id: int = ormar.ForeignKey(Factory, onupdate=ormar.ReferentialAction.CASCADE)
    creator_id: int = ormar.ForeignKey(User, onupdate=ormar.ReferentialAction.CASCADE, related_name="own_requests")
    responsible_id: int = ormar.ForeignKey(User, onupdate=ormar.ReferentialAction.CASCADE, related_name="resp_requests")
    editor_id: int = ormar.ForeignKey(User, onupdate=ormar.ReferentialAction.CASCADE, related_name="editable_requests")

    @property
    def factory_name(self) -> str:
        return self.factory_id.name
    
    @property
    def responsible_name(self) -> str:
        return self.responsible_id.fio
