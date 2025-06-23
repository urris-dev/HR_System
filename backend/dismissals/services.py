from datetime import date
from fastapi.responses import Response
from typing import List

import oauth2
from . import models, schemas
from users.models import User


async def get_dismissals_list(filters: schemas.Filter, Authorize: oauth2.AuthJWT) -> List[schemas.Dismissal]:
    email = Authorize.get_jwt_subject()
    user = await User.objects.get(email=email)

    if user.access_level != "Пользователь":
        dismissals = models.Dismissal.objects.select_related(["factory_id", "responsible_id"])
    else:
        dismissals = models.Dismissal.objects.select_related(["factory_id", "responsible_id"]).filter(factory_id=user.factory_id)

    if "factory_name" in filters.filterable_fields:
        dismissals = dismissals.filter(factory_id__name=filters.factory_name)

    if "criticality" in filters.filterable_fields:
        dismissals = dismissals.filter(criticality=filters.criticality)

    if "position" in filters.filterable_fields:
        dismissals = dismissals.filter(position__icontains=filters.position)

    return await dismissals.all()


async def create_dismissal(dismissal: schemas.DismissalCreate, Authorize: oauth2.AuthJWT) -> Response:
    email = Authorize.get_jwt_subject()
    user = await User.objects.select_related("factory_id").get(email=email)

    params = {"creation_date": date.today(), "editing_date": date.today(), 
              "creator_id": user.id, "editor_id": user.id}

    if dismissal.factory_id == 0:
        dismissal.factory_id = user.factory_id.id

    await models.Dismissal.objects.create(**dismissal.model_dump(), **params)
    return Response(status_code=200)


async def edit_dismissal(dismissal: schemas.DismissalEdit, Authorize: oauth2.AuthJWT) -> Response:
    email = Authorize.get_jwt_subject()
    user = await User.objects.get(email=email)
    _dismissal = await models.Dismissal.objects.get(id=dismissal.id)
    
    for field in dismissal.changed_fields:
        _dismissal.__setattr__(field, dismissal.__getattribute__(field))
    
    _dismissal.editing_date = date.today()
    _dismissal.editor_id = user.id
    dismissal.changed_fields.add("editing_date")
    dismissal.changed_fields.add("editor_id")

    await _dismissal.update(dismissal.changed_fields)
    return Response(status_code=200)
