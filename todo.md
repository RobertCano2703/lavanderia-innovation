# Project TODO

- [x] Crear layout administrativo con sidebar azul marino y área de contenido crema
- [x] Configurar identidad visual exacta de Lavanderia Innovation
- [x] Implementar dashboard con resumen diario y conteo de tickets por estado
- [x] Implementar gestión de clientes con alta, edición, detalle y eliminación
- [x] Implementar gestión de servicios con precio, descripción y activación/desactivación
- [x] Implementar gestión de personal de entrega con estado activo/inactivo
- [x] Implementar gestión de domicilios/tickets con estados, horarios, prendas y notas
- [x] Implementar modal de confirmación de eliminación con acción roja
- [x] Implementar gestión de usuarios con roles Administrador y Empleado
- [x] Implementar autenticación local por contraseña sin proveedores externos
- [x] Implementar formulario público de solicitud con enlace wa.me
- [x] Implementar recibo POS con botón Imprimir y estilos @media print
- [x] Crear esquema relacional de usuarios, clientes, servicios, personal_entrega y domicilios
- [x] Crear seed de usuario administrador, servicios y repartidores de muestra
- [x] Escribir y ejecutar pruebas Vitest para funciones principales
- [x] Verificar responsive design, compilación y flujo visual en navegador

## Pendientes detectados en verificación

- [x] Implementar CRUD real de clientes con formularios, detalle, edición y eliminación persistidos en base de datos
- [x] Implementar autenticación local completa con backend, hash de contraseña, sesiones y uso real de local_users
- [x] Crear formulario público de solicitud con enlace wa.me funcional
- [x] Agregar claves foráneas y relaciones reales al esquema de tickets
- [x] Implementar seed de base de datos para administrador, servicios y repartidores
- [x] Añadir pruebas Vitest de módulos principales y validar responsive/flujo en escritorio y móvil

## Pendientes técnicos de integración

- [x] Implementar clientes con CRUD backend real mediante base de datos, router y UI
- [x] Construir autenticación local completa con sesión de servidor y validación contra local_users
- [x] Exponer el formulario de solicitud en una ruta pública accesible sin login
- [x] Crear y ejecutar un seed real de base de datos para administrador, servicios y repartidores
- [x] Añadir pruebas de flujos CRUD, autenticación, tickets, solicitud e impresión y comprobar responsive móvil

## Mejoras solicitadas por el usuario

- [x] Crear formulario completo de clientes con nombres, apellidos, teléfono, dirección y correo
- [x] Rediseñar modal de eliminación de clientes con confirmación visual mejorada
- [x] Implementar crear, editar y eliminar servicios
- [x] Implementar crear, editar y eliminar domiciliarios
- [x] Implementar cambio de estado, creación y edición de domicilios
- [x] Integrar impresión dentro de las acciones de cada domicilio
- [x] Rediseñar el panel de domicilios según la imagen de referencia
- [x] Implementar crear, editar y eliminar usuarios
- [x] Verificar formularios, modales, acciones y responsive en navegador

## Corrección visual solicitada

- [x] Corregir transparencia de modales y formularios de creación
- [x] Asegurar fondo opaco, campos legibles y contraste adecuado en diálogos
- [x] Verificar la corrección en escritorio y móvil

## Experiencia pública y pedidos

- [x] Crear landing pública con banner promocional de Lavanderia Innovation
- [x] Incorporar las imágenes promocionales proporcionadas por el usuario
- [x] Añadir formulario público de pedido con datos del cliente, dirección, servicio y horario
- [x] Crear el domicilio en la lista administrativa al enviar el pedido
- [x] Generar enlace de WhatsApp con el resumen del pedido para confirmación
- [x] Separar claramente el acceso público del acceso administrativo
- [x] Verificar el flujo público en escritorio y móvil

## Horarios de solicitud actualizados

- [x] Configurar lunes a viernes con ruta mañana de 9:30 a. m. a 12:30 p. m. y ruta tarde de 2:30 p. m. a 5:00 p. m.
- [x] Configurar sábados únicamente de 9:30 a. m. a 12:00 p. m.
- [x] Bloquear domingos como día sin servicio en la solicitud pública
- [x] Mostrar los horarios disponibles de forma clara al cliente

## Catálogo real de servicios

- [x] Reemplazar los servicios de ejemplo por los 47 productos proporcionados
- [x] Configurar los precios exactos en pesos colombianos
- [x] Mantener los servicios disponibles en el catálogo público y administrativo
- [x] Confirmar el precio faltante de “Juego S” antes de cerrar el catálogo
- [x] Verificar nombres, códigos, orden y precios del catálogo

## Corrección del catálogo

- [x] Eliminar el servicio con código 98 “No aparece en el documento”
- [x] Verificar que el catálogo conserve los demás códigos y no muestre el registro 98

## Validación adicional del catálogo

- [x] Conectar el catálogo público al estado actualizado de servicios administrativos
- [x] Añadir una prueba explícita de códigos, precios, orden y ausencia del código 98

## Robustez final del catálogo

- [x] Inicializar la solicitud pública con el primer servicio activo real y manejar catálogo vacío
- [x] Validar exhaustivamente nombre y precio de cada uno de los 103 registros

## Segmentación del catálogo

- [x] Clasificar los servicios en Ropa de mujer, Ropa de hombre, Camas, Muebles y Niños
- [x] Mostrar navegación o filtros por segmento en el catálogo público
- [x] Mostrar la categoría en el módulo administrativo de servicios
- [x] Verificar que todos los servicios conserven su precio y queden clasificados

## Precisión de segmentos

- [x] Sustituir la clasificación heurística por un mapeo explícito para los 103 servicios
- [x] Revisar manualmente los servicios ambiguos y asignarlos a un segmento coherente
- [x] Añadir una prueba Vitest que valide la categoría esperada de cada servicio
- [x] Revisar visualmente segmentos público y administrativo con servicios representativos

## Evidencia adicional de segmentación

- [x] Documentar la categoría asignada a servicios ambiguos como Servicio Extra, Otra Prenda, Tintura Prenda, Toalla y Muñeco
- [x] Ampliar la prueba para comparar la categoría esperada de los 103 servicios
- [x] Capturar y registrar la revisión visual del módulo administrativo de servicios segmentado

## Verificación administrativa de segmentos

- [x] Capturar el módulo administrativo de servicios con sus filtros y categorías visibles
- [x] Registrar que los segmentos administrativos funcionan con tarjetas representativas

## Ajuste de portada pública

- [x] Ocultar el listado de servicios de la página inicial
- [x] Mantener la opción Servicios visible y funcional desde la navegación
- [x] Verificar que la portada conserve el banner, el pedido y el acceso administrativo

## Cierre de sesión

- [x] Enviar al usuario a la página pública principal después de cerrar sesión
- [x] Evitar que el cierre de sesión muestre la pantalla de login como destino inmediato
- [x] Verificar el flujo de cierre de sesión y la navegación pública

## Verificación real de cierre de sesión

- [x] Probar en el navegador el cierre de sesión desde el panel administrativo
- [x] Confirmar que después del cierre aparecen la landing pública, el banner y la navegación pública

## Ajuste del botón de login

- [x] Cambiar “Ingresar al sistema” por “Acceder”
- [x] Verificar que el acceso continúe funcionando después del cambio
- [x] Probar en el navegador el botón “Acceder” y confirmar que abre el panel administrativo

## Incidencia reportada: solicitud móvil no visible

- [x] Reproducir el caso de una solicitud pública creada desde celular y revisar por qué no aparece en Domicilios / Tickets
- [x] Garantizar persistencia y sincronización del pedido público en el panel administrativo
- [x] Añadir pruebas de regresión para creación pública y visibilidad administrativa
- [x] Verificar el flujo corregido en viewport móvil y escritorio

## Correcciones reportadas: precios, acceso y sesión

- [x] Corregir el precio persistido de los servicios en tickets públicos y recibos POS
- [x] Restaurar el botón visible de iniciar sesión o ingresar en la portada pública
- [x] Mantener la sesión administrativa al actualizar la página
- [x] Añadir pruebas para precios de tickets y persistencia de sesión
- [x] Verificar el flujo corregido en escritorio, móvil y recibo imprimible

## Brechas detectadas antes de publicación final
- [x] Restaurar la sesión mediante autenticación real de servidor/cookie y validar auth.me al recargar
- [x] Añadir pruebas funcionales de restauración de sesión y precio persistido en ticket/recibo
- [x] Verificar en viewport móvil posterior a los cambios y revisar explícitamente el recibo imprimible

## Ajustes solicitados en la pantalla de login
- [x] Quitar la leyenda visible de credenciales demo admin/admin123
- [x] Hacer clicable el logotipo de Lavanderia Innovation para volver a la portada pública
- [x] Centrar y reforzar visualmente el botón Acceder en la ventana de login
- [x] Verificar navegación, responsive y compilación del login

## Configuración funcional del panel
- [x] Conectar el botón Configuración con una sección real del panel
- [x] Mostrar ajustes operativos, horarios y datos de contacto del negocio
- [x] Añadir pruebas de navegación y contenido de Configuración
- [x] Verificar la interacción en escritorio y móvil

### Verificaciones adicionales de Configuración
- [x] Añadir una prueba automatizada funcional que valide navegación y renderizado de Configuración
- [x] Verificar Configuración en viewport móvil y registrar la adaptación de campos y Guardar cambios

## Incidencia: usuarios administradores creados no pueden iniciar sesión
- [x] Permitir escribir el nombre de usuario en el login
- [x] Autenticar contra usuarios administradores creados desde el módulo Usuarios
- [x] Permitir eliminar o editar usuarios sin depender del admin quemado
- [x] Añadir pruebas y verificar el flujo completo de creación y acceso

### Brechas pendientes de validación de usuarios
- [x] Verificar en navegador la edición de un usuario creado desde el panel y confirmar el login con credenciales actualizadas
- [x] Añadir una prueba automatizada de autenticación contra local_users con un usuario creado por Usuarios
- [x] Añadir una prueba automatizada de CRUD persistente de Usuarios, incluyendo edición y eliminación

## Vista previa interna de recibos
- [x] Abrir una ventana interna de vista previa al pulsar imprimir desde Domicilios/Tickets
- [x] Mostrar tira imprimible con botones Imprimir y Cerrar sin navegar a Dashboard
- [x] Mantener el total, datos del cliente y formato térmico del recibo
- [x] Añadir pruebas y verificar impresión, cancelación y responsive

### Verificaciones pendientes de la vista previa
- [x] Verificar la vista previa interna del recibo en viewport móvil y confirmar que conserva scroll y botones accesibles
- [x] Probar el botón Imprimir y cancelar el diálogo del navegador, confirmando que permanece en Domicilios/Tickets

## Mejoras solicitadas en Domicilios/Tickets
- [x] Mostrar el catálogo de servicios en el formulario Nuevo domicilio y autocompletar su precio
- [x] Mostrar clientes existentes y añadir Crear cliente con el mismo formulario del módulo Clientes
- [x] Guardar el domicilio usando el cliente y servicio seleccionados
- [x] Hacer funcional Buscar ticket con filtrado por número, cliente y servicio
- [x] Hacer funcional Estado con filtrado por estado del ticket
- [x] Añadir pruebas de selección, alta rápida y filtros
- [x] Verificar el flujo completo en escritorio y móvil

## Ajustes reportados: cliente y domiciliario en Domicilios/Tickets
- [x] Dejar Crear cliente únicamente como opción dentro del selector de clientes y quitar el botón duplicado
- [x] Permitir seleccionar un domiciliario real en Nuevo/Editar domicilio y persistir la asignación
- [x] Añadir pruebas para la opción desplegable de Crear cliente y la asignación de domiciliario
- [x] Verificar el formulario corregido en escritorio y móvil
