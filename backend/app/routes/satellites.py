from fastapi import APIRouter
from sqlalchemy import text

from app.database.connection import engine


router = APIRouter(
    prefix="/satellites",
    tags=["Satellites"]
)


@router.get("/")
def get_satellites():

    query = text("""
        SELECT
            id,
            satellite_code,
            satellite_name,
            mission_type,
            launch_date,
            status,
            created_at
        FROM satellites
        ORDER BY id
    """)

    with engine.connect() as connection:
        result = connection.execute(query)
        records = result.mappings().all()

    return [dict(record) for record in records]