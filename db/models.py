from django.db import models


class Tournament(models.Model):
    name = models.CharField(max_length=200)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    duration = models.DecimalField(max_digits=5, decimal_places=2, null=True)

    class Meta:
        db_table = 'tournaments'

    def __str__(self):
        return self.name


class User(models.Model):
    name = models.CharField(max_length=50)
    friends = models.ManyToManyField('self', blank=True)
    status = models.IntegerField(null=True, blank=True)
    avatar = models.BinaryField(null=True, blank=True)
    tournament_id = models.OneToOneField(Tournament, null=True, blank=True, on_delete=models.SET_NULL)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.name


class Statistic(models.Model):
    name = models.CharField(max_length=50)
    wins = models.IntegerField(null=True, blank=True)
    losses = models.IntegerField(null=True, blank=True)
    playtime = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    user_id = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)

    class Meta:
        db_table = 'statistic'

    def __str__(self):
        return self.name


class Match_History(models.Model):
    user1 = models.ForeignKey(User, related_name='match_user1', on_delete=models.CASCADE)
    user2 = models.ForeignKey(User, related_name='match_user2', on_delete=models.CASCADE)
    match_date = models.DateField()
    duration = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    winner = models.ForeignKey(User, related_name='match_winner', on_delete=models.SET_NULL, null=True)

    class Meta:
        db_table = 'match_history'

    def __str__(self):
        return f'Match between {self.user1} and {self.user2} on {self.match_date}'


