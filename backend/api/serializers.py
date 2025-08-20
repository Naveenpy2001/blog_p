from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser,Post,Comment,Like

class UserRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Handles password validation and user creation.
    """
    # write_only=True means this field won't be returned in responses
    password = serializers.CharField(
        write_only = True,
        validators = [validate_password], # Use Django's password validation
        help_text = "Password must be atleadt 8 characters long"
    )

    password_confirm = serializers.CharField(
        write_only = True
    )

    class Meta:
        model = CustomUser
        fields = (
            'username','email','password','password_confirm','bio','profile_picture'
        )

    def validate(self,attrs):
        """
        Custom validation to ensure passwords match.
        This method is called automatically by DRF.
        """

        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(
                "password don't match"
            )
        return attrs
        
    def create(self,validated_data):
        """
        Create a new user with encrypted password.
        The password_confirm field is removed before creating the user.
        """

        validated_data.pop('password_confirm')   # Remove confirm password

        user = CustomUser.objects.create_user(**validated_data)
        return user
    

class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    Validates credentials and returns the authenticated user.
    """

    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True
    )

    def validate(self,attrs):
        """
        Validate user credentials.
        """
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            # authenticate() checks if the credentials are valid
            user = authenticate(username=email,password=password)
            if not user:
                raise serializers.ValidationError(
                    "Invalid email or password"
                )
            
            if not user.is_active:
                raise serializers.ValidationError(
                    "user account is disabled"
                )
            attrs['user'] = user

        else:
            raise serializers.ValidationError(
                "must be include email and password"
            )
        return attrs
    


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile information.
    Used for displaying user data and updating profiles.
    """
    # Make the posts_count available in user serialization

    posts_count = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = (
            'id','username','email','bio','profile_picture','date_joined','posts_count'
        )

        read_only_fields = ('id','date_joined')

    def get_posts_count(self,obj):
        return obj.posts.count()




class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True)

    class Meta:
        model = Comment
        fields = ('id','user','content','created_at','updated_at')
        read_only_fields = ('id','created_at','updated_at')


class PostSerializer(serializers.ModelSerializer):

    author = UserSerializer(read_only=True)
    likes_count = serializers.ReadOnlyField()
    comments_count = serializers.ReadOnlyField()
    comments = CommentSerializer(many=True,read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = (
            'id','author','title','image','caption','created_at','udpated_at','likes_count','comments_count',
            'comments','is_liked'
        )
        read_only_fields = ('id','created_at','udpated_at')


    def get_is_liked(self,obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False



class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = (
            'id','user','post','created_at'
        )
        read_only_fields = ('id','user','created_at')


