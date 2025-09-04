"""
Custom permissions for our API.
Permissions determine who can perform what actions.
"""
from rest_framework import permissions

class IsAuthorOrReadONly(permissions.BasePermission):
    """
    Custom permission to only allow authors to edit their own content.
    
    This permission class checks:
    - Anyone can read (GET, HEAD, OPTIONS)
    - Only the author can modify (POST, PUT, PATCH, DELETE)
    """
    def has_object_permission(self, request, view, obj):
        """
        Object-level permission check.
        Called for each individual object (post, comment, etc.)
        """
        # Read permissions for all users
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions only for the author
        # Check if the object has an 'author' field (for Posts)

        if hasattr(obj,'author'):
            return obj.author == request.user
        # Check if the object has a 'user' field (for Comments, Likes)
        elif hasattr(obj,'user'):
            return obj.user == request.user
        
        return False