from datetime import date
from fastapi.responses import Response
from typing import List

import oauth2
from . import models, schemas
from users.models import User


async def get_requests_list(filters: schemas.Filter, Authorize: oauth2.AuthJWT) -> List[schemas.Request]:
    email = Authorize.get_jwt_subject()
    user = await User.objects.get(email=email)

    if user.access_level != "Пользователь":
        requests = models.Request.objects.select_related(["factory_id", "responsible_id"])
    else:
        requests = models.Request.objects.select_related(["factory_id", "responsible_id"]).filter(factory_id=user.factory_id)

    if "factory_name" in filters.filterable_fields:
        requests = requests.filter(factory_id__name=filters.factory_name)

    if "criticality" in filters.filterable_fields:
        requests = requests.filter(criticality=filters.criticality)

    if "status" in filters.filterable_fields:
        requests = requests.filter(status=filters.status)
    
    if "position" in filters.filterable_fields:
        requests = requests.filter(position__icontains=filters.position)

    return await requests.all()

    
async def create_request(request: schemas.RequestCreate, Authorize: oauth2.AuthJWT) -> Response:
    email = Authorize.get_jwt_subject()
    user = await User.objects.select_related("factory_id").get(email=email)

    params = {"creation_date": date.today(), "editing_date": date.today(),
              "creator_id": user.id, "editor_id": user.id, "status": "Открыта"}

    if request.factory_id == 0:
        request.factory_id = user.factory_id.id

    await models.Request.objects.create(**request.model_dump(), **params)
    return Response(status_code=200)


async def edit_request(request: schemas.RequestEdit, Authorize: oauth2.AuthJWT) -> Response:
    email = Authorize.get_jwt_subject()
    user = await User.objects.get(email=email)
    _request = await models.Request.objects.get(id=request.id)
    
    for field in request.changed_fields:
        _request.__setattr__(field, request.__getattribute__(field))
    
    if "closing_type" in request.changed_fields:
        _request.closing_date = date.today()
        request.changed_fields.append("closing_date")
    
    _request.editing_date = date.today()
    _request.editor_id = user.id
    request.changed_fields.extend(["editing_date", "editor_id"])

    await _request.update(request.changed_fields)
    return Response(status_code=200)
