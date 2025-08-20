from django.urls import path,include
from rest_framework.routers import DefaultRouter
from  .views import RegisterView,LoginView,PostViewSet,ProfileView,CommentViewset,UserListView

router = DefaultRouter()

router.register(r'posts',PostViewSet,basename='post')
router.register(r'comment',CommentViewset,basename='comments')


urlpatterns = [
    path('register/',RegisterView.as_view(),name='register'),
    path('login/',LoginView.as_view(),name='register'),
    path('profile/',ProfileView.as_view(),name='profile'),
    path('users/',UserListView.as_view(),name='users'),

    path('',include(router.urls))
]