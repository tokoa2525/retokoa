from rest_framework import permissions

class IsLoggedInUserOrRedirect(permissions.BasePermission):
    message = 'ログインしてください。'

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated