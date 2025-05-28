from django import forms
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from .models import Usuario
from django.contrib.auth.hashers import check_password

class LoginForm(forms.Form):
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Correo Electrónico'}),
        label='Correo Electrónico'
    )
    contrasena = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Contraseña'}),
        label='Contraseña'
    )
    tipo_usuario = forms.ChoiceField(
        choices=[('cliente', 'Cliente'), ('administrador', 'Administrador')],
        widget=forms.Select(attrs={'class': 'form-control'}),
        label='Tipo de Usuario'
    )

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get('email')
        contrasena = cleaned_data.get('contrasena')
        tipo_usuario = cleaned_data.get('tipo_usuario')

        if email and contrasena:
            try:
                if tipo_usuario == 'administrador':
                    usuario = Usuario.objects.get(email=email, rol='Administrador')
                elif tipo_usuario == 'cliente':
                    usuario = Usuario.objects.get(email=email, rol='Cliente')
                else:
                    raise ValidationError("Tipo de usuario inválido")

                # Verificar la contraseña hasheada
                if not check_password(contrasena, usuario.contrasena):
                    raise ValidationError("Correo electrónico o contraseña incorrectos")

                cleaned_data['usuario'] = usuario
            except Usuario.DoesNotExist:
                raise ValidationError("Correo electrónico o contraseña incorrectos")
        return cleaned_data


class RegistroForm(forms.ModelForm):
    confirmacion_contrasena = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Confirmar Contraseña'}),
        label='Confirmar Contraseña'
    )
    tipo_usuario = forms.ChoiceField(
        choices=[('cliente', 'Cliente'), ('administrador', 'Administrador')],
        widget=forms.Select(attrs={'class': 'form-control'}),
        label='Tipo de Usuario'
    )

    class Meta:
        model = Usuario
        fields = ['nombre', 'email', 'contrasena']
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Nombre Completo'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Correo Electrónico'}),
            'contrasena': forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Contraseña'}),
        }
        labels = {
            'nombre': 'Nombre Completo',
            'email': 'Correo Electrónico',
            'contrasena': 'Contraseña',
        }

    def clean(self):
        cleaned_data = super().clean()
        contrasena = cleaned_data.get('contrasena')
        confirmacion = cleaned_data.get('confirmacion_contrasena')

        if contrasena and confirmacion and contrasena != confirmacion:
            raise ValidationError("Las contraseñas no coinciden")

        # Verificar que el correo electrónico no esté ya registrado
        email = cleaned_data.get('email')
        if email and Usuario.objects.filter(email=email).exists():
            raise ValidationError({'email': "Este correo electrónico ya está registrado"})

        # Asignar el rol según el tipo de usuario seleccionado
        tipo_usuario = cleaned_data.get('tipo_usuario')
        if tipo_usuario == 'cliente':
            cleaned_data['rol'] = 'Cliente'
        elif tipo_usuario == 'administrador':
            cleaned_data['rol'] = 'Administrador'

        return cleaned_data

    def save(self, commit=True):
        usuario = super().save(commit=False)
        usuario.rol = self.cleaned_data.get('rol')

        if commit:
            usuario.save()

        return usuario