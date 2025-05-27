"""
URL configuration for Proyecto_Veterinaria project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from Veterinaria import views

app_name = 'Veterinaria'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.PaginaPrincipal, name='Pagina_Principal'),
    path('administrativo/', views.Administrativo, name='administrativo'),
    path('contacto/', views.Contacto, name='contacto'),
    path('productos/', views.Productos, name='productos'),
    path('checkout/', views.checkout, name='checkout'),
    path('procesar-pago/', views.procesar_pago, name='procesar_pago'),
    path('guardar-producto/', views.guardar_producto, name='guardar_producto'),
    path('editar-producto-modal/', views.editar_producto_modal, name='editar_producto_modal'),
    path('eliminar-producto/<str:producto_id>/', views.eliminar_producto, name='eliminar_producto'),
    path('guardar-cliente/', views.guardar_cliente, name='guardar_cliente'),
    path('eliminar-cliente/<str:cliente_id>/', views.eliminar_cliente, name='eliminar_cliente'),
    path('guardar-proveedor/', views.guardar_proveedor, name='guardar_proveedor'),
    path('eliminar-proveedor/<str:proveedor_id>/', views.eliminar_proveedor, name='eliminar_proveedor'),
    path('guardar-usuario/', views.guardar_usuario, name='guardar_usuario'),
    path('eliminar-usuario/<str:usuario_id>/', views.eliminar_usuario, name='eliminar_usuario'),
    path('guardar-venta/', views.guardar_venta, name='guardar_venta'),
    path('eliminar-venta/<str:venta_id>/', views.eliminar_venta, name='eliminar_venta'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])