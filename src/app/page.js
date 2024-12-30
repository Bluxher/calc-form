"use client";
import { useState } from "react";
import moment from "moment";
import Link from 'next/link';
export default function Home() {
  const [tipoCuota, setTipoCuota] = useState('Simple');
  const [inputType,setInpuType] = useState("%");
  const [valorDpto, setValorDpto] = useState("");
  const [cuotaInicial, setCuotaInicial] = useState("");
  const [prestamo, setPrestamo] = useState("");
  const [aniosPagar, setAniosPagar] = useState("");
  const [numeroCuotas, setNumeroCuotas] = useState("");
  const [tasaInteres, setTasaInteres] = useState("8");
  const [datosCuadro, setDatosCuadro] = useState({
    "Valor del Departamento": "-------",
    "Cuota Inicial": "-------",
    "Prestamo": "-------",
    "Años a pagar": "-------",
    "Numero de Cuotas": "-------",
    "Tasa de Interes": "8%",
  });
  const [fechasCuotas, setFechasCuotas] = useState([]);
  const [showGrid, setShowGrid] = useState(false);
  const headTable = [
    "PERIODO DE PAGO",
    "FECHA DE VENCIMIENTO",
    "CAPITAL PENDIENTE",
    "AMORTIZACION",
    "PAGO DE INTERESES",
    "CUOTA MENSUAL",
  ];
  const [inputValue, setInputValue] = useState("");
  
  const fechaActual = new Date();
  const dia = String(fechaActual.getDate()).padStart(2, "0");
  const mes = String(fechaActual.getMonth() + 1).padStart(2, "0");
  const anio = fechaActual.getFullYear();

  const handleInputTypeChange = (type) => {
    setInpuType(type);
    setCuotaInicial("");
  };

  const handleValorDptoChange = (e) => {
    const value = e.target.value;
    setValorDpto(value);
    actualizarPrestamo(value, cuotaInicial);
  };
  const handleCuotaInicialChange = (e) => {
    const value = e.target.value;
    setCuotaInicial(value);
    actualizarPrestamo(valorDpto, value);
  };
  const actualizarPrestamo = (valor, cuota) => {
    const valorNumerico = parseFloat(valor) || 0;
    const cuotaNumerica = parseFloat(cuota) || 0;
    const prestamoCalculadoPorcentaje = valorNumerico - (valorNumerico * cuotaNumerica) / 100;
    const prestamoCalculadoSoles = valorNumerico - cuotaNumerica;
    if(inputType == "%"){
    setPrestamo(prestamoCalculadoPorcentaje.toFixed(2));
    }else
    {
    setPrestamo(prestamoCalculadoSoles.toFixed(2));
    }
  };
  const handleAniosPagarChange = (e) => {
    const value = e.target.value;
    setAniosPagar(value);
    actualizarNumeroCuotas(value);
  };
  const actualizarNumeroCuotas = (anios) => {
    const aniosNumericos = parseInt(anios, 10) || 0;
    setNumeroCuotas(aniosNumericos * 12);
  };

  const handleTasaInteresChange = (e) => {
    const value = e.target.value;
    setTasaInteres(value);
  };

  const calcularFechasCuotas = (cuotas) => {
    const fechas = [];
    const fechaActual = new Date();
    for (let i = 0; i < cuotas; i++) {
      const nuevaFecha = new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth() + i,
        fechaActual.getDate()
      );
      const dia = String(nuevaFecha.getDate()).padStart(2, "0");
      const mes = String(nuevaFecha.getMonth() + 1).padStart(2, "0");
      const anio = nuevaFecha.getFullYear();
      fechas.push(`${dia}/${mes}/${anio}`);
    }
    setFechasCuotas(fechas);
  };
  
  const handleCalcularClick = (e) => {
    e.preventDefault();
    setDatosCuadro({
      "Valor del Departamento": valorDpto || "-------",
      "Cuota Inicial": cuotaInicial || "-------",
      "Prestamo": prestamo || "-------",
      "Años a Pagar": aniosPagar || "-------",
      "Numero de Cuotas": numeroCuotas || "-------",
      "Tasa de Interes": tasaInteres || "8",
    });
  };

  const generateGrid = () => {
    calcularFechasCuotas(numeroCuotas);
    setShowGrid(true);
    llenardatos();
  };

  function handleFormSubmit(event){
    event.preventDefault();
    handleCalcularClick(event);
    generateGrid();
  }

  const cellStyle = {
    border: "1px solid black",
    padding: "10px",
  };

  //---------------------------------FORMULAS---------------------------------------//
  function llenardatos() {
    var rprecio = parseFloat(valorDpto);
    var rinicial = parseFloat(cuotaInicial);
    var rprestamo = parseFloat(prestamo);
    var ranios = parseFloat(aniosPagar);
    var rcuotas = parseFloat(numeroCuotas);
    var rtasa = parseFloat(tasaInteres);
    var rtipocuota = tipoCuota;
    var fecha = "";
    var tem = parseFloat(Math.pow(1 + (rtasa / 100), ((1 / 12))) - 1);
    var factor_actualizacion_primero = 1;
    var factor_actualizacion = 0;
    var suma_especiales = 0;
    var suma_normal = 0;
    var factor_cuota = 0;
    var factor_actualizacion_normal = 0;
    var dateFrom =  moment('2020-04-30').endOf('month').format('YYYY-MM-DD');
    var desde = moment(dateFrom);
    var interes = 0;
    var amort = 0;
    var amort_acum = 0;
    var cuota = 0;
    var cuota_especial = 0;
    var factor_actualizacion_esp = 0;
    var saldo = rprestamo;
  
    var fecha_desembolso = desde;
    var dia_actual = desde.add(1, 'months');
    var fechas = [];
    var fecha_ = '';
    
    // Calcular fechas de cuotas
    for (var i = 0; i < ranios * 12; i++) {
      fecha = dia_actual.endOf('month').format('YYYY-MM-DD');
      if (moment(fecha, 'YYYY-MM-DD').date() == 31) {
        fecha_ = moment(fecha).subtract(1, 'days').format('YYYY-MM-DD');
        fechas.push(moment(fecha_).format('YYYY-MM-DD'));
      } else {
        fechas.push(moment(fecha).format('YYYY-MM-DD'));
      }
      dia_actual.add(1, 'months');
    }
  
    // Calcular los valores para cada cuota
    var cuotasData = [];
    for (var j = 0; j < fechas.length; j++) {
      if (rtipocuota == 'Simple') {
        factor_actualizacion = parseFloat(factor_actualizacion_primero / (1 + tem));
        suma_normal = suma_normal + factor_actualizacion;
        factor_actualizacion_primero = factor_actualizacion;
        factor_cuota = 1 / (suma_especiales + suma_normal);
        cuota = rprestamo * factor_cuota;
        console.log("1 " + cuota);
      } else {
        if (moment(fechas[j], 'YYYY-MM-DD').month() == 6 || moment(fechas[j], 'YYYY-MM-DD').month() == 11) {
          factor_actualizacion = (parseFloat(factor_actualizacion_primero / (1 + tem)));
          const factor_actualizacion_especial = parseFloat((factor_actualizacion_primero / (1 + tem)) * 2);
          suma_especiales = suma_especiales + factor_actualizacion_especial;
          console.log("2" + cuota);
        } else {
          factor_actualizacion = parseFloat(factor_actualizacion_primero / (1 + tem));
          suma_normal = suma_normal + factor_actualizacion;
          console.log("3" + cuota);
        }
        factor_actualizacion_primero = factor_actualizacion;
        factor_cuota = 1 / (suma_especiales + suma_normal);
        cuota = rprestamo * factor_cuota;
        cuota_especial = (rprestamo * factor_cuota) * 2;
        console.log("4 " + cuota);
      }
    }
    for(var k = 0; k<fechas.length; k++){
       if (rtipocuota != 'Simple') {
         if (moment(fechas[k], 'YYYY-MM-DD').month() == 6 || moment(fechas[k], 'YYYY-MM-DD').month() == 11) {
           interes = parseFloat(saldo * tem);
           amort = parseFloat((cuota_especial) - interes);
           saldo = parseFloat(saldo - amort);
           console.log("1 " + amort);
           amort_acum = parseFloat(amort + amort_acum);           
        } else {
           interes = parseFloat(saldo * tem);
           amort = parseFloat(cuota - interes);
           saldo = parseFloat(saldo - amort);
           amort_acum = parseFloat(amort + amort_acum);
           console.log("2 " + amort);
         }
       } else {
         interes = parseFloat(saldo * tem);
         amort = parseFloat(cuota - interes);
         saldo = parseFloat(saldo - amort);

         amort_acum = parseFloat(amort + amort_acum);
         console.log("3 " + amort);
       }

       // Almacenar los resultados para cada cuota
      cuotasData.push({
        periodo: k + 1,
        fechaVencimiento: fechas[k],
        capitalPendiente: saldo.toFixed(2),
        amortizacion: amort.toFixed(2),
        pagoIntereses: interes.toFixed(2),
        cuotaMensual: cuota.toFixed(2),
      });
      }  
    // Guardar los resultados en el estado
    setFechasCuotas(cuotasData);
  }

//--------------------------------MODAL-------------------------------------//
  const [isModalActive, setModalStatus] = useState(false);
  
  const openModal = () => setModalStatus(true);
  const closeModal = () => setModalStatus(false);
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#919483",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center", color: "white", padding: '50px' }}>
        Ingresa los datos correspondientes
      </h1>
      <form
      onSubmit={handleFormSubmit}
        style={{
          backgroundColor: "#f8f5e5",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "400px",
          margin: "0 auto",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          color: "black",
          textAlign: "left",
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <label>Valor del dpto</label>
          <input
            type="number"
            value={valorDpto}
            onChange={handleValorDptoChange}
            placeholder="Valor en moneda"
            style={{ width: "100%", padding: "10px", borderRadius: "4px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
            <label>Cuota inicial</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="number"
                value={cuotaInicial}
                onChange={handleCuotaInicialChange}
                placeholder={inputType === "%" ? "%" : "S/"}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "4px",
                  marginRight: "10px",
                }}
              />
              <button
                type="button"
                onClick={() => handleInputTypeChange("%")}
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  backgroundColor: inputType === "%" ? "#007bff" : "#ccc",
                  color: inputType === "%" ? "white" : "black",
                  marginRight: "5px",
                }}
              >
                %
              </button>
              <button
                type="button"
                onClick={() => handleInputTypeChange("S/")}
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  backgroundColor: inputType === "S/" ? "#007bff" : "#ccc",
                  color: inputType === "S/" ? "white" : "black",
                }}
              >
                S/
              </button>
            </div>
          </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Préstamo</label>
          <input
            type="number"
            value={prestamo}
            readOnly
            placeholder="Monto del préstamo"
            style={{ width: "100%", padding: "10px", borderRadius: "4px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Años a pagar</label>
          <input
            type="number"
            placeholder="Años"
            style={{ width: "100%", padding: "10px", borderRadius: "4px" }}
            value={aniosPagar}
            onChange={handleAniosPagarChange}
          />
        </div>
        <div className="cuota-container">
          <label className="label-titulo">Tipo de cuota</label>
          <div className="opciones">
            <label className="opcion-radio">
              <input
                type="radio"
                name="tipoCuota"
                value="Simple"
                checked={tipoCuota === 'Simple'}
                onChange={() => setTipoCuota('Simple')}
              />
            {console.log(tipoCuota)}
              <span className="texto-radio" style={{padding: "5px"}}>Simple</span>
            </label>

            <label className="opcion-radio">
              <input
                type="radio"
                name="tipoCuota"
                value="Doble"
                checked={tipoCuota === 'Doble'}
                onChange={() => setTipoCuota('Doble')}
              />
              <span className="texto-radio">Doble</span>
            </label>
          </div>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Número de cuotas</label>
          <input
            type="number"
            placeholder="Cuotas"
            style={{ width: "100%", padding: "10px", borderRadius: "4px" }}
            readOnly
            value={numeroCuotas}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Tasa de interés</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="number"
              value={tasaInteres}
              onChange={handleTasaInteresChange}
              placeholder="%"
              style={{ width: "100%", padding: "10px", borderRadius: "4px" }}
            />
            <span style={{ marginLeft: "5px" }}>%</span>
          </div>
        </div>
        <button
          type="submit" 
          style={{
            width: "100%",
            backgroundColor: "#49667a",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          CALCULAR
        </button>
        <a 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            openModal();
          }}
          style={{
            color: "blue",
            padding: "10px",
            textDecoration: "underline",
            cursor: "pointer",
            display: "inline-block",
          }}
          >
            Mas Informacion
        </a>
        <p> =D <Link href= "/about">aqui</Link></p>
        <p> =D <Link href= "/otrama">aqui</Link></p>
        
        {isModalActive && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                backgroundColor: "#f0f0f0",
                padding: "20px",
                borderRadius: "10px",
                textAlign: "center",
                width: "600px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
              }}
            >
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
              <button
                onClick={closeModal}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: "#ff5756",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </form>

      <div
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <div
          style={{
            backgroundColor: "#F0EEDB",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            maxWidth: "1200px",
            width: "100%",
            fontFamily: "Arial, sans-serif",
            color: "#4A5A65",
          }}
        >
          {Object.entries(datosCuadro).map(([key, value]) => (
            <div style={{ textAlign: "center" }} key={key}>
              <p style={{ fontSize: "14px", margin: "0", fontWeight: "bold" }}>{key}</p>
              <p style={{ fontSize: "18px", margin: "5px 0 0" }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        {showGrid && (
          <table 
          style={{ 
            width: "100%", 
            borderCollapse: "collapse", 
            marginTop: "20px" 
            }}>
            <thead>
              <tr>
                {headTable.map((header) => (
                  <th key={header} style={{ ...cellStyle, backgroundColor: "#ddd" }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fechasCuotas.map((cuotaData, index) => (
                <tr key={index}>
                  <td style={cellStyle}>{cuotaData.periodo}</td>
                  <td style={cellStyle}>{cuotaData.fechaVencimiento}</td>
                  <td style={cellStyle}>{cuotaData.capitalPendiente}</td>
                  <td style={cellStyle}>{cuotaData.amortizacion}</td>
                  <td style={cellStyle}>{cuotaData.pagoIntereses}</td>
                  <td style={cellStyle}>{(parseFloat(cuotaData.amortizacion) + parseFloat(cuotaData.pagoIntereses)).toFixed(2)}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}