import axios from "axios";
import { toast } from "react-toastify";
import { baseurl, baseurlwc, credentials } from "./api";

const loginURL = `${baseurl}login/authenticate`;
const URL = "https://santandereanadecascos.buhobox.com.co/apidanementa/public/api/citydane/"

const MedioDePago = (medioPago) => {
  switch (medioPago) {
    case "woo-mercado-pago-basic":
      return 1;

    default:
      return 8;
  }
};

export const GetTokenProducto = async (TypeProduct) => {

  let cadena = "fypoY3mulJAruo2oYS3P6/7ICmrzWAdHIutWvnn9cl8MDKrYtm4XlePe9cpgXwwh";
  // if (TypeProduct === 2) {
  //   cadena = "znSbP63R5Lp2Bfmh81pATZ25qCpQENHAvPZBPIdqeJL4P+1S+Lm0n0Lgg7ccRsYs8orad9dC4BD40mxuKBw/6Q==";
  // }

  return await axios.post(
    loginURL,
    {
      IdDocumento: "0",
      Cadena: [`${cadena}`],
      HabilitarContabilidad: true,
      IdUsuario: 1,
      Usuario: "PAGINA",
      Contrasena: "PAGINA",
      Servicio: 1,
    }
  );
};

export const GetToken = async (type) => {
  let cadena = "fypoY3mulJAruo2oYS3P6/7ICmrzWAdHIutWvnn9cl8MDKrYtm4XlePe9cpgXwwh";
  // if (type === "accesorios") {
  //   cadena = "znSbP63R5Lp2Bfmh81pATZ25qCpQENHAvPZBPIdqeJL4P+1S+Lm0n0Lgg7ccRsYs8orad9dC4BD40mxuKBw/6Q==";
  // }

  // console.log("cadena", cadena,type);
  return await axios.post(
    loginURL,
    {
      IdDocumento: "0",
      Cadena: [`${cadena}`],
      HabilitarContabilidad: true,
      IdUsuario: 1,
      Usuario: "PAGINA",
      Contrasena: "PAGINA",
      Servicio: 0,
    }
  );
};

const SendFactura = async (datafactura) => {
  return await axios.post(
    `${baseurl}GuardarFacturaVenta/api/GuardarFacturaVenta`,
    datafactura
  );
};

const FacturaToChangeStatus = (datafactura, facturaId) => {
  switch (datafactura.status) {
    case "procesadoig":
      axios.put(`${baseurlwc}/orders/${datafactura.id}?${credentials}`, {
        status: "facturadoig",
      });
      break;

    case "procesadowasa":
      axios.put(`${baseurlwc}/orders/${datafactura.id}?${credentials}`, {
        status: "facturadowasa",
      });
      break;

    case "procesadomayo":
      axios.put(`${baseurlwc}/orders/${datafactura.id}?${credentials}`, {
        status: "facturadomayo",
      });
      break;

    case "processing":
      axios.put(`${baseurlwc}/orders/${datafactura.id}?${credentials}`, {
        status: "facturado",
      });

      break;

    default:
    //

  }
};

async function GetProduct(idProduct) {
  return new Promise(async (resolve, reject) => {
    return axios
      .get(`${baseurlwc}/products/${idProduct}/?${credentials}`)
      .then((response) => {
        let esAccesorios = false;
        let accesorios = response.data.meta_data.find(
          (meta) => meta.key === "menta_accesorios"
        );
        let pijama = response.data.categories.find(
          (meta) => meta.slug === "pijamas"
        );
        let accesorios2 = response.data.categories.find(
          (meta) => meta.slug === "accesorios"
        );
        let mentaAccesorios = response.data.categories.find(
          (meta) => meta.slug === "mentaaccesorios"
        );

        if (accesorios || pijama || mentaAccesorios || accesorios2) {
          esAccesorios = true;
        } else {
          esAccesorios = false;
        }
        resolve(esAccesorios);
      });
  });
}

export const GenerateFactura = (dataFactura, callback) => {
  let MedioDePagoFactura = MedioDePago(dataFactura.payment_method);

  let codigoCiudad = "";
  let cedula = 0;
  if (dataFactura.meta_data[2].key === "_billing_cedula") {
    cedula = dataFactura.meta_data[2].value;
  }

  axios
    .get(`${URL}${dataFactura.billing.city}`)
    .then((response) => {
      codigoCiudad = response.data[0].codigo;
      const Cliente = {
        NumeroDocumento: cedula,
        PrimerApellido: dataFactura.billing.last_name || "--- | ---",
        SegundoApellido: "",
        PrimerNombre: dataFactura.billing.first_name || "--- | ---",
        SegundoNombre: "",
        Telefono: dataFactura.billing.phone,
        CodigoDaneCiudad: codigoCiudad,
        TipoRegimen: 0,
        Direccion: dataFactura.billing.address_1,
        Email: dataFactura.billing.email,
        TipoDocumento: 13,
        Naturaleza: 0,
        RegimenFiscalCodigo: "49",
        ResponsabilidadesFiscalesCodigo: "R-99-PN",
        TributosCodigo: "ZZ", // TODO: Revisar ZZ (no existe), ZY - No causa
      };

      //obtener productos
      let productos = [];
      let sumTotalsProduct = 0;
      let sumTotalsProductAccesorios = 0;
      let productosAccesorios = [];
      let procesados = 0;

      let PromiseFundamental = new Promise(function (resolve, reject) {
        try {
          toast.info("Procesando . . .");
          dataFactura.line_items.forEach((product) => {
            let individual = {
              Referencia: product.id,
              CodigoBarras: product.sku,
              Cantidad: product.quantity,
              PrecioVentaConIva: parseInt(product.total),
              PorcentajeIva: 19,
              IdIva: 0,
              ValorBase: parseInt(product.total),
              PorcentajeDescuento: 0,
              TotalDescuento: 0,
              ValorTotal: parseInt(product.total),
              Combo: 0,
              CostoUnitario: 0,
            };

            GetProduct(product.product_id).then((response) => {
              procesados++;
              if (response) {
                productosAccesorios.push(individual);
                sumTotalsProductAccesorios =
                  parseInt(sumTotalsProductAccesorios) +
                  parseInt(product.total * product.quantity);
              } else {
                productos.push(individual);
                sumTotalsProduct =
                  parseInt(sumTotalsProduct) +
                  parseInt(product.total * product.quantity);
              }
              // console.log("datos", dataFactura.line_items.length + " | " + procesados);
              if (dataFactura.line_items.length === procesados) {
                toast.dismiss();
                resolve({
                  accesorios: productosAccesorios,
                  menta: productos,
                  total: sumTotalsProduct,
                  totalaccesorios: sumTotalsProductAccesorios,
                });
              }
            });
          });
        } catch (e) {
          reject(e);
        }
      });


      PromiseFundamental.then((response) => {

        let FacturaDataAccesorios = {
          Cliente,
          NumeroOrdenPedido: dataFactura.id.toString(),
          FormasPago: [
            {
              Codigo: MedioDePagoFactura,
              Valor: parseInt(response.totalaccesorios),
              NumeroComprobante: dataFactura.id.toString(),
              TipoTarjetas: 0,
              CodigoFranquiciaTarjetas: 1,
              CodigoCuentaBancaria: MedioDePagoFactura === 8 ? 9 : '',
            },
          ],
          Producto: response.accesorios,
          NumeroDocumentoEmpleado: "0",
          TipoNumeracion: 1,
          HabilitarContabilidad: true,
        };

        let FacturaData = {
          Cliente,
          NumeroOrdenPedido: dataFactura.id.toString(),
          FormasPago: [
            {
              Codigo: 1,
              Valor: parseInt(response.total),
              NumeroComprobante: dataFactura.id.toString(),
              TipoTarjetas: 0,
              CodigoFranquiciaTarjetas: 1,
              CodigoCuentaBancaria: MedioDePagoFactura === 8 ? 9 : '',
            },
          ],
          Producto: response.menta,
          NumeroDocumentoEmpleado: "9999999",
          TipoNumeracion: 1,
          HabilitarContabilidad: true,
        };

        if (FacturaDataAccesorios.Producto.length > 0) {
          let GenerateFacturAccesorios = new Promise(function (resolve, reject) {
            const getToken = GetToken("accesorios");
            toast.configure();
            toast.promise(getToken, {
              pending: "Obteniendo token factura accesorios",
              success: "Procediendo a facturar 👌",
              error: "Hubo un error en el servidor 🤯",
            });
            getToken.then((token) => {
              FacturaDataAccesorios.Token = token.data;
              SendFactura(FacturaDataAccesorios).then((response) => {
                if (response.data.Exito) {
                  toast.success(
                    `Factura Accesorios #${response.data.NumeroFactura} generada  👌 `,
                    {
                      autoClose: false,
                    }
                  );
                  console.log(
                    "FACTURA GENERADA ACCESORIOS ===> ",
                    response.data.NumeroFactura
                  );
                  resolve({ ok: true, data: response.data });
                } else {
                  toast.error(`Problema: ${response.data.MensajeError}`);
                  callback(dataFactura.id);
                  resolve({ ok: false });
                }
              });
            });
          });

          GenerateFacturAccesorios.then((response) => {
            if (response.ok && FacturaData.Producto.length > 0) {
              // FACTURA NORMAL MENTA
              const getToken = GetToken();
              toast.configure();
              toast.promise(getToken, {
                pending: "Obteniendo token",
                success: "Procediendo a facturar 👌",
                error: "Hubo un error en el servidor 🤯",
              });
              getToken.then((token) => {
                FacturaData.Token = token.data;
                SendFactura(FacturaData).then((response) => {
                  if (response.data.Exito) {
                    toast.success(
                      `Factura Santandereana Oficial #${response.data.NumeroFactura} generada  👌 `,
                      {
                        autoClose: false,
                      }
                    );
                    console.log(
                      "FACTURA GENERADA SANTANDEREANA OFICIAL ===> ",
                      response.data.NumeroFactura
                    );
                    FacturaToChangeStatus(dataFactura, response.data);
                    callback(dataFactura.id);
                  } else {
                    toast.error(`Problema: ${response.data.MensajeError}`);
                    callback(dataFactura.id);
                  }
                });
              });
            }
          });
        } else {
          // FACTURA NORMAL MENTA
          const getToken = GetToken();
          toast.configure();
          toast.promise(getToken, {
            pending: "Obteniendo token",
            success: "Procediendo a facturar 👌",
            error: "Hubo un error en el servidor 🤯",
          });
          getToken.then((token) => {
            FacturaData.Token = token.data;
            SendFactura(FacturaData).then((response) => {
              if (response.data.Exito) {
                toast.success(
                  `Factura santandereana Oficial #${response.data.NumeroFactura} generada  👌 `,
                  {
                    autoClose: false,
                  }
                );
                console.log(
                  "FACTURA GENERADA SANTANDEREANA ===> ",
                  response.data.NumeroFactura
                );
                callback(dataFactura.id);
                FacturaToChangeStatus(dataFactura, response.data);
              } else {
                callback(dataFactura.id);
                toast.error(`Problema: ${response.data.MensajeError}`);
              }
            });
          });
        }
      });
    });
};

export const TypeIva = [
  {
    Codigo: 1,
    Descripcion: "IVA 19%",
    Valor: "19%",
  },
  {
    Codigo: 2,
    Descripcion: "IVA 5%",
    Valor: "5%",
  },
  {
    Codigo: 3,
    Descripcion: "EXENTO",
    Valor: "EXENTO",
  },
];

export const TypeProduct = [
  {
    Codigo: 1,
    Descripcion: "Producción",
    Valor: "Producción",
  },
  // {
  //   Codigo: 2,
  //   Descripcion: "Accesorios",
  //   Valor: "Accesorios",
  // },
  {
    Codigo: 3,
    Descripcion: "Prueba",
    Valor: "Prueba",
  },
];
