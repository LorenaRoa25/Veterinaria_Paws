# Proyecto Veterinaria Paws 

Este es un sistema de gestión para una veterinaria llamada "Paws", desarrollado con Django y MongoDB (utilizando Djongo).

## Requisitos 

- Python 3.12
- pip (gestor de paquetes de Python)
- MongoDB (instalado y en ejecución)

## Instalación 

1. Clona el repositorio o copia el proyecto:

```bash
git clone <URL_DEL_REPOSITORIO>
cd Proyecto_Veterinaria
```

2. Crea un entorno virtual (opcional pero recomendado):

```bash
python -m .entVirt .entVirt
source .entVirt/bin/activate   # En Linux/macOS
.entVirt\Scripts\activate    # En Windows
```

3. Instala las dependencias:

```bash
pip install -r requirements.txt
```

4. Configura la base de datos MongoDB en `settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'Veterinaria_BD',
    }
}
```

5. Ejecuta migraciones (si es necesario):

```bash
python manage.py makemigrations
python manage.py migrate
```

6. Ejecuta el servidor:

```bash
python manage.py runserver
```

## Uso 

Abre tu navegador en `http://127.0.0.1:8000/` para ver el sitio. Para ingresar al panel administrativo, ve a `/admin`.

---

### Notas 

- Asegúrate de tener MongoDB corriendo antes de iniciar el proyecto.
- Crea la base de datos en MongoDB utilizando los archivos que se adjutan en la carpeta llamada "Base_Datos_Mongo"
