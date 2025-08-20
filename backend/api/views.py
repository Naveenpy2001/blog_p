from django.shortcuts import render
from rest_framework import status,views,viewsets,permissions,generics
from rest_framework.response import Response
from .models import CustomUser,Post,Comment,Like
from .serializers import UserRegisterSerializer,UserLoginSerializer,PostSerializer,UserSerializer,CommentSerializer,LikeSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .permissions import IsAuthorOrReadONly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404


class RegisterView(views.APIView):
    """
    User registration endpoint.
    APIView gives us full control over the HTTP methods.
    """
    permission_classes = [permissions.AllowAny]
    def post(self,request):
        """Handle POST request for user registration"""

        serializer = UserRegisterSerializer(data = request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    'message':f"User - '{user.email}' Registered Successfully"
                },status=201
            )
        return Response(
            serializer.errors,status=400
        )
    


class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self,request):
        serializer = UserLoginSerializer(data = request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "user" : user.email,
                    'username' : user.username,
                    "access" : str(refresh.access_token),
                    "refresh" : str(refresh),
                    "message" : "Login Successful"
                },status=200
            )
        return Response(
            serializer.errors,
            status=400
        )


class ProfileView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self,request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(Self,request):
        serializer = UserSerializer(request.user,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=400)



class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    permission_classes = [permissions.IsAuthenticatedOrReadOnly,IsAuthorOrReadONly]

    def get_queryset(self):
        """
        Override queryset to add custom filtering.
        This method is called to get the base queryset for the view.
        """
        queryset = Post.objects.all()
        return queryset

    def perform_create(self, serializer):
        """
        Set the author of the post to the current user.
        This method is called when creating a new post.
        """
        serializer.save(author=self.request.user)

    @action(detail=True,methods=['post'])
    def like(self,request,pk=None):
        post = self.get_object()
        like,created = Like.objects.get_or_create(user=request.user,post=post)

        if created:
            return Response(
                {
                    "message": "post liked success.!",
                    'is_liked':True,
                    'like_count':post.likes_count
                },status=201
            )
        else:
            like.delete()
            return Response(
                {
                    "messafe" : "post unliked success.!",
                    'is_like' : False,
                    'likes_count' : post.likes_count
                },status=200
            )

    @action(detail=True,methods=['get'])
    def likes(self,request,pk=None):
        post = self.get_object()
        likes = Like.objects.filter(post=post)
        serilizer = LikeSerializer(likes,many=True)
        return Response(serilizer.data)

    @action(detail=True,methods=['post'],permission_classes=[permissions.IsAuthenticated])
    def comment(self,request,pk=None):
        post = self.get_object()
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, post=post)
            return Response(serializer.data,status=201)
        return Response(serializer.errors,status=400)
    
    @action(detail=True,methods=['get'])
    def comments(self,request,pk=None):
        post = self.get_object()
        Comments = Comment.objects.filter(post=post)
        serilizer = CommentSerializer(Comments,many=True)
        return Response(serilizer.data)
    
class CommentViewset(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,IsAuthorOrReadONly]

    def get_queryset(self):
        queryset = Comment.objects.all()
        post_id = self.request.query_params.get('post',None)
        if post_id:
            queryset = queryset.filter(post=post_id)
        return queryset
    
    def perform_create(self, serializer):
        post_id = self.request.data.get('post')
        post = get_object_or_404(Post,id=post_id)
        serializer.save(user=self.request.user,post=post)


class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    

