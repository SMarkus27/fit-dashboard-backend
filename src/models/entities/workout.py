from decimal import Decimal

from sqlalchemy import Enum, INTEGER, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from src.models.enums.exercises import Exercises
from src.models.mixins.base import BaseMixin


class Workout(BaseMixin):
    __tablename__ = "workouts"

    name: Mapped[str] = mapped_column(
        Enum(Exercises),
        nullable=False,
        comment="The type of the exercise",
    )
    reps: Mapped[int] = mapped_column(
        INTEGER,
        nullable=False,
        comment="The reps of the exercise",

    )
    weight: Mapped[Decimal] = mapped_column(
        Numeric(10,2),
        nullable=False,
        comment="The weight of the exercise",
    )