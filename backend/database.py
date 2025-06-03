import databases
import ormar
import sqlalchemy

from config import settings


DATABASE_URL = settings.DB_PATH
ECHO = settings.ECHO

base_ormar_config = ormar.OrmarConfig(
    metadata=sqlalchemy.MetaData(),
    database=databases.Database(DATABASE_URL),
    engine=sqlalchemy.create_engine(DATABASE_URL, echo=ECHO)
)
