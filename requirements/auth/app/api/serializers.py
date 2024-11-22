from rest_framework import serializers
from .models import CustomUser, Status
from django.core.exceptions import ValidationError
import uuid

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
	username = serializers.CharField(label='Username', max_length=30, min_length=2)

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
	new_alias = serializers.CharField(label='New Alias', max_length=30, min_length=2, required=False)
	new_email = serializers.EmailField(label='New Email', required=False)
	new_pp = serializers.ImageField(label='New Profile Picture', required=False, allow_empty_file=False)
	old_password = serializers.CharField(label='Old Password', required=False)
	new_password = serializers.CharField(label='New Password', required=False)
	confirmation_password = serializers.CharField(label='Confirm New Password', required=False)

	def validate(self, data, user):
		old_password = data.get('old_password')
		new_password = data.get('new_password')
		confirmation_password = data.get('confirmation_password')

		if old_password == '' or new_password == '' or confirmation_password == '':
			raise ValidationError("All change password field are not fill")

		if old_password != user.password:
			raise BadPasswordError(message="Bad old password")

		if new_password != confirmation_password:
			raise ConfirmationError(message="New password and Confirm New Password are different")

		if len(new_password) < 8:
			raise ValidationError(message="Password too short")

		has_upper = any(char.isupper() for char in new_password)
		has_digit = any(char.isdigit() for char in new_password)

		if not has_upper:
			raise ValidationError(message="No uppercase in password")
		if not has_digit:
			raise ValidationError(message="No digit in password")

		return data

class	ChangeRoomSerializer(serializers.ModelSerializer):
	room_id = serializers.UUIDField(label='Room Id')


class	AddMatchSerializer(serializers.ModelSerializer):
	user1_id = serializers.UUIDField(required=True)
	user2_id = serializers.UUIDField(required=True)
	user1_score = serializers.IntegerField(required=True)
	user2_score = serializers.IntegerField(required=True)
	user1_status = serializers.ChoiceField(required=True, choices=Status.choices)
	user2_status = serializers.ChoiceField(required=True, choices=Status.choices)
	date = serializers.DateField(required=True)