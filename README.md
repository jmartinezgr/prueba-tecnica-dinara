DOCUMENTACIÓN DEL PROYECTO - PRUEBA TÉCNICA DINARA

PASOS PARA INICIAR EL PROYECTO:

Clonar el repositorio:
```bash
git clone https://github.com/jmartinezgr/prueba-tecnica-dinara.git
```
Entrar al directorio del proyecto:
```bash
cd prueba-tecnica-dinara
```
> ⚠️ **IMPORTANTE:** Asegurate de tener docker desktop instalado y corriendo en el momento de ejecutar el siguiente comando.
Ejecutar el comando para iniciar los servicios:
```bash
docker-compose up --build -d
```

NOTAS SOBRE LA EJECUCIÓN:

Este comando construirá todas las imágenes necesarias

Iniciará los contenedores en modo detached (segundo plano)

La primera ejecución puede tardar varios minutos mientras descarga dependencias

Los servicios quedarán disponibles en los siguientes puertos

ENDPOINTS DISPONIBLES:

Frontend: http://localhost:5000
Backend (API Gateway): http://localhost:3000/api/

ARQUITECTURA DEL SISTEMA:

El backend consiste en:

3 microservicios independientes construidos en NestJS

Cada microservicio tiene su propia base de datos PostgreSQL

Comunicación entre servicios mediante protocolo TCP

Arquitectura basada en API Gateway (NestJS)

VENTAJAS DEL DISEÑO:

Separación clara de responsabilidades

Posibilidad de escalar componentes individualmente

Aislamiento de fallos entre servicios

Independencia en el desarrollo y despliegue

FRONTEND:

Interfaz completa construida con React y TypScript y MateriaMUI

Módulos para creación y visualización de datos

Consume los endpoints del backend

Diseño responsive

INFORMACIÓN ADICIONAL:
Para más detalles técnicos, consultar el repositorio:
https://github.com/jmartinezgr/prueba-tecnica-dinara
