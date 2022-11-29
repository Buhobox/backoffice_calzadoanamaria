import { create } from "apisauce";
const baseurl =
  "https://integwebapimentaoficialbodega20211022.azurewebsites.net/api/";

let dataexample = {
  Cliente: {
    NumeroDocumento: "0",
    PrimerApellido: "Soto",
    SegundoApellido: "Camacho",
    PrimerNombre: "Oscar",
    SegundoNombre: "Versalles 1",
    Telefono: "3164663057",
    CodigoDaneCiudad: "68001",
    TipoRegimen: 0,
    Direccion: "DIAGONAL NO SE QUE",
    Email: "marioupc3@gmail.com",
    TipoDocumento: 13,
    Naturaleza: 0,
    RegimenFiscalCodigo: "49",
    ResponsabilidadesFiscalesCodigo: "R-99-PN",
    TributosCodigo: "ZZ",
  },
  FormasPago: [
    {
      Codigo: 1,
      Valor: 50000,
      NumeroComprobante: "5328",
      TipoTarjetas: 0,
      CodigoFranquiciaTarjetas: 1,
    },
  ],
  Producto: [
    {
      Referencia: 22,
      CodigoBarras: "00010012",
      Cantidad: 1,
      PrecioVentaConIva: 50000,
      PorcentajeIva: 19,
      IdIva: 0,
      ValorBase: 50000,
      PorcentajeDescuento: 0,
      TotalDescuento: 0,
      ValorTotal: 50000,
      Combo: 0,
      CostoUnitario: 0,
    },
  ],
  NumeroDocumentoEmpleado: "0",
  TipoNumeracion: 0,
  Token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZERvY3VtZW50byI6IjAiLCJEaXJlY2Npb25JcCI6ImFRYVVhdkd3Wi9qMTlWNVFqemcxTFUvQjZTVVhRWEhCcFpSZ2d0OE96a0E9IiwiVXN1YXJpbyI6IkRNOEMyaE8wU1BYYjVJNXFDbTZISGl2K2tYQVZ5YkpwbkhqNm1QcGl1UHM9IiwiQ29udHJhc2VuYSI6Ik5NRmp3b2Y5RnBmNTlCTnNPZlVQVWtSUGFZWTlFQXpaU3cwaHRaU29NMFNLQXUwUllrVTQ2MXQ1QXl2NEN5bWIiLCJFc3F1ZW1hIjoiRWFVM29LVjloMXBjOVorLzJRd1ZONGY0OW5LRklmZHU5Zmo3bzhGemRBMTNqMlQyS0g5K3dxNm1ZMDF0Nmk4biIsIkhhYmlsaXRhckNvbnRhYmlsaWRhZCI6IlRydWUiLCJJZFVzdWFyaW8iOiIxIiwiU2VydmljaW8iOiIwIiwibmJmIjoxNjI3NDg0ODE3LCJleHAiOjE2Mjc0ODUxMTcsImlhdCI6MTYyNzQ4NDgxNywiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0OTIyMCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDkyMjAifQ.UC_w01-kNFt3vw1nkRBBQLulJr4xpG0Zl5Y-PTXzrm0",
};

const api = create({
  baseURL: baseurl,
  body: dataexample,
  headers: {
    "Access-Control-Allow-Origin": "https://localhost:3000/",
    "Content-Type": "application/json",
    withCredentials: false,
    mode: "no-cors",
  },
});

export const GenerateFactura = (data) => api.post(`GuardarFacturaVenta`);
