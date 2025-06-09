from fastapi import APIRouter, Depends
from typing import List

import oauth2
from dependencies import check_access_token
from . import schemas, services


request_router = APIRouter(
    prefix="/api/requests",
    tags=["requests"],
    dependencies=[Depends(check_access_token)],
    responses={401: {}}
)


@request_router.get("/requests-list", response_model=List[schemas.Request])
async def get_requests_list(Authorize: oauth2.AuthJWT = Depends()):
    return await services.get_requests_list(Authorize)
