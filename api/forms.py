from cProfile import label

from django import forms
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import MinLengthValidator

from db.models import CustomUser
from django.contrib.auth.forms import AuthenticationForm

class EmptyFieldError(ValidationError):
    def __init__(self, message="This field cannot be empty", code='empty_field'):
        super().__init__(message=message, code=code)

class BadPasswordError(ValidationError):
    def __init__(self, message="Bad password", code='bad-password'):
        super().__init__(message=message, code=code)

class   ConfirmationError(ValidationError):
    def __init__(self, message="Bad confirmation", code='bad-confirmation'):
        super().__init__(message=message, code=code)

class CustomUserCreationForm(forms.Form):
    username = forms.CharField(max_length=30, validators=[MinLengthValidator(2)])
    email = forms.EmailField()
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    def validate_username(self):
        username = self.cleaned_data.get('username')
        if CustomUser.objects.filter(username=username).exists():
            raise ValidationError("This username is already taken.")
        return username

    def validate_email(self):
        email = self.cleaned_data.get('email')
        if CustomUser.objects.filter(email=email).exists():
            raise ValidationError("This email is already in use.")
        return email

    def validate_password(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        validate_password(password2)
        return password2


class LoginForm(forms.Form):
    username = forms.CharField(label='Username', max_length=30)
    password = forms.CharField(label='Password', widget=forms.PasswordInput)

class EditAccountForm(forms.Form):
    new_alias = forms.CharField(label='New Alias', max_length=30, min_length=2, required=False)
    new_email = forms.EmailField(label="New Email", required=False)
    new_pp = forms.ImageField(label="New Profile Picture", required=False, allow_empty_file=False)
    old_password = forms.CharField(label='Old Password', widget=forms.PasswordInput, required=False)
    new_password = forms.CharField(label='New Password', widget=forms.PasswordInput, required=False)
    confirmation_password = forms.CharField(label='Confirm New Password', widget=forms.PasswordInput, required=False)

    def validePassword(self, user):
        old_password = self.cleaned_data.get("old_password")
        new_password = self.cleaned_data.get("new_password")
        confirmation_password = self.cleaned_data.get("confirmation_password")

        if old_password == '' or new_password == '' or confirmation_password == '':
            raise EmptyFieldError("All change password field are not fill")

        if old_password != user.password:
            raise BadPasswordError("Bad old password")

        if new_password != confirmation_password:
            raise ConfirmationError("New password and Confirm new password are different")
        validate_password(new_password)
        return new_password