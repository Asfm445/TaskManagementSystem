# Generated by Django 5.1.6 on 2025-03-07 10:43

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0004_alter_fixedtask_owner"),
    ]

    operations = [
        migrations.AddField(
            model_name="progressdates",
            name="isStopped",
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name="stopProgress",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("stopped_at", models.DateTimeField(auto_now_add=True)),
                (
                    "task",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="stop_task",
                        to="api.continoustask",
                    ),
                ),
            ],
        ),
    ]
