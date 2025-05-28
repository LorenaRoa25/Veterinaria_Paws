import json
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from bson.objectid import ObjectId
from django.http import HttpResponse

from .forms import LoginForm, RegistroForm
from .models import Usuario, Producto, Cliente, OrdenCompra, Proveedor, Venta

def PaginaPrincipal(request):
    """
    Vista para la página principal
    """
    return render(request, 'principal/Pagina_Principal.html')

def Contacto(request):
    """
    Vista para la página de contacto
    """
    return render(request, 'contacto/contacto.html')

def Productos(request):
    """
    Vista para la página de productos, con filtro por categoría
    """
    categoria = request.GET.get('categoria')

    if categoria and categoria != 'todos':
        productos = Producto.objects.filter(categoria=categoria)
    else:
        productos = Producto.objects.all()

    return render(request, 'productos/productos.html', {'productos': productos})


def checkout(request):
    """
    Vista para la página de checkout
    """
    return render(request, 'checkout/checkout.html')


def Administrativo(request):
    productos = Producto.objects.all()
    clientes = Cliente.objects.all()
    proveedores = Proveedor.objects.all()
    usuarios = Usuario.objects.all()
    ventas = Venta.objects.all()
    compras = OrdenCompra.objects.all()

    contexto = {
        'productos': productos,
        'clientes': clientes,
        'proveedores': proveedores,
        'usuarios': usuarios,
        'ventas': ventas,
        'compras': compras,
    }
    return render(request, 'panel_administrativo/administrativo.html', contexto)


# Panel administrativo - Productos
import os
from django.conf import settings

def guardar_producto(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        descripcion = request.POST.get('descripcion')
        precio = request.POST.get('precio')
        cantidad = request.POST.get('cantidad_disponible')
        categoria = request.POST.get('categoria')
        imagen = request.FILES.get('imagen')

        id_producto = "PRO" + str(int(Producto.objects.count()) + 1).zfill(3)

        imagen_url = None
        if imagen:
            ruta = os.path.join('productos', imagen.name)
            ruta_completa = os.path.join(settings.MEDIA_ROOT, ruta)
            os.makedirs(os.path.dirname(ruta_completa), exist_ok=True)
            with open(ruta_completa, 'wb+') as destino:
                for chunk in imagen.chunks():
                    destino.write(chunk)
            imagen_url = os.path.join(settings.MEDIA_URL, ruta)

        nuevo = Producto(
            _id=ObjectId(),
            id=id_producto,
            nombre=nombre,
            descripcion=descripcion,
            precio=int(precio),
            cantidad_disponible=int(cantidad),
            categoria=categoria,
            imagen_url=imagen_url
        )
        nuevo.save()
    return redirect('administrativo')



@require_POST
def editar_producto_modal(request):
    producto_id = request.POST.get('id')
    try:
        producto = Producto.objects.get(id=producto_id)
    except Producto.DoesNotExist:
        return redirect('administrativo')

    producto.nombre = request.POST.get('nombre')
    producto.descripcion = request.POST.get('descripcion')
    producto.precio = int(request.POST.get('precio'))
    producto.cantidad_disponible = int(request.POST.get('cantidad_disponible'))
    producto.categoria = request.POST.get('categoria')

    imagen = request.FILES.get('imagen')
    if imagen:
        ruta = os.path.join('productos', imagen.name)
        ruta_completa = os.path.join(settings.MEDIA_ROOT, ruta)
        os.makedirs(os.path.dirname(ruta_completa), exist_ok=True)
        with open(ruta_completa, 'wb+') as destino:
            for chunk in imagen.chunks():
                destino.write(chunk)
        producto.imagen_url = os.path.join(settings.MEDIA_URL, ruta)

    producto.save()
    return redirect('administrativo')


# Eliminar producto
def eliminar_producto(request, producto_id):
    producto = get_object_or_404(Producto, id=producto_id)
    producto.delete()
    return redirect('administrativo')


# Panel administrativo - Clientes
def guardar_cliente(request):
    if request.method == 'POST':
        id_cliente = request.POST.get('id')
        if id_cliente:
            cliente = Cliente.objects.get(id=id_cliente)
        else:
            cliente = Cliente()
            cliente._id = ObjectId()
            cliente.id = "CLI" + str(Cliente.objects.count() + 1).zfill(3)

        cliente.nombre = request.POST.get('nombre')
        cliente.contacto = {
            "telefono": request.POST.get('telefono'),
            "email": request.POST.get('email'),
        }
        cliente.save()
    return redirect('administrativo')

def eliminar_cliente(request, cliente_id):
    cliente.objects.get(id=cliente_id).delete()
    return redirect('administrativo')


# Panel administrativo - Proveedores
def guardar_proveedor(request):
    if request.method == 'POST':
        proveedor_id = request.POST.get('id')
        if proveedor_id:
            proveedor = Proveedor.objects.get(id=proveedor_id)
        else:
            proveedor = Proveedor()
            proveedor._id = ObjectId()
            proveedor.id = "PROV" + str(Proveedor.objects.count() + 1).zfill(3)

        proveedor.nombre = request.POST.get('nombre')
        proveedor.contacto = {
            "telefono": request.POST.get('telefono'),
            "email": request.POST.get('email'),
        }
        proveedor.direccion = request.POST.get('direccion')
        proveedor.save()
    return redirect('administrativo')

def eliminar_proveedor(request, proveedor_id):
    Proveedor.objects.get(id=proveedor_id).delete()
    return redirect('administrativo')


# Panel administrativo - Usuarios
def guardar_usuario(request):
    if request.method == 'POST':
        usuario_id = request.POST.get('id')
        if usuario_id:
            usuario = Usuario.objects.get(id=usuario_id)
        else:
            usuario = Usuario()
            usuario._id = ObjectId()
            usuario.id = "USR" + str(Usuario.objects.count() + 1).zfill(3)

        usuario.nombre = request.POST.get('nombre')
        usuario.email = request.POST.get('email')
        usuario.rol = request.POST.get('rol')
        usuario.set_password("default123")  # asigna una contraseña por defecto si es nuevo
        usuario.save()
    return redirect('administrativo')


def eliminar_usuario(request, usuario_id):
    Usuario.objects.get(id=usuario_id).delete()
    return redirect('administrativo')


# Panel administrativo - Ventas
def guardar_venta(request):
    if request.method == 'POST':
        venta_id = request.POST.get('id')
        venta = Venta.objects.get(id=venta_id)

        venta.ciudad = request.POST.get('ciudad')
        venta.direccion = request.POST.get('direccion')
        venta.total = int(request.POST.get('total'))
        venta.metodo_pago = request.POST.get('metodo_pago')
        venta.estado_pago = request.POST.get('estado_pago')
        venta.save()
    return redirect('administrativo')


def eliminar_venta(request, venta_id):
    Venta.objects.get(id=venta_id).delete()
    return redirect('administrativo')



# Vista para procesar el pago
@csrf_exempt
def procesar_pago(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            # Crear venta
            venta = Venta.objects.create(
                numero_factura=f"FAC-{Venta.objects.count()+1:04}",
                fecha=timezone.now(),
                cliente={
                    "nombre": data["nombre"],
                    "email": data["email"],
                    "telefono": data["telefono"]
                },
                direccion=data["direccion"],
                ciudad=data["ciudad"],
                metodo_pago=data["metodo_pago"],
                productos=data["items"],
                subtotal=sum(item['price'] * item['quantity'] for item in data['items']),
                impuesto=0,
                total=data["total"],
                estado="Pagado"
            )

            return JsonResponse({"status": "success"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})

    return JsonResponse({"status": "error", "message": "Método no permitido"}, status=405)


def iniciar_sesion(request):
    """
    Vista para el inicio de sesión de usuarios
    """
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            usuario = form.cleaned_data['usuario']
            request.session['usuario_id'] = str(usuario._id)
            request.session['usuario_nombre'] = usuario.nombre
            request.session['usuario_rol'] = usuario.rol

            # Redireccionar según el tipo de usuario
            if usuario.rol == 'Administrador':
                return redirect('administrativo')
            else:
                return redirect('Pagina_Principal')
    else:
        form = LoginForm()

    return render(request, 'panel_administrativo/administrativo.html', {'form': form})


def registro(request):
    """
    Vista para el registro de nuevos usuarios
    """
    if request.method == 'POST':
        form = RegistroForm(request.POST)
        if form.is_valid():
            usuario = form.save()

            # Crear un cliente asociado si el usuario es cliente
            if usuario.rol == 'Cliente':
                cliente = Cliente(
                    usuario=usuario,
                    nombre=usuario.nombre,
                    contacto={"email": usuario.email},
                )
                cliente.save()

            # Redireccionar a la página de inicio de sesión con mensaje de éxito
            return redirect('iniciar_sesion')
    else:
        form = RegistroForm()

    return render(request, 'autenticacion/registro.html', {'form': form})


def cerrar_sesion(request):
    """
    Vista para cerrar la sesión del usuario
    """
    # Limpiar datos de sesión
    request.session.flush()
    return redirect('Pagina_Principal')


@login_required
def mi_cuenta(request):
    """
    Vista para que los usuarios vean y editen su información de cuenta
    """
    usuario_id = request.session.get('usuario_id')
    if not usuario_id:
        return redirect('iniciar_sesion')

    usuario = get_object_or_404(Usuario, _id=usuario_id)

    # Si el usuario es un cliente, obtener su objeto Cliente asociado
    cliente = None
    if usuario.rol == 'Cliente':
        try:
            cliente = Cliente.objects.get(usuario=usuario)
        except Cliente.DoesNotExist:
            # En caso de que el cliente no exista, crearlo
            cliente = Cliente(
                usuario=usuario,
                nombre=usuario.nombre,
                contacto={"email": usuario.email},
            )
            cliente.save
