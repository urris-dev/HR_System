from datetime import date
from pydantic import BaseModel, Field
from typing import Annotated, Optional, Set


class Dismissal(BaseModel):
    id: int
    position: str
    criticality: bool
    hiring_form: str
    employee_fio: str
    creation_date: date
    dismissal_date: date
    dismissal_reason: str 
    factory_name: str
    department: str
    responsible_name: str
    comment: Optional[str]
    
    class Config:
        json_encoders = {
            date: lambda d: d.strftime('%d.%m.%Y')
        }


class DismissalCreate(BaseModel):
    position: Annotated[str, Field(max_length=100)]
    criticality: bool
    hiring_form: Annotated[str, Field(max_length=100)]
    employee_fio: Annotated[str, Field(max_length=100)]
    dismissal_date: date
    dismissal_reason: Annotated[str, Field(max_length=100)]
    factory_id: Optional[int] = 0
    department: Annotated[str, Field(max_length=255)]
    responsible_id: int
    comment: Optional[Annotated[str, Field(max_length=200)]] = ""


class DismissalEdit(BaseModel):
    id: int
    position: Annotated[Optional[str], Field(max_length=100)] = ""
    criticality: Optional[bool] = ""
    hiring_form: Annotated[Optional[str], Field(max_length=100)] = ""
    employee_fio: Annotated[Optional[str], Field(max_length=100)] = ""
    dismissal_date: Optional[date] = date.today()
    dismissal_reason: Optional[Annotated[str, Field(max_length=100)]] = ""
    factory_id: Optional[int] = 0
    department: Annotated[Optional[str], Field(max_length=255)] = ""
    responsible_id: Optional[int] = 0
    comment: Annotated[Optional[str], Field(max_length=200)] = ""
    changed_fields: Set[str]


class Filter(BaseModel):
    factory_name: Optional[str] = ""
    criticality: Optional[bool] = False
    position: Optional[str] = ""
    filterable_fields: Set[str]
