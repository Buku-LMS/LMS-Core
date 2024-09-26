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

    @strawberry.mutation
    def update_book(
        self,
        info: Info,
        book_id: int,
        title: str = None,
        author: str = None,
        publication_year: int = None,
        stock: int = None,
        rent_fee: float = None,
    ) -> BookType:
        book = Book.objects.get(id=book_id)

        if title is not None:
            book.title = title
        if author is not None:
            book.author = author
        if publication_year is not None:
            book.publication_year = publication_year
        if stock is not None:
            book.stock = stock
        if rent_fee is not None:
            book.rent_fee = rent_fee
        book.save()
        return book


schema = strawberry.Schema(query=Query, mutation=Mutation)
