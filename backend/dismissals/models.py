import ormar
from database import base_ormar_config
from datetime import date
from typing import Optional

from factories.models import Factory
from users.models import User

class Dismissal(ormar.Model):
    ormar_config = base_ormar_config.copy(tablename='dismissals')

    id: int = ormar.BigInteger(primary_key=True)
    creation_date: date = ormar.Date(nullable=False)
    editing_date: date = ormar.Date(nullable=False)
    dismissal_date: date = ormar.Date(nullable=False)
    employee_fio: str = ormar.String(nullable=False, max_length=100)
    department: str = ormar.String(nullable=False, max_length=255)
    position: str = ormar.String(nullable=False, max_length=100)
    criticality: bool = ormar.Boolean(nullable=False)
    hiring_form: str = ormar.String(nullable=False, max_length=100)
    dismissal_reason: str = ormar.String(nullable=False, max_length=100)

    comment: Optional[str] = ormar.String(nullable=True, max_length=200)

    factory_id: int = ormar.ForeignKey(Factory, onupdate=ormar.ReferentialAction.CASCADE)
    creator_id: int = ormar.ForeignKey(User, onupdate=ormar.ReferentialAction.CASCADE, related_name="own_dismissals")
    responsible_id: int = ormar.ForeignKey(User, onupdate=ormar.ReferentialAction.CASCADE, related_name="resp_dismissals")
    editor_id: int = ormar.ForeignKey(User, onupdate=ormar.ReferentialAction.CASCADE, related_name="editable_dismissals")

    @property
    def factory_name(self) -> str:
        return self.factory_id.name
    
    @property
    def responsible_name(self) -> str:
        return self.responsible_id.fio
