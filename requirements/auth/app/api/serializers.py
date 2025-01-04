from rest_framework import serializers
from .models import CustomUser, Status, Match
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

	class Meta:
		model = CustomUser
		fields = ['new_alias', 'new_email', 'new_pp', 'old_password', 'new_password', 'confirmation_password']

	new_alias = serializers.CharField(label='New Alias', max_length=30, min_length=2, required=False, allow_blank=True)
	new_email = serializers.EmailField(label='New Email', required=False, allow_blank=True)
	new_pp = serializers.CharField(label='New Profile Picture', required=False, allow_blank=True)
	old_password = serializers.CharField(label='Old Password', required=False, allow_blank=True)
	new_password = serializers.CharField(label='New Password', required=False, allow_blank=True)
	confirmation_password = serializers.CharField(label='Confirm New Password', required=False, allow_blank=True)

	def validate(self, data):
		user = self.context.get('user')
		if not user:
			raise serializers.ValidationError("User context is required for validation.")

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
			raise ValidationError("All change password field are not fill")
		return data

class	ChangeRoomSerializer(serializers.Serializer):
	room_id = serializers.UUIDField(label='Room Id')


class	AddMatchSerializer(serializers.ModelSerializer):
	user1_id = serializers.UUIDField(required=True)
	user2_id = serializers.UUIDField(required=True)
	user1_score = serializers.IntegerField(required=True)
	user2_score = serializers.IntegerField(required=True)
	user1_status = serializers.ChoiceField(required=True, choices=Status.choices)
	user2_status = serializers.ChoiceField(required=True, choices=Status.choices)
	date = serializers.DateField(required=True)

class CodeSerializer(serializers.Serializer):
	code = serializers.CharField(required=True)

class Serializer2FA(serializers.Serializer):
	otp_code = serializers.CharField(required=True)

class LanguageSerializer(serializers.Serializer):
	language = serializers.CharField(required=True, max_length=3)