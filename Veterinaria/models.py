import bson
from django.utils import timezone
from bson.objectid import ObjectId
from djongo import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Custom User Manager
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El email debe ser proporcionado')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('rol', 'Administrador')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

# Custom User Model
class Usuario(AbstractBaseUser, PermissionsMixin):
    _id = models.ObjectIdField()
    nombre = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    contrasena = models.CharField(max_length=255)

    # Campos requeridos por AbstractBaseUser
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    # Campo de rol personalizado
    rol = models.CharField(max_length=50, choices=[('Cliente', 'Cliente'), ('Administrador', 'Administrador')], default='Cliente')

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre', 'rol']

    def __str__(self):
        return self.email

    class Meta:
        verbose_name_plural = "Usuarios"


class Producto(models.Model):
    _id = models.ObjectIdField(primary_key=True, default=ObjectId)
    id = models.CharField(max_length=10, unique=True)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    precio = models.IntegerField()
    cantidad_disponible = models.IntegerField()
    imagen_url = models.CharField(max_length=255, blank=True, null=True)

    # Categorías
    CATEGORIA_CHOICES = [
        ('Alimento húmedo', 'Alimento húmedo'),
        ('Alimento seco', 'Alimento seco'),
        ('Juguete gato', 'Juguete gato'),
        ('Accesorio gato', 'Accesorio gato'),
        ('Juguete perro', 'Juguete perro'),
        ('Accesorio perro', 'Accesorio perro'),
        ('Medicamento gato', 'Medicamento gato'),
        ('Medicamento perro', 'Medicamento perro'),
        ('Vitamina gato', 'Vitamina gato'),
        ('Vitamina perro', 'Vitamina perro'),
    ]

    categoria = models.CharField(max_length=100, choices=CATEGORIA_CHOICES)

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'Productos'


class Proveedor(models.Model):
    _id = models.ObjectIdField(primary_key=True, default=ObjectId)
    nombre = models.CharField(max_length=100)
    contacto = models.JSONField()
    direccion = models.CharField(max_length=255, blank=True, null=True)
    catalogo = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'Proveedores'


class Cliente(models.Model):
    _id = models.ObjectIdField(primary_key=True, default=ObjectId)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, null=True, blank=True)
    nombre = models.CharField(max_length=100)
    contacto = models.JSONField()  # Almacena contacto, teléfono, email, etc.
    direccion = models.CharField(max_length=255, null=True, blank=True)
    historialCompras = models.JSONField(null=True, blank=True)
    preferencias = models.JSONField(default=dict, blank=True)


    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'Clientes'


class OrdenCompra(models.Model):
    _id = models.ObjectIdField(primary_key=True, default=ObjectId)
    numero_orden = models.CharField(max_length=50)
    fecha_emision = models.DateTimeField()
    fecha_entrega_estimada = models.DateTimeField()
    fecha_entrega_real = models.DateTimeField(null=True, blank=True)
    proveedor = models.JSONField()
    productos = models.JSONField()
    subtotal = models.IntegerField()
    impuesto = models.IntegerField()
    costo_envio = models.IntegerField()
    total = models.IntegerField()
    estado = models.CharField(max_length=20)
    metodo_pago = models.CharField(max_length=50)

    def __str__(self):
        return self.numero_orden

    class Meta:
        db_table = 'Ordenes_Compra'


class Venta(models.Model):
    _id = models.ObjectIdField(primary_key=True, default=ObjectId)
    numero_factura = models.CharField(max_length=50)
    fecha = models.DateTimeField()
    cliente = models.JSONField()
    productos = models.JSONField()
    metodo_pago = models.CharField(max_length=50)
    subtotal = models.IntegerField()
    impuesto = models.IntegerField()
    total = models.IntegerField()
    estado = models.CharField(max_length=20)
    direccion = models.CharField(max_length=255)
    ciudad = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.numero_factura} - {self.cliente.get('nombre', 'Sin cliente')}"

    class Meta:
        db_table = 'Ventas'
