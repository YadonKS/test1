# Generated by Django 5.0.1 on 2025-07-19 22:02

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='GameSession',
            fields=[
                ('session_id', models.CharField(default=uuid.uuid4, editable=False, max_length=64, primary_key=True, serialize=False)),
                ('current_state', models.CharField(max_length=64)),
                ('day_number', models.IntegerField(default=1)),
                ('full_transcript_history', models.JSONField(blank=True, default=list)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
