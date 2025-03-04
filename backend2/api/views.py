from datetime import datetime, timezone

from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ContinousTask, fixedTask, progressDates, stopProgress
from .serializer import continousTaskSerializer, fixedTaskSerializer, userSerializer


class createUserView(generics.CreateAPIView):
    """
    API view for creating a new user.

    This view allows any user to create a new account. It uses the
    UserSerializer to validate and save the user data.
    """

    queryset = User.objects.all()
    serializer_class = userSerializer
    permission_classes = [AllowAny]


class createprogress(APIView):
    """
    API view for managing continuous tasks and their progress.

    This view supports multiple HTTP methods to create, update,
    retrieve, and delete continuous tasks for authenticated users.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve continuous tasks and their progress for the authenticated user.

        If a task ID is provided in the query parameters, only that task's
        progress will be retrieved. Otherwise, all tasks for the user will be returned.
        """
        id = request.query_params.get("id")
        queryset = ContinousTask.objects.filter(owner=request.user)

        # Filter by ID if provided
        if id:
            try:
                queryset = queryset.filter(id=int(id))
                if not queryset.exists():
                    return Response(
                        {"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND
                    )
            except ValueError:
                return Response(
                    {"error": "Invalid ID format."}, status=status.HTTP_400_BAD_REQUEST
                )

        today = datetime.now(timezone.utc)
        progress_dates_to_create = []

        for task in queryset:
            current_start_date = task.startingDate

            # Calculate progress dates until the task is stopped or completed
            while current_start_date + task.timeinterval <= today and not task.stop:
                end_date = current_start_date + task.timeinterval

                # Create a new progress date instance
                passed_date = progressDates(
                    startDate=current_start_date,
                    endDate=end_date,
                    progress=task,
                    isDone=task.completed,
                )
                progress_dates_to_create.append(passed_date)

                if not task.stop:
                    task.startingDate = current_start_date + task.timeinterval
                    current_start_date += task.timeinterval
                    task.completed = False  # Reset completion status
                    task.save()  # Save the updated task

        # Bulk create all progress dates at once
        if progress_dates_to_create:
            progressDates.objects.bulk_create(progress_dates_to_create)

        # Serialize the updated queryset and return it
        serializer = continousTaskSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Create a new continuous task for the authenticated user.

        The request body must contain valid data according to the
        ContinousTaskSerializer. On success, the newly created task
        is returned with a 201 status code.
        """
        serializer = continousTaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors)

    def patch(self, request):
        """
        Update an existing continuous task for the authenticated user.

        The request must include the ID of the task to be updated
        in the query parameters. Only fields that are provided will
        be updated. Returns the updated task data on success.
        """
        data = request.data
        if "id" in data:
            try:
                ob = ContinousTask.objects.get(id=data["id"])
            except Exception:
                return Response(
                    {"message": "task with given id was not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            return Response(
                {"message": "provide task id"}, status=status.HTTP_400_BAD_REQUEST
            )
        ser = continousTaskSerializer(ob, data, partial=True)
        if ser.is_valid():
            ser.save()
            return Response(ser.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """
        Delete a continuous task for the authenticated user.

        The request must include the ID of the task to be deleted
        in the query parameters. Returns a 204 status code on success.
        """
        id = request.query_params.get("id")
        if not id:
            return Response(
                {"message": "provide id"}, status=status.HTTP_400_BAD_REQUEST
            )
        try:
            ob = ContinousTask.objects.get(id=id, owner=request.user)
            print(ob, id)
        except Exception:
            return Response(status=status.HTTP_404_NOT_FOUND)
        ob.delete()
        return Response(status=status.HTTP_200_OK)


class stopAndStartProgress(APIView):
    """API view to start or stop progress on a continuous task.

    This view is intended to manage the starting and stopping of
    progress for a specific continuous task. Method implementations
    need to be defined based on specific requirements."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        today = datetime.now(timezone.utc)
        data = request.data
        if "task_id" in data and "stop" in data:
            try:
                task = ContinousTask.objects.get(id=data["task_id"], owner=request.user)
            except Exception:
                return Response(
                    {"message": f"task with{data["task_id"]} not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            if data["stop"]:
                task.stop = True
                stopped_progress = stopProgress(task_id=data["task_id"])
                stopped_progress.save()
                task.save()
                return Response(status=status.HTTP_202_ACCEPTED)
            try:
                stopped_progress = stopProgress.objects.get(task_id=task.id)
            except Exception:
                return Response(
                    {"message": "the task did not stopped"}, status=status.HTTP_200_OK
                )
            task.stop = False
            task.startingDate = today
            stopped_progress_date = progressDates(
                startDate=stopped_progress.stopped_at,
                endDate=today,
                isStopped=True,
                progress=task,
            )
            stopped_progress_date.save()
            task.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(
                {"message": "entered data is not valid"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class createFixed(APIView):
    """
    API view for managing fixed tasks.

    This view allows authenticated users to create, retrieve, update,
    and delete fixed tasks. Each task is associated with the user
    who created it.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve all fixed tasks for the authenticated user.

        Returns a list of fixed tasks associated with the user.
        """
        queryset = fixedTask.objects.filter(owner=request.user)
        serializer = fixedTaskSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        """
        Create a new fixed task for the authenticated user.

        The request body must contain valid data according to the
        fixedTaskSerializer. On success, the newly created task
        is returned with a 201 status code.
        """
        serializer = fixedTaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors)

    def patch(self, request):
        """
        Update an existing fixed task for the authenticated user.

        The request body must include the ID of the task to be updated.
        Only fields that are provided will be updated. Returns the
        updated task data on success.
        """
        data = request.data
        ob = fixedTask.objects.get(id=data["id"], owner=request.user)
        ser = fixedTaskSerializer(ob, data, partial=True)
        if ser.is_valid():
            ser.save()
            return Response(ser.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """
        Delete a fixed task for the authenticated user.

        The request must include the ID of the task to be deleted
        in the query parameters. Returns a 200 status code on success.
        If no ID is provided or the task does not exist, appropriate
        error responses are returned.
        """
        id = request.query_params.get("id")
        if not id:
            return Response(
                {"message": "provide id"}, status=status.HTTP_400_BAD_REQUEST
            )
        try:
            ob = fixedTask.objects.get(id=id, owner=request.user)
        except Exception:
            return Response(status=status.HTTP_404_NOT_FOUND)
        ob.delete()
        return Response(status=status.HTTP_200_OK)
