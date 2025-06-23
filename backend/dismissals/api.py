from fastapi import APIRouter, Depends
from typing import List

import oauth2
from dependencies import check_access_token
from . import schemas, services


dismissal_router = APIRouter(
    prefix="/api/dismissals",
    tags=["dismissals"],
    dependencies=[Depends(check_access_token)],
    responses={401: {}}
)


@dismissal_router.post("/dismissals-list", response_model=List[schemas.Dismissal])
async def get_dismissals_list(filters: schemas.Filter, Authorize: oauth2.AuthJWT = Depends()):
    return await services.get_dismissals_list(filters, Authorize)


@dismissal_router.post("/create-dismissal")
async def create_dismissal(dismissal: schemas.DismissalCreate, Authorize: oauth2.AuthJWT = Depends()):
    return await services.create_dismissal(dismissal, Authorize)


@dismissal_router.patch("/edit-dismissal")
async def edit_dismissal(dismissal: schemas.DismissalEdit, Authorize: oauth2.AuthJWT = Depends()):
    return await services.edit_dismissal(dismissal, Authorize)
