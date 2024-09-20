import strawberry
from typing import List, Optional
from strawberry.types import Info
from .models import Book
from .types import BookType
from datetime import date
from django.db.models import F


@strawberry.type
class Query:
    @strawberry.field
    def all_books(self, info: Info) -> List[BookType]:
        """Fetch all available books."""
        return Book.objects.all()

    @strawberry.field
    def get_book(self, info: Info, book_id: int) -> Optional[BookType]:
        """Fetch a book by its id."""
        return Book.objects.get(id=book_id)


@strawberry.type
class Mutation:
    @strawberry.mutation
    def add_book(
        self,
        info: Info,
        title: str,
        author: str,
        isbn: str,
        publication_year: int,
        stock: int,
        rent_fee: float,
    ) -> BookType:
        """Add a new book to the library."""
        new_book = Book.objects.create(
            title=title,
            author=author,
            isbn=isbn,
            publication_year=publication_year,
            stock=stock,
            rent_fee=rent_fee,
        )
        return new_book


schema = strawberry.Schema(query=Query, mutation=Mutation)
