from django.db import models


class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    isbn = models.CharField(max_length=13, unique=True)
    publication_year = models.PositiveIntegerField()
    stock = models.PositiveIntegerField()
    rent_fee = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)

    def __str__(self):
        return self.title
