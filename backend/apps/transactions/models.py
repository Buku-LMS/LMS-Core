from django.db import models
from apps.books.models import Book
from apps.members.models import Member


class Status(models.TextChoices):
    ISSUED = "Issued"
    RETURNED = "Returned"


class Transaction(models.Model):

    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    issue_date = models.DateField(auto_now_add=True)
    return_date = models.DateField(null=True, blank=True)
    fee = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    status = models.CharField(
        max_length=8,
        choices=Status,
        default=Status.ISSUED,
    )

    def __str__(self):
        return f"{self.member} - {self.book.title} ({self.get_status_display()})"
