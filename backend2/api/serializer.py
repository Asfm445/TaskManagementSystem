from datetime import datetime, timezone

from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import ContinousTask, fixedTask, progressDates


class userSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "email"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class progressDatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = progressDates
        fields = "__all__"


class continousTaskSerializer(serializers.ModelSerializer):
    progressDates = progressDatesSerializer(many=True)

    class Meta:
        model = ContinousTask
        fields = "__all__"
        extra_kwargs = {"progressDates": {"read_only": True}}

    def validate(self, data):
        if "progressDates" in data:
            data.pop("progressDates")
        t = datetime.now(timezone.utc)
        if "startingDate" in data and data["startingDate"] < t:
            raise serializers.ValidationError(
                "starting date must be greater than today"
            )

        return data


class fixedTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = fixedTask
        fields = "__all__"

    def validate(self, data):
        t = datetime.now(timezone.utc)
        if "startingDate" in data and data["startingDate"] < t:
            raise ValidationError("starting date must be greater than today")
        if "endDate" in data and data["endDate"] < data["startingDate"]:
            raise ValidationError("end date must greater than starting date")
        return data
