from django.contrib.auth import get_user_model
from django.db import models

user = get_user_model()


class ContinousTask(models.Model):
    timeinterval = models.DurationField()
    startingDate = models.DateTimeField()
    task = models.CharField(max_length=100)
    completed = models.BooleanField(default=False)
    stop = models.BooleanField(default=False)
    owner = models.ForeignKey(
        user,
        on_delete=models.CASCADE,
        related_name="continousTask_owner",
        blank=True,
        null=True,
    )

    def __str__(self):
        return self.task


class stopProgress(models.Model):
    stopped_at = models.DateTimeField(auto_now_add=True)
    task = models.ForeignKey(
        ContinousTask, on_delete=models.CASCADE, related_name="stop_task"
    )


class progressDates(models.Model):
    startDate = models.DateTimeField()
    endDate = models.DateTimeField()
    isDone = models.BooleanField(default=False)
    progress = models.ForeignKey(
        ContinousTask, on_delete=models.CASCADE, related_name="progressDates"
    )
    isStopped = models.BooleanField(default=False)


class fixedTask(models.Model):
    startingDate = models.DateTimeField()
    endDate = models.DateTimeField()
    task = models.CharField(max_length=100)
    completed = models.BooleanField(default=False)
    owner = models.ForeignKey(
        user, on_delete=models.CASCADE, related_name="fixedTask_owner", default=1
    )

    def __str__(self):
        return self.task
