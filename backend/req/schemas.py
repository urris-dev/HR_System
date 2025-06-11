from datetime import date
from pydantic import BaseModel, Field
from typing import Annotated, Optional, List


class Request(BaseModel):
    id: int
    position: str
    criticality: bool
    status: str
    employee_fio: Optional[str]
    creation_date: date
    closing_date: Optional[date]
    closing_type: Optional[str]
    comment: Optional[str]
    factory_name: str
    department: str
    responsible_name: str
    
    class Config:
        json_encoders = {
            date: lambda d: d.strftime('%d.%m.%Y')
        }


class RequestCreate(BaseModel):
    position: Annotated[str, Field(max_length=100)]
    criticality: bool
    department: Annotated[str, Field(max_length=255)]
    factory_name: Optional[str] = ""
    responsible_id: int
    comment: Annotated[Optional[str], Field(max_length=200)] = ""


class RequestEdit(BaseModel):
    id: int
    position: Annotated[Optional[str], Field(max_length=100)] = ""
    criticality: Optional[bool] = ""
    status: Annotated[Optional[str], Field(max_length=20)] = ""
    department: Annotated[Optional[str], Field(max_length=255)] = ""
    employee_fio: Annotated[Optional[str], Field(max_length=100)] = ""
    closing_type: Annotated[Optional[str], Field(max_length=20)] = ""
    comment: Annotated[Optional[str], Field(max_length=200)] = ""
    factory_name: Optional[str] = ""
    responsible_id: Optional[int] = 0
    changed_fields: List[str]
