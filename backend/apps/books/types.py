import strawberry_django
from strawberry import auto
from .models import Book


@strawberry_django.type(Book)
class BookType:
    id: auto
    title: str
    author: str
    isbn: str
    publication_year: int
    stock: int
    rent_fee: float
