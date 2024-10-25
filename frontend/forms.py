from symtable import Class

from django import forms
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import MinLengthValidator

from db.models import CustomUser
from django.contrib.auth.forms import AuthenticationForm

class changeAliasForm(forms.Form):
    new_alias = forms.CharField(max_length=30, required=True, validators=[MinLengthValidator(2)])

    def get_alias(self):
        return self.cleaned_data.get('new_alias')


class changePpForm(forms.Form):
    new_PP = forms.ImageField(allow_empty_file=False)

class changeEmailForm(forms.Form):
    new_Email = forms.EmailField()

    def getEmail(self):
        return self.cleaned_data.get('new_Email')

class changePasswordForm(forms.Form):
    old_Password = forms.CharField(widget=forms.PasswordInput)
    new_Password = forms.CharField(widget=forms.PasswordInput)
    confirm_new_Password = forms.CharField(widget=forms.PasswordInput)

    def getNewPassword(self):
        return self.cleaned_data.get('new_Password')

    def getOldPassword(self):
        return self.cleaned_data.get('old_Password')

    def getConfirmation(self):
        return self.cleaned_data.get('confirm_new_Password')