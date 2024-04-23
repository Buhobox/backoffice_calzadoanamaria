import pending from './img/pending.png';
import processing from './img/procesing.png';
import completed from './img/completed.png';
import espera from './img/espera.png';
import canceled from './img/canceled.png';
import enviadomayorista from './img/enviadomayorista.png';
import enviado from './img/enviado.png';
import rembolsado from './img/rembolsado.png';
import totalventas from './img/dinerototal.png';
import ventasnetas from './img/neto.png';
import totalenvio from './img/totalenvio.png';
import countordenes from './img/countordenes.png';

const reducer = (accumulator, currentValue) => accumulator + currentValue;

export function getNowDateIso() {
  var date = new Date();
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }

  let dataISO = `${date.getFullYear()}-${month}-01T00:00:00`;
  return dataISO;
}

export function getNextDateIso() {
  var date = new Date();
  let month = date.getMonth() + 2;
  if (month < 10) {
    month = `0${month}`;
  }

  let dataISO = `${date.getFullYear()}-${month}-01T00:00:00`;
  return dataISO;
}

export function TotalOrders(orders) {
  let totals = [];
  orders.map((order) => {
    totals.push(parseInt(order.total));
  });
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  return totals.reduce(reducer);
}

export const ColorsGeneral = { mentacolor: "#ff6767" };

export const Copyright = () => {
  let date = new Date();
  return `Santandereana de cascos  ${date.getFullYear()}`;
};

export function AmounTotal(orders) {
  let totals = [];
  if (orders.length > 0) {
    orders.map((order) => {
      totals.push(parseInt(order.total));
    });
  }

  return totals.length > 0 ? totals.reduce(reducer) : 0;
}

export const formatterPeso = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
});

export const TotaltoMoneyCop = (amount) => {
  return formatterPeso.format(amount);
};

export const PorcentajesTotal = (amount1, amount2) => {
  let total = parseInt(amount1 + amount2);
  let porcentaje1 = Math.floor((amount1 / total) * 100);
  let porcentaje2 = Math.floor((amount2 / total) * 100);
  return [porcentaje1, porcentaje2];
};

export const imagesutils = {
    processing:
    processing,
      pending:
      pending,
      completed:
      completed,
      onhold:
      espera,
      cancelled:
      canceled,
      failed:
      canceled,
      sendwholesaler:
      enviadomayorista,
      faltante:
      espera,
      enviado:
      enviado,
      rembolsado:rembolsado,
      totalventas,
      ventasnetas,
      totalenvio,
      countordenes
  };
 

 
 