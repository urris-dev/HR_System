from datetime import date
from pydantic import BaseModel
from typing import Optional


class Request(BaseModel):
    id: int
    position: str
    criticality: bool
    status: str
    employee_fio: Optional[str]
    closing_date: Optional[date]
    closing_type: Optional[str]
    comment: Optional[str]
    factory_name: str
    responsible_name: str
    