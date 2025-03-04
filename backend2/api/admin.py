from django.contrib import admin

from .models import ContinousTask, fixedTask

admin.site.register(ContinousTask)
admin.site.register(fixedTask)
