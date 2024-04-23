# Dashboard santandereana de cascos oficial | Modulos facturación & Gestión de productos

Este proyecto fue creado con [Create React App](https://github.com/facebook/create-react-app).

## Scripts disponibles

En el root del proyecto puedes correr los siguientes comandos:

### `yarn start`
  inicializa el proyecto

### `yarn test`

Ejecuta los test programados

### `yarn build`
  Compila el proyecto para hacer un deploy, genera el codigo compilado en la carpeta /build

  
### `PREVIEW OR TESTING STAGING`
https://santandereanadashboard.vercel.app/

### `Tecnologias Utilizadas`
  1. Firebase => https://firebase.google.com/
  2. React Js  => https://es.reactjs.org/
  3. Woccomerme Api => https://woocommerce.com/document/woocommerce-rest-api/3

### `CREDENCIALES API`
  las credenciales api de woccomerce api estan incluidas en los enviroments del proyecto y los componentes independientes,
  en caso de necesitar generar otras claves de api seguir paso a paso de documentación => https://woocommerce.com/document/woocommerce-rest-api/

### `MODULO DE FACTURACIÓN`
    1. cuenta con un buscador de pedidos
    2. se utilizo firebase realtime para llevar un control de cola y evitar facturas repetidas
    3. el boton facturar cuenta con el metodo de actualizar el estado del pedido(metodo de woccomerce api #seccion products) a completado ó completado mayorista en caso de que el pedido 
    lo realizó un usuario mayorista
    
    
  ### `MODULO DE GESTIÓN DE PRODUCTOS`  
  
      1. Se puede crear productos simples y productos variables
      2. los productos variables se le agregan attributos y esos atributos tienen terminos los cuales se utilizan para crear variaciones de ese producto
      3. se utiliza api de ARI => https://integwebapimentaoficialbodega20211022.azurewebsites.net/api/GuardarProducto
 
  ### `RECURSOS Y DOCUMENTACIÓN`
  
  DOCUMENTACIÓN API DE SISTEMA ARI => https://integwebapimentaoficialbodega20211022.azurewebsites.net/swagger/ui/index#/
      
    
    
    
    
    
    
