from rest_framework import serializers
from .models import CustomUser, Match
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator

class EmptyFieldError(ValidationError):
	def __init__(self, message="This field cannot be empty", code='empty_field'):
		super().__init__(message=message, code=code)

class BadPasswordError(ValidationError):
	def __init__(self, message="Bad password", code='bad-password'):
		super().__init__(message=message, code=code)

class ConfirmationError(ValidationError):
	def __init__(self, message="Bad confirmation", code='bad-confirmation'):
		super().__init__(message=message, code=code)

class UserAlreadyExist(ValidationError):
	def __init__(self, message="This username is already taken", code='username_already_exist'):
		super().__init__(message=message, code=code)

class EmailAlreadyExist(ValidationError):
	def __init__(self, message="This email is already taken", code='email_already_exist'):
		super().__init__(message=message, code=code)

class PasswordDontMatch(ValidationError):
	def __init__(self, message="Password don't match", code='password-dont-match'):
		super().__init__(message=message, code=code)

class RegisterSerializer(serializers.ModelSerializer):
	email = serializers.EmailField(label='Email')
	password = serializers.CharField(label='Password')
	confirmation_password = serializers.CharField(label='Confirm Password')
	username = serializers.CharField(label='Username', max_length=30, min_length=2, validators=[RegexValidator(regex='^[a-zA-Z0-9_]*$', message='The username can only contain alphanumeric characters or underscores.', code='invalid_username')])

	class Meta:
		model = CustomUser
		fields = ['username', 'email', 'password', 'confirmation_password']

	def validate_username(self, value):
		if CustomUser.objects.filter(username=value).exists():
			raise ValidationError(message="This username is already taken.")
		return value

	def validate_email(self, value):
		if CustomUser.objects.filter(email=value).exists():
			raise ValidationError(message="This email is already taken.")
		email42 = value.split('@')
		if email42[1].startswith('student.42'):
			raise ValidationError(message="You can't use 42 email to create an account. Please use 42 connection.")
		return value

	def validate(self, data):
		username = data.get('username')
		email = data.get('email')
		password = data.get('password')
		confirmation = data.get('confirmation_password')

		if CustomUser.objects.filter(username=username).exists():
			raise ValidationError(message="This username is already taken.")

		if CustomUser.objects.filter(email=email).exists():
			raise ValidationError(message="This email is already taken.")

		if password and confirmation and password != confirmation:
			raise ValidationError(message="Passwords don't match")

		if len(password) < 8:
			raise ValidationError(message="Password too short")

		has_upper = any(char.isupper() for char in password)
		has_digit = any(char.isdigit() for char in password)

		if not has_upper:
			raise ValidationError(message="No uppercase in password")
		if not has_digit:
			raise ValidationError(message="No digit in password")

		return data

class LoginSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = ['username', 'password']

	username = serializers.CharField(label='Username', max_length=30, min_length=2)
	password = serializers.CharField(label='Password')


class EditAccountSerializer(serializers.ModelSerializer):

	class Meta:
		model = CustomUser
		fields = ['new_alias', 'new_email', 'new_pp', 'old_password', 'new_password', 'confirmation_password']

	new_alias = serializers.CharField(label='New Alias', max_length=20, min_length=2, required=False, allow_blank=True)
	new_email = serializers.EmailField(label='New Email', required=False, allow_blank=True)
	new_pp = serializers.CharField(label='New Profile Picture', required=False, allow_blank=True)
	old_password = serializers.CharField(label='Old Password', required=False, allow_blank=True)
	new_password = serializers.CharField(label='New Password', required=False, allow_blank=True)
	confirmation_password = serializers.CharField(label='Confirm New Password', required=False, allow_blank=True)

	def validate(self, data):
		user = self.context.get('user')
		if not user:
			raise serializers.ValidationError("User context is required for validation.")

		new_alias = data.get('new_alias')
		if new_alias:
			if CustomUser.objects.filter(alias=new_alias).exists():
				raise ValidationError(message="This alias is already taken.")

		new_email = data.get('new_email')
		if new_email:
			if CustomUser.objects.filter(email=new_email).exists():
				raise EmailAlreadyExist(message="This email is already taken.")
			test_new_email = new_email.split('@')
			if test_new_email[1].startswith('student.42'):
				raise ValidationError(message="You can't use 42 email to create an account. Please use 42 connection.")
		old_password = data.get('old_password')
		new_password = data.get('new_password')
		confirmation_password = data.get('confirmation_password')
		if old_password is not "" and new_password is not "" and confirmation_password is not "":
			if old_password and new_password and not user.check_password(old_password):
				raise BadPasswordError(message="Bad old password")

			if new_password and new_password != confirmation_password:
				raise ConfirmationError(message="New password and Confirm New Password are different")

			if new_password:
				if len(new_password) < 8:
					raise ValidationError(message="Password too short")

				has_upper = any(char.isupper() for char in new_password)
				has_digit = any(char.isdigit() for char in new_password)

				if not has_upper:
					raise ValidationError(message="No uppercase in password")
				if not has_digit:
					raise ValidationError(message="No digit in password")

		elif old_password is not "" or new_password is not "" or confirmation_password is not "":
			raise ValidationError("All change password fields are not filled")
		return data

class	ChangeRoomSerializer(serializers.Serializer):
	room_id = serializers.UUIDField(label='Room Id')


class CodeSerializer(serializers.Serializer):
	code = serializers.CharField(required=True)

class Serializer2FA(serializers.Serializer):
	otp_code = serializers.CharField(required=True)

class LanguageSerializer(serializers.Serializer):
	language = serializers.CharField(required=True, max_length=3)