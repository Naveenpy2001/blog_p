from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class CustomUser(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    This allows us to add custom fields to the user model.
    """
    # Make email unique and required

    username = models.CharField(max_length=150, unique=False, blank=True, null=True)
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True,null=True,help_text="User's Biography")
    profile_picture = models.ImageField(upload_to='profiles/',blank=True,null=True,help_text="User's Profile picture")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []


    def __str__(self):
        return self.email
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'


class Post(models.Model):
    """
    Post model represents blog posts created by users.
    """
    # Foreign key to User - creates a many-to-one relationship
    # When user is deleted, their posts are also deleted (CASCADE)

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='posts',
        help_text="The user Who created this post"
    )
    title = models.CharField(max_length=225,help_text="Post Title")
    image = models.ImageField(
        blank=True,null=True,
        help_text='Optional Post Image'
    )

    caption = models.TextField(
        help_text='Post Content/caption',
        blank=True,
        null=True
    )


    # Timestamps - auto_now_add sets the time when object is created
    # auto_now updates the time every time the object is saved
    created_at = models.DateTimeField(auto_now_add=True)
    udpated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'


    def __str__(self):
        return f'{self.author.username} : {self.title}'
    
    @property
    def likes_count(self):
        """Property to get the number of likes for this post"""
        return self.likes.count()
    
    @property
    def comment_count(self):
        """Property to get the number of comments for this post"""
        return self.comments.count()


class Like(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='likes'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user','post')
        verbose_name = 'Like'
        verbose_name_plural = 'Likes'

    def __str__(self):
        return f'{self.user.username} Likes {self.post.title}'
    

class Comment(models.Model):
    """
    Comment model represents comments on posts.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='comments'
    )

    content = models.TextField(
        max_length=1000
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Comment'
        verbose_name_plural = 'Comments'

    def __str__(self):
        return f"{self.user.username} on {self.post.title}"
    
