from fastapi import APIRouter, Depends
from typing import List

from dependencies import check_access_token
from . import schemas, services


factory_router = APIRouter(
    prefix="/api/factories",
    tags=["factories"],
    dependencies=[Depends(check_access_token)],
    responses={401: {}}
)


@factory_router.get("/factories-list", response_model=List[schemas.Factory])
async def get_factories_list():
    return await services.get_factories_list()
